import os
import json
import re
import requests
from dotenv import load_dotenv
from .resume_text_cleaner import clean_text

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = "openai/gpt-4o-mini"


def parse_resume_text(text: str) -> dict:
    text = clean_text(text)

    # 1. Fallback / default template structure
    email = extract_email(text)
    phone = extract_phone(text)
    fallback_data = {
        "header": {
            "firstName": "",
            "lastName": "",
            "city": "",
            "country": "",
            "pincode": "",
            "role": ""
        },
        "contacts": {
            "email": email,
            "phone": phone,
            "links": []
        },
        "summary": "",
        "education": [],
        "skills": {
            "skills": extract_skills(text),
            "languages": []
        },
        "experience": [],
        "projects": [],
        "achievements": []
    }

    if not OPENROUTER_API_KEY:
        print("Warning: OPENROUTER_API_KEY is missing. Using regex fallback parsing.")
        return fallback_data

    # 2. OpenRouter Prompt
    prompt = f"""
You are an expert resume parsing assistant. Your task is to extract structured information from the following resume text and format it into a strictly valid JSON object matching the provided schema.

Resume Text:
{text}

Expected JSON Schema:
{{
  "header": {{
    "firstName": "string",
    "lastName": "string",
    "city": "string",
    "country": "string",
    "pincode": "string",
    "role": "string (e.g. Software Engineer, Product Manager, etc.)"
  }},
  "contacts": {{
    "email": "string",
    "phone": "string",
    "links": [
      {{
        "url": "string"
      }}
    ]
  }},
  "summary": "string (professional summary or profile)",
  "education": [
    {{
      "degree": "string (e.g. B.S. in Computer Science)",
      "startYear": "string",
      "endYear": "string",
      "institute": "string",
      "address": "string"
    }}
  ],
  "skills": {{
    "skills": ["string"],
    "languages": ["string"]
  }},
  "experience": [
    {{
      "jobTitle": "string",
      "employer": "string",
      "city": "string",
      "country": "string",
      "start": "string (e.g. Month Year, or Year)",
      "end": "string (e.g. Month Year, or Present)"
    }}
  ],
  "projects": [
    {{
      "title": "string",
      "description": "string"
    }}
  ],
  "achievements": ["string"]
}}

Instructions:
1. If a field is not found in the resume, leave it as an empty string, empty list, or empty object as shown in the schema.
2. Do not invent details.
3. Ensure the JSON returned is valid, clean, and has no additional explanation.
"""

    for attempt in range(2):
        try:
            response = requests.post(
                OPENROUTER_URL,
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": MODEL,
                    "messages": [
                        {
                            "role": "system",
                            "content": "You must return strictly valid JSON matching the requested schema. No explanations, no markdown fences, just pure JSON.",
                        },
                        {"role": "user", "content": prompt},
                    ],
                    "temperature": 0.1,
                    "max_tokens": 2000,
                },
                timeout=40,
            )

            if response.status_code != 200:
                raise Exception(response.text)

            result = response.json()
            raw_content = result["choices"][0]["message"]["content"]

            # Clean markdown fences if any
            cleaned = raw_content.replace("```json", "").replace("```", "").strip()

            match = re.search(r"\{.*\}", cleaned, re.DOTALL)
            if not match:
                raise Exception("No valid JSON found in LLM response.")

            parsed_data = json.loads(match.group(0))

            # Validate basic structure and merge with fallback/default to ensure no missing keys
            validated_data = {}
            for key in fallback_data:
                if key in parsed_data:
                    validated_data[key] = parsed_data[key]
                else:
                    validated_data[key] = fallback_data[key]

            # Special merge checks for nested dicts
            for sub_key in ["header", "contacts", "skills"]:
                if isinstance(validated_data[sub_key], dict):
                    # Ensure all sub-keys exist
                    for nested_key in fallback_data[sub_key]:
                        if nested_key not in validated_data[sub_key]:
                            validated_data[sub_key][nested_key] = fallback_data[sub_key][nested_key]

            # If LLM failed to extract email or phone, merge them from regex
            if not validated_data["contacts"].get("email") and email:
                validated_data["contacts"]["email"] = email
            if not validated_data["contacts"].get("phone") and phone:
                validated_data["contacts"]["phone"] = phone

            return validated_data

        except Exception as e:
            print(f"LLM parser attempt {attempt + 1} failed: {e}")

    # Fallback if both attempts failed
    return fallback_data


def extract_email(text):
    match = re.search(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", text)
    return match.group(0) if match else ""


def extract_phone(text):
    match = re.search(r"\b\d{10}\b", text)
    return match.group(0) if match else ""


def extract_skills(text):
    common_skills = [
        "react", "javascript", "python", "node", "mongodb",
        "html", "css", "fastapi"
    ]
    found = []
    lower = text.lower()
    for skill in common_skills:
        if skill in lower:
            found.append(skill.capitalize())
    return found
