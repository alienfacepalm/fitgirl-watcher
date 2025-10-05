#!/usr/bin/env bash
set -euo pipefail

# Manual release flow with semver bump
# Usage: scripts/release.sh [major|minor|patch|prerelease]

cd "$(dirname "$0")/.."

type zip >/dev/null 2>&1 || {
  echo "zip is required. Install with: sudo apt update && sudo apt install -y zip" >&2
  exit 1
}

BUMP_TYPE="${1:-patch}"
if [[ ! "$BUMP_TYPE" =~ ^(major|minor|patch|prerelease)$ ]]; then
  echo "Invalid bump type: $BUMP_TYPE" >&2
  echo "Valid: major|minor|patch|prerelease" >&2
  exit 1
fi

echo "==> Running release: $BUMP_TYPE"

# Ensure clean working tree
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Working tree is dirty. Commit or stash changes first." >&2
  exit 1
fi

pnpm install --frozen-lockfile

node scripts/create-release.js "$BUMP_TYPE"

VERSION=$(node -p "require('./package.json').version")
TAG="v$VERSION"

git add package.json releases/
git commit -m "chore(release): $VERSION"
git tag -a "$TAG" -m "Release $VERSION"

echo "==> Release created: $TAG"
echo "Push with: git push && git push origin $TAG"

