#!/bin/bash
REPOS=(
  "app-shell"
  "app-home"
  "app-movies"
  "app-series"
  "app-anime"
  "app-turkish"
  "app-live-tv"
  "app-sports"
  "app-details"
  "app-player"
  "app-search"
  "app-library"
  "app-settings"
  "app-vault"
  "app-provider-registry"
  "app-health-diagnostics"
  "app-subtitles-engine"
  "app-mapping-cache"
  "app-epg-guide"
  "app-assets"
  "app-docs-runbook"
)

OWNER="MA-tv"

for repo in "${REPOS[@]}"; do
  echo "Enabling GitHub Pages on $OWNER/$repo..."
  gh api \
    --method POST \
    -H "Accept: application/vnd.github+json" \
    /repos/$OWNER/$repo/pages \
    -f source='{"branch":"main","path":"/"}' 2>/dev/null || \
  gh api \
    --method PUT \
    -H "Accept: application/vnd.github+json" \
    /repos/$OWNER/$repo/pages \
    -f source='{"branch":"main","path":"/"}'
done

echo "GitHub Pages enablement completed for all 21 repos."
