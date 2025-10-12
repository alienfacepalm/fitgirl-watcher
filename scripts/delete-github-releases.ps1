# Delete all GitHub releases and tags manually
# Run this script in PowerShell

Write-Host "FitGirl Watchlist - Delete GitHub Releases" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$repo = "alienfacepalm/fitgirl-watcher"

Write-Host "Deleting all releases from: $repo" -ForegroundColor Yellow
Write-Host ""
Write-Host "Opening GitHub releases page in browser..." -ForegroundColor Green
Start-Process "https://github.com/$repo/releases"

Write-Host ""
Write-Host "Manual steps:" -ForegroundColor Yellow
Write-Host "1. For each release on the page:"
Write-Host "   - Click on the release"
Write-Host "   - Scroll to the bottom"
Write-Host "   - Click 'Delete' button"
Write-Host "   - Confirm deletion"
Write-Host ""

Write-Host "After deleting all releases from GitHub, delete local tags:" -ForegroundColor Yellow
Write-Host ""

# Delete local tags
Write-Host "Deleting local Git tags..." -ForegroundColor Cyan
$tags = git tag
if ($tags) {
    foreach ($tag in $tags) {
        Write-Host "  Deleting tag: $tag"
        git tag -d $tag
        git push origin ":refs/tags/$tag" 2>$null
    }
    Write-Host "Git tags deleted" -ForegroundColor Green
} else {
    Write-Host "No local tags found" -ForegroundColor Green
}

Write-Host ""
Write-Host "Once GitHub releases are deleted manually, run:" -ForegroundColor Green
Write-Host "   pnpm run release:1.0.0" -ForegroundColor Cyan
Write-Host ""
