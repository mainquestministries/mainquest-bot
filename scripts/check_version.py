import sys, re


version = sys.argv[1][1:]

prerelease = any(c.isalpha() for c in version)

print(f"is_prerelease={prerelease}")
