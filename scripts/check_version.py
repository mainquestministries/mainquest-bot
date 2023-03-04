import json, re

with open("package.json") as raw_data:
    data = json.load(raw_data)

version = data["version"]

prerelease = any(c.isalpha() for c in version)

print(f"is_prerelease={prerelease}")
