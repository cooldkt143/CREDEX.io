#!/usr/bin/env python
import os
import sys

# Set the working directory to the BackEnd folder
backend_path = r"e:\Projects\Git\CREDEX.io\BackEnd"
os.chdir(backend_path)
sys.path.insert(0, backend_path)

# Now import and run uvicorn
import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=False
    )