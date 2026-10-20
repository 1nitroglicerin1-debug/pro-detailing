$ErrorActionPreference = 'Continue'
$out = New-Object System.Collections.Generic.List[string]

$out.Add('GH_PATH=' + ((Get-Command gh -ErrorAction SilentlyContinue).Source))
$out.Add('GIT_VER=' + ((git --version 2>&1 | Out-String).Trim()))
$out.Add('AUTH=' + ((gh auth status 2>&1 | Out-String).Trim()))

$dir = $PSScriptRoot
Set-Location -LiteralPath $dir

$create = gh repo create pro-detailing --public --source="$dir" --remote=origin --push 2>&1 | Out-String
$out.Add('CREATE=' + $create.Trim())

$out.Add('REMOTE=' + ((git remote get-url origin 2>&1 | Out-String).Trim()))
$out.Add('BRANCH=' + ((git branch --show-current 2>&1 | Out-String).Trim()))
$out.Add('LOG=' + ((git log --oneline 2>&1 | Out-String).Trim()))

$out -join "`n"
