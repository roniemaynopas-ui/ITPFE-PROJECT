$ErrorActionPreference = "Stop"
$root = (Resolve-Path $PSScriptRoot).Path
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://127.0.0.1:8000/")
$listener.Start()

$contentTypes = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "text/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".webp" = "image/webp"
}

Write-Host "LodgeFinder is running at http://127.0.0.1:8000/"
Write-Host "Press Ctrl+C to stop the server."

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    try {
      $relativePath = [Uri]::UnescapeDataString($context.Request.Url.AbsolutePath.TrimStart("/"))
      if ([string]::IsNullOrWhiteSpace($relativePath)) {
        $relativePath = "index.html"
      }

      $filePath = [IO.Path]::GetFullPath((Join-Path $root $relativePath))
      $rootPrefix = $root.TrimEnd([IO.Path]::DirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
      if (-not $filePath.StartsWith($rootPrefix, [StringComparison]::OrdinalIgnoreCase)) {
        $context.Response.StatusCode = 404
      }
      elseif (Test-Path -LiteralPath $filePath -PathType Leaf) {
        $extension = [IO.Path]::GetExtension($filePath).ToLowerInvariant()
        if ($contentTypes.ContainsKey($extension)) {
          $context.Response.ContentType = $contentTypes[$extension]
        }
        else {
          $context.Response.ContentType = "application/octet-stream"
        }
        $bytes = [IO.File]::ReadAllBytes($filePath)
        $context.Response.ContentLength64 = $bytes.Length
        $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
      }
      else {
        $context.Response.StatusCode = 404
      }
    }
    catch {
      Write-Warning "Request failed: $_"
      $context.Response.StatusCode = 500
    }
    finally {
      $context.Response.Close()
    }
  }
}
finally {
  $listener.Stop()
  $listener.Close()
}
