$content = Get-Content index.html -Raw
$oldLink = '<link rel="stylesheet" href="./style.css">'
$newLinks = @"
<link rel="stylesheet" href="./style.css">
  <link rel="stylesheet" href="./src/interactions/cursorStyles.css">
"@
$content = $content.Replace($oldLink, $newLinks)
Set-Content index.html $content
Write-Host "CSS link added successfully!"