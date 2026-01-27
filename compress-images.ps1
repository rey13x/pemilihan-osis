Add-Type -AssemblyName System.Drawing

function Resize-Image {
    param(
        [string]$ImagePath,
        [int]$MaxWidth = 1200,
        [int]$MaxHeight = 1200,
        [int]$Quality = 85
    )
    
    try {
        $image = [System.Drawing.Image]::FromFile($ImagePath)
        $origWidth = $image.Width
        $origHeight = $image.Height
        
        # Calculate new dimensions
        $ratio = [Math]::Min([double]$MaxWidth / $origWidth, [double]$MaxHeight / $origHeight)
        $newWidth = [int]($origWidth * $ratio)
        $newHeight = [int]($origHeight * $ratio)
        
        # If no resize needed
        if ($ratio -ge 1) {
            $image.Dispose()
            return $false
        }
        
        # Create resized bitmap
        $resized = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
        $graphics = [System.Drawing.Graphics]::FromImage($resized)
        $graphics.DrawImage($image, 0, 0, $newWidth, $newHeight)
        $graphics.Dispose()
        
        # Save with compression
        $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' -or $_.MimeType -eq 'image/png' }
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $Quality)
        
        # For PNG, use lossless
        if ($ImagePath -like '*.png') {
            $resized.Save($ImagePath, [System.Drawing.Imaging.ImageFormat]::Png)
        } else {
            $resized.Save($ImagePath, $encoder[1], $encoderParams)
        }
        
        $resized.Dispose()
        $image.Dispose()
        return $true
    }
    catch {
        Write-Host "Error processing $ImagePath : $_"
        return $false
    }
}

# Get all image files
$images = Get-ChildItem -Path "c:\Users\bagas\Desktop\osis2026\public", "c:\Users\bagas\Desktop\osis2026\src\assets" -Include "*.jpg", "*.jpeg", "*.png" -Recurse

$totalBefore = 0
$totalAfter = 0
$count = 0

foreach ($image in $images) {
    $before = $image.Length
    $totalBefore += $before
    
    Write-Host "Processing: $($image.Name)" -ForegroundColor Cyan
    
    if (Resize-Image -ImagePath $image.FullName -MaxWidth 1200 -MaxHeight 1200 -Quality 85) {
        $after = (Get-Item $image.FullName).Length
        $totalAfter += $after
        $reduction = [Math]::Round(($before - $after) / $before * 100, 1)
        Write-Host "  $([Math]::Round($before/1024, 2)) KB → $([Math]::Round($after/1024, 2)) KB (${reduction}% reduction)" -ForegroundColor Green
        $count++
    } else {
        $totalAfter += $before
        Write-Host "  No resize needed" -ForegroundColor Yellow
    }
}

Write-Host "`n📊 Summary:" -ForegroundColor Cyan
Write-Host "  Total processed: $count images" -ForegroundColor Green
Write-Host "  Before: $([Math]::Round($totalBefore/1024/1024, 2)) MB"
Write-Host "  After: $([Math]::Round($totalAfter/1024/1024, 2)) MB"
Write-Host "  Saved: $([Math]::Round(($totalBefore-$totalAfter)/1024/1024, 2)) MB" -ForegroundColor Green
