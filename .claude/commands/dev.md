
---
description: "Work on a issue from github"
allowed-tools: "Bash(npm run test:*), Read(tests/**), Read(src/**)"
---

### 1. 📋 Read GitHub Issue
- Fetches issue details using GitHub CLI with #$ARGUMENTS
- Extracts title, body, labels, and tasks
- Validates issue exists and is accessible

### 2. 📊 Analyze Commit History
- Reviews recent commit messages
- Identifies project patterns and conventions
- Helps maintain consistency

### 3. 🎯 Plan Implementation
- Extracts tasks from issue checklist
- Determines affected files/directories
- Plans testing strategy based on issue content

### 4. 🌿 Create Feature Branch
- Switches to main/master branch
- Pulls latest changes
- Creates descriptive feature branch: `feature/issue-<number>-<title>`

### 5. 🚀 Implement Feature
- Creates project structure if needed
- Generates implementation files based 

### 6. 🧪 Add Automatic Tests
- Creates test files with basic test structure
- Sets up testing configuration
- Follows project testing conventions

### 7. 💾 Commit Changes
- Stages all changes
- Creates conventional commit message
- Includes issue reference and closes statement

### 8. 🔄 Create Pull Request
- Pushes feature branch to remote
- Creates PR with detailed description
- Links to original issue
- Includes task checklist for review

## Prerequisites
- GitHub CLI (`gh`) installed and authenticated
- Git repository with remote origin
- Write access to the repository


## Commit Message Format
```
feat: implement issue #<number>

<issue title>

- Added basic implementation structure
- Created automatic tests
- Updated project configuration

Closes #<number>

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

## Pull Request Template
- Summary of changes
- Task completion checklist
- Testing information
- Review checklist
- Links to original issue

## Error Handling
- Validates issue number format
- Checks GitHub CLI authentication
- Handles git command failures
- Provides clear error messages

## Customization
The command can be customized by modifying:
- Project structure templates
- Package.json dependencies
- Commit message format
- PR template
- Testing framework setup

## Integration with Claude Code
This command is designed to work seamlessly with Claude Code's development workflow, providing automated implementation that follows project conventions and best practices.