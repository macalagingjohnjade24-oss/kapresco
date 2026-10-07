<#
  Re-encodes the Figma photo exports from PNG to JPEG.

  These are photographic assets shipped as PNG, which is why assets/figma weighs
  20.5 MB. Dimensions are left untouched (they are already correct 3x exports);
  only the container changes, so nothing about the layout shifts. Expect roughly
  a 90% reduction in bundle size, which is what makes the photos reliable to load
  from a device.

  Run: powershell -ExecutionPolicy Bypass -File optimize-images.ps1
#>

Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = 'Stop'
$dir = Join-Path $PSScriptRoot 'assets\figma'
$quality = 82

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object { $_.MimeType -eq 'image/jpeg' }

$params = New-Object System.Drawing.Imaging.EncoderParameters(1)
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
    [System.Drawing.Imaging.Encoder]::Quality, [long]$quality
)

$before = 0
$after = 0
$converted = 0
$skipped = 0

Get-ChildItem -Path $dir -Filter '*.png' | ForEach-Object {
    $src = $_.FullName
    $dst = [System.IO.Path]::ChangeExtension($src, '.jpg')

    $before += $_.Length

    $img = $null
    $bmp = $null
    try {
        $img = [System.Drawing.Image]::FromFile($src)
        $bmp = New-Object System.Drawing.Bitmap($img.Width, $img.Height)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        try {
            $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
            $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
            $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
            $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            # JPEG has no alpha; flatten onto white so transparent PNG areas are not black.
            $g.Clear([System.Drawing.Color]::White)
            $g.DrawImage($img, 0, 0, $img.Width, $img.Height)
        } finally {
            $g.Dispose()
        }
        $bmp.Save($dst, $codec, $params)
        $after += (Get-Item $dst).Length
        $converted++
    } catch {
        Write-Warning "skipped $($_.Name): $($_.Exception.Message)"
        $after += $_.Length
        $skipped++
    } finally {
        if ($bmp) { $bmp.Dispose() }
        if ($img) { $img.Dispose() }
    }
}

$mb = { param($n) [math]::Round($n / 1MB, 2) }
Write-Host ""
Write-Host "converted : $converted png -> jpg" -ForegroundColor Green
if ($skipped -gt 0) { Write-Host "skipped   : $skipped" -ForegroundColor Yellow }
Write-Host "before    : $(& $mb $before) MB"
Write-Host "after     : $(& $mb $after) MB"
Write-Host "saved     : $(& $mb ($before - $after)) MB" -ForegroundColor Green
