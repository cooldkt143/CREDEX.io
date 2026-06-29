import os
import json
import uuid
from pymongo import MongoClient
from dotenv import load_dotenv

# Locate and load the root .env file
app_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) # BackEnd
root_dir = os.path.dirname(app_dir) # CREDEX.io
env_path = os.path.join(root_dir, ".env")

if os.path.exists(env_path):
    load_dotenv(env_path)
else:
    load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("MONGO_DB_NAME", "credex_db")

_client = None

def get_mongo_client():
    global _client
    if _client is None:
        try:
            import certifi
            _client = MongoClient(MONGO_URI, tlsCAFile=certifi.where(), serverSelectionTimeoutMS=2000)
        except ImportError:
            _client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
    return _client


# --- LOCAL JSON DB FALLBACK MECHANISM ---
LOCAL_DB_PATH = os.path.join(app_dir, "local_db.json")

class LocalJSONCollection:
    def __init__(self, collection_name):
        self.collection_name = collection_name

    def _read_db(self):
        if not os.path.exists(LOCAL_DB_PATH):
            return {}
        try:
            with open(LOCAL_DB_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}

    def _write_db(self, data):
        try:
            with open(LOCAL_DB_PATH, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"[FALLBACK] Error writing to local DB: {e}")

    def find_one(self, filter, *args, **kwargs):
        db_data = self._read_db()
        coll_data = db_data.get(self.collection_name, {})
        
        # Handle matching by _id
        if "_id" in filter:
            doc = coll_data.get(str(filter["_id"]))
            return doc.copy() if doc else None
        
        # Handle matching by other keys
        for doc in coll_data.values():
            match = True
            for k, v in filter.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                return doc.copy()
        return None

    def insert_one(self, document, *args, **kwargs):
        db_data = self._read_db()
        if self.collection_name not in db_data:
            db_data[self.collection_name] = {}
        
        doc = document.copy()
        if "_id" not in doc:
            doc["_id"] = str(uuid.uuid4())
            
        doc_id = str(doc["_id"])
        db_data[self.collection_name][doc_id] = doc
        self._write_db(db_data)
        
        class InsertOneResult:
            def __init__(self, inserted_id):
                self.inserted_id = inserted_id
        return InsertOneResult(doc["_id"])

    def update_one(self, filter, update, *args, **kwargs):
        db_data = self._read_db()
        coll_data = db_data.get(self.collection_name, {})
        upsert = kwargs.get("upsert", False)
        
        # Find matching document
        target_id = None
        if "_id" in filter:
            if str(filter["_id"]) in coll_data:
                target_id = str(filter["_id"])
        else:
            for doc_id, doc in coll_data.items():
                match = True
                for k, v in filter.items():
                    if doc.get(k) != v:
                        match = False
                        break
                if match:
                    target_id = doc_id
                    break
        
        class UpdateResult:
            def __init__(self, matched_count, modified_count):
                self.matched_count = matched_count
                self.modified_count = modified_count
        
        if target_id is None:
            if upsert:
                new_doc = {}
                if "_id" in filter:
                    new_doc["_id"] = filter["_id"]
                else:
                    new_doc["_id"] = str(uuid.uuid4())
                
                if "$set" in update:
                    new_doc.update(update["$set"])
                
                if self.collection_name not in db_data:
                    db_data[self.collection_name] = {}
                db_data[self.collection_name][str(new_doc["_id"])] = new_doc
                self._write_db(db_data)
                return UpdateResult(1, 1)
            return UpdateResult(0, 0)
            
        doc = coll_data[target_id]
        modified = False
        
        if "$set" in update:
            for k, v in update["$set"].items():
                if doc.get(k) != v:
                    doc[k] = v
                    modified = True
                    
        if "$unset" in update:
            for k in update["$unset"]:
                if k in doc:
                    del doc[k]
                    modified = True
                    
        if modified:
            db_data[self.collection_name][target_id] = doc
            self._write_db(db_data)
            return UpdateResult(1, 1)
        return UpdateResult(1, 0)


class CollectionProxy:
    def __init__(self, db_proxy, collection_name):
        self.db_proxy = db_proxy
        self.collection_name = collection_name

    def _get_collection(self):
        if self.db_proxy._fallback_mode:
            return LocalJSONCollection(self.collection_name)
        try:
            real_db = self.db_proxy.client[self.db_proxy.db_name]
            return real_db[self.collection_name]
        except Exception:
            print(f"[FALLBACK] MongoDB connection failed. Switching to local JSON database.")
            self.db_proxy._fallback_mode = True
            return LocalJSONCollection(self.collection_name)

    def find_one(self, filter, *args, **kwargs):
        if not self.db_proxy._fallback_mode:
            try:
                col = self._get_collection()
                if not isinstance(col, LocalJSONCollection):
                    return col.find_one(filter, *args, **kwargs)
            except Exception as e:
                print(f"[FALLBACK] MongoDB find_one failed ({e}). Switching to local JSON database.")
                self.db_proxy._fallback_mode = True
        
        return LocalJSONCollection(self.collection_name).find_one(filter, *args, **kwargs)

    def insert_one(self, document, *args, **kwargs):
        if not self.db_proxy._fallback_mode:
            try:
                col = self._get_collection()
                if not isinstance(col, LocalJSONCollection):
                    return col.insert_one(document, *args, **kwargs)
            except Exception as e:
                print(f"[FALLBACK] MongoDB insert_one failed ({e}). Switching to local JSON database.")
                self.db_proxy._fallback_mode = True
        
        return LocalJSONCollection(self.collection_name).insert_one(document, *args, **kwargs)

    def update_one(self, filter, update, *args, **kwargs):
        if not self.db_proxy._fallback_mode:
            try:
                col = self._get_collection()
                if not isinstance(col, LocalJSONCollection):
                    return col.update_one(filter, update, *args, **kwargs)
            except Exception as e:
                print(f"[FALLBACK] MongoDB update_one failed ({e}). Switching to local JSON database.")
                self.db_proxy._fallback_mode = True
        
        return LocalJSONCollection(self.collection_name).update_one(filter, update, *args, **kwargs)


class DatabaseProxy:
    def __init__(self, client, db_name):
        self.client = client
        self.db_name = db_name
        self._fallback_mode = False

    def __getattr__(self, name):
        return CollectionProxy(self, name)

    def __getitem__(self, name):
        return CollectionProxy(self, name)


def get_mongo_db():
    client = get_mongo_client()
    return DatabaseProxy(client, DB_NAME)
