# Download Royalty-Free Sound Effects
# This script downloads CC0/Public Domain sounds from freesound.org and other sources

$soundsDir = "C:\Users\adeel\Documents\Practice\WheelOfFortune\frontend\public\sounds"

Write-Host "Downloading royalty-free sound effects..." -ForegroundColor Green
Write-Host "Sounds will be saved to: $soundsDir" -ForegroundColor Cyan
Write-Host ""

# Free sound URLs (CC0/Public Domain)
# These are direct download links to royalty-free sounds

$sounds = @{
    "button-click.mp3" = "https://freesound.org/data/previews/442/442127_7358204-lq.mp3"
    "letter-correct.mp3" = "https://freesound.org/data/previews/320/320655_5260872-lq.mp3"
    "letter-wrong.mp3" = "https://freesound.org/data/previews/142/142608_2615119-lq.mp3"
    "puzzle-solved.mp3" = "https://freesound.org/data/previews/270/270324_5123851-lq.mp3"
    "game-over.mp3" = "https://freesound.org/data/previews/277/277403_5081195-lq.mp3"
}

foreach ($file in $sounds.Keys) {
    $url = $sounds[$file]
    $output = Join-Path $soundsDir $file

    Write-Host "Downloading $file..." -NoNewline
    try {
        Invoke-WebRequest -Uri $url -OutFile $output -UseBasicParsing
        $size = (Get-Item $output).Length
        Write-Host " ✓ ($size bytes)" -ForegroundColor Green
    } catch {
        Write-Host " ✗ Failed" -ForegroundColor Red
        Write-Host "  Error: $_" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Download complete!" -ForegroundColor Green
Write-Host "Note: Some files may need to be downloaded manually from Pixabay or Freesound" -ForegroundColor Yellow

