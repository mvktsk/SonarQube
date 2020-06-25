param 
(
    [string]$AuthToken = ""
)

$SettingsJson = Get-Content '.\exclusions.json' | Out-String | ConvertFrom-Json

$base64AuthInfo = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(("{0}:" -f $AuthToken)))

$Uri = "https://sonarcloud.io/api/projects/search?organization=virto-commerce"

$Result = Invoke-RestMethod -Headers @{Authorization=("Basic {0}" -f $base64AuthInfo)} -Uri $Uri -Method Get

foreach($Setting in $SettingsJson)
{
    $Values = ""
    foreach($Value in $Setting.values)
    {
        $Values += "&values=$($Value)"
    }

    foreach($Component in $Result.components)
    {
        $SettingsUri = "https://sonarcloud.io/api/settings/set?component=$($Component.key)&key=$($Setting.key)$($Values)"
        Invoke-RestMethod -Headers @{Authorization=("Basic {0}" -f $base64AuthInfo)} -Uri $SettingsUri -Method Post
    }
}


