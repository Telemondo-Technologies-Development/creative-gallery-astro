# Git Workflow Helper Script for PowerShell

param(
    [Parameter(Mandatory=$false)]
    [string]$Action
)

function Show-Menu {
    Write-Host "`n=== Git Workflow Helper ===" -ForegroundColor Cyan
    Write-Host "1. Create new weekly branch"
    Write-Host "2. Commit with conventional format"
    Write-Host "3. Push and prepare for PR"
    Write-Host "4. Update changelog"
    Write-Host "5. Show branch status"
    Write-Host "6. Merge dev branch to main"
    Write-Host "0. Exit"
    Write-Host "========================`n" -ForegroundColor Cyan
}

function New-WeeklyBranch {
    Write-Host "`nCreating new weekly branch..." -ForegroundColor Green
    
    # Get current date
    $year = Get-Date -Format "yyyy"
    $month = Get-Date -Format "MM"
    
    # Ask for version number
    $version = Read-Host "Enter version number for this month (e.g., v1, v2, v3)"
    
    $branchName = "dev/$year-$month-$version"
    
    Write-Host "Creating branch: $branchName" -ForegroundColor Yellow
    
    git checkout dev
    git pull origin dev
    git checkout -b $branchName
    
    Write-Host "`nBranch created successfully!" -ForegroundColor Green
    Write-Host "Current branch: $branchName" -ForegroundColor Cyan
}

function New-ConventionalCommit {
    Write-Host "`n=== Conventional Commit ===" -ForegroundColor Cyan
    Write-Host "Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert`n"
    
    $type = Read-Host "Enter commit type"
    $scope = Read-Host "Enter scope (optional, press Enter to skip)"
    $subject = Read-Host "Enter commit subject"
    
    $commitMsg = if ($scope) {
        "$type($scope): $subject"
    } else {
        "$type`: $subject"
    }
    
    Write-Host "`nCommit message: $commitMsg" -ForegroundColor Yellow
    $confirm = Read-Host "Proceed with commit? (y/n)"
    
    if ($confirm -eq 'y') {
        git add .
        git commit -m $commitMsg
        Write-Host "`nCommit created successfully!" -ForegroundColor Green
    } else {
        Write-Host "Commit cancelled." -ForegroundColor Red
    }
}

function Push-ForPR {
    Write-Host "`nPreparing for Pull Request..." -ForegroundColor Green
    
    $currentBranch = git rev-parse --abbrev-ref HEAD
    Write-Host "Current branch: $currentBranch" -ForegroundColor Cyan
    
    $confirm = Read-Host "Push to origin/$currentBranch? (y/n)"
    
    if ($confirm -eq 'y') {
        git push origin $currentBranch
        Write-Host "`nPushed successfully!" -ForegroundColor Green
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "1. Go to your repository on GitHub/GitLab"
        Write-Host "2. Create a Pull Request from $currentBranch to dev"
        Write-Host "3. Use the PR template to fill in details"
        Write-Host "4. Ensure CHANGELOG.md is updated"
    } else {
        Write-Host "Push cancelled." -ForegroundColor Red
    }
}

function Update-Changelog {
    Write-Host "`n=== Update Changelog ===" -ForegroundColor Cyan
    Write-Host "Opening CHANGELOG.md for editing...`n"
    
    $changelogPath = "CHANGELOG.md"
    
    if (Test-Path $changelogPath) {
        Write-Host "Current version format: MAJOR.MINOR.PATCH" -ForegroundColor Yellow
        Write-Host "Example: 0.1.0 (initial), 0.2.0 (new features), 1.0.0 (breaking changes)`n"
        
        $version = Read-Host "Enter new version number"
        $date = Get-Date -Format "yyyy-MM-dd"
        
        Write-Host "`nVersion: $version" -ForegroundColor Cyan
        Write-Host "Date: $date" -ForegroundColor Cyan
        Write-Host "`nOpening editor..." -ForegroundColor Green
        
        notepad $changelogPath
    } else {
        Write-Host "CHANGELOG.md not found!" -ForegroundColor Red
    }
}

function Show-Status {
    Write-Host "`n=== Repository Status ===" -ForegroundColor Cyan
    
    $currentBranch = git rev-parse --abbrev-ref HEAD
    Write-Host "`nCurrent branch: $currentBranch" -ForegroundColor Green
    
    Write-Host "`nBranch list:" -ForegroundColor Yellow
    git branch -a
    
    Write-Host "`nGit status:" -ForegroundColor Yellow
    git status
    
    Write-Host "`nRecent commits:" -ForegroundColor Yellow
    git log --oneline -5
}

function Merge-ToMain {
    Write-Host "`n=== Merge dev to main ===" -ForegroundColor Cyan
    Write-Host "WARNING: This will merge dev branch to main!" -ForegroundColor Red
    
    $confirm = Read-Host "Are you sure? (yes/no)"
    
    if ($confirm -eq 'yes') {
        git checkout main
        git pull origin main
        git merge dev
        
        $version = Read-Host "Enter version tag (e.g., v0.2.0)"
        git tag -a $version -m "Release $version"
        
        Write-Host "`nMerged successfully!" -ForegroundColor Green
        Write-Host "Don't forget to push: git push origin main --tags" -ForegroundColor Yellow
    } else {
        Write-Host "Merge cancelled." -ForegroundColor Red
    }
}

# Main script logic
if (-not $Action) {
    do {
        Show-Menu
        $choice = Read-Host "Select an option"
        
        switch ($choice) {
            "1" { New-WeeklyBranch }
            "2" { New-ConventionalCommit }
            "3" { Push-ForPR }
            "4" { Update-Changelog }
            "5" { Show-Status }
            "6" { Merge-ToMain }
            "0" { 
                Write-Host "`nExiting..." -ForegroundColor Cyan
                exit 
            }
            default { Write-Host "Invalid option!" -ForegroundColor Red }
        }
        
        if ($choice -ne "0") {
            Read-Host "`nPress Enter to continue"
        }
    } while ($choice -ne "0")
}

Write-Host "`nDone!" -ForegroundColor Green
