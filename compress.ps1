Add-Type -AssemblyName System.Drawing

$tempDir = [System.IO.Path]::GetTempPath() + "img_compress"
if (!(Test-Path $tempDir)) { New-Item -ItemType Directory -Path $tempDir > $null }

function Compress-Image {
    param([string]$FilePath)
    
    try {
        $file = Get-Item $FilePath
        $before = $file.Length
        
        # Load image
        $img = [System.Drawing.Image]::FromFile($FilePath)
        
        # Calculate new size
        $maxW = 1200; $maxH = 1200
        $ratio = [Math]::Min([double]$maxW / $img.Width, [double]$maxH / $img.Height)
        
        $newW = [int]($img.Width * $ratio)
        $newH = [int]($img.Height * $ratio)
        
        # Create resized image
        $resized = New-Object System.Drawing.Bitmap($newW, $newH)
        $g = [System.Drawing.Graphics]::FromImage($resized)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.DrawImage($img, 0, 0, $newW, $newH)
        $g.Dispose()
        
        # Save to temp
        $tempFile = "$tempDir\$($file.BaseName)_temp$($file.Extension)"
        if ($file.Extension -eq ".jpg" -or $file.Extension -eq ".jpeg") {
            $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
            $encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
            $encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]85)
            $resized.Save($tempFile, $encoder, $encParams)
        } else {
            $resized.Save($tempFile, [System.Drawing.Imaging.ImageFormat]::Png)
        }
        
        $resized.Dispose()
        $img.Dispose()
        
        # Replace original
        Remove-Item $FilePath -Force
        Move-Item $tempFile $FilePath -Force
        
        $after = (Get-Item $FilePath).Length
        $saved = $before - $after
        $pct = if ($before -gt 0) { [Math]::Round($saved / $before * 100, 1) } else { 0 }
        
        Write-Host "✓ $($file.Name): $('{0:N0}' -f $before) B → $('{0:N0}' -f $after) B (${pct}%)" -ForegroundColor Green
        return $saved
    }
    catch {
        Write-Host "✗ $FilePath : $_" -ForegroundColor Red
        return 0
    }
}

Write-Host "🖼️  Compressing images...`n" -ForegroundColor Cyan
$total = 0
Get-ChildItem -Path "C:\Users\bagas\Desktop\osis2026\public","C:\Users\bagas\Desktop\osis2026\src\assets" -Include "*.jpg","*.jpeg","*.png" -Recurse | ForEach-Object {
    $total += Compress-Image $_.FullName
}

Remove-Item $tempDir -Force -Recurse -ErrorAction SilentlyContinue

Write-Host "`n✅ Done! Total saved: $([Math]::Round($total/1024/1024, 2)) MB" -ForegroundColor Cyan
