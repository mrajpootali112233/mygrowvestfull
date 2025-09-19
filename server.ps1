# Simple HTTP Server using PowerShell
$port = 8080
$path = "c:\Users\Links\Desktop\next project"

# Create HTTP listener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "Server started on http://localhost:$port"
Write-Host "Serving files from: $path"
Write-Host "Press Ctrl+C to stop"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $localPath = $request.Url.LocalPath
        if ($localPath -eq "/") {
            $localPath = "/demo.html"
        }
        
        $filePath = Join-Path $path $localPath.TrimStart('/')
        
        if (Test-Path $filePath) {
            $content = Get-Content $filePath -Raw -Encoding UTF8
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($content)
            
            # Set content type
            if ($filePath.EndsWith(".html")) {
                $response.ContentType = "text/html; charset=utf-8"
            } elseif ($filePath.EndsWith(".css")) {
                $response.ContentType = "text/css"
            } elseif ($filePath.EndsWith(".js")) {
                $response.ContentType = "application/javascript"
            }
            
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        } else {
            $response.StatusCode = 404
            $notFound = "File not found: $localPath"
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($notFound)
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }
        
        $response.OutputStream.Close()
    }
} finally {
    $listener.Stop()
}