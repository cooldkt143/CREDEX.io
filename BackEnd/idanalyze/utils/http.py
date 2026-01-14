import requests
from idanalyze.utils.constants import COMMON_HEADERS, DEFAULT_TIMEOUT

class HTTPClient:
    def __init__(self, headers=None, timeout=None):
        self.headers = headers or COMMON_HEADERS
        self.timeout = timeout or DEFAULT_TIMEOUT

    def get(self, url: str):
        try:
            response = requests.get(
                url,
                headers=self.headers,
                timeout=self.timeout,
            )
            response.raise_for_status()
            return response
        except requests.exceptions.RequestException as e:
            raise RuntimeError(f"HTTP GET failed for {url}: {e}")

    def get_json(self, url: str) -> dict:
        response = self.get(url)
        return response.json()

    def get_text(self, url: str) -> str:
        response = self.get(url)
        return response.text