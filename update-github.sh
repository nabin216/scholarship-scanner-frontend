#!/bin/bash

# GitHub Repository Update Script
# Updates the scholarship-scanner-frontend repository with latest changes

echo "🔄 Updating GitHub Repository..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Repository configuration
REPO_URL="https://github.com/nabin216/scholarship-scanner-frontend.git"
BRANCH="main" # or "master" depending on your default branch

echo -e "${BLUE}📋 Repository: ${REPO_URL}${NC}"
echo -e "${BLUE}🌿 Branch: ${BRANCH}${NC}"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}📁 Initializing Git repository...${NC}"
    git init
    git remote add origin $REPO_URL
fi

# Check current status
echo -e "${YELLOW}📊 Current Git Status:${NC}"
git status

# Stage all changes
echo -e "${YELLOW}📦 Staging changes...${NC}"
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo -e "${GREEN}✅ No changes to commit${NC}"
else
    # Create commit message with timestamp
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    COMMIT_MSG="🚀 Production deployment update - $TIMESTAMP

Features updated:
- ✅ Fixed TypeScript compilation errors
- ✅ Added Suspense boundaries for useSearchParams()
- ✅ Configured Next.js for EC2 deployment
- ✅ Added production environment variables
- ✅ Updated API integration for EC2 backend
- 🔧 Added deployment scripts and documentation

Ready for production deployment to EC2: http://13.61.181.192"

    echo -e "${YELLOW}💬 Committing changes...${NC}"
    git commit -m "$COMMIT_MSG"
    
    # Push to repository
    echo -e "${YELLOW}🚀 Pushing to GitHub...${NC}"
    git push -u origin $BRANCH
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}🎉 Successfully updated GitHub repository!${NC}"
        echo -e "${GREEN}🔗 Repository: https://github.com/nabin216/scholarship-scanner-frontend${NC}"
    else
        echo -e "${RED}❌ Failed to push to GitHub. Please check your credentials and try again.${NC}"
        echo -e "${YELLOW}💡 You may need to:${NC}"
        echo -e "   1. Set up your GitHub credentials: git config --global user.name 'Your Name'"
        echo -e "   2. Set up your email: git config --global user.email 'your.email@example.com'"
        echo -e "   3. Authenticate with GitHub (use personal access token)"
    fi
fi

echo -e "${BLUE}📋 Summary of Changes:${NC}"
echo -e "   ✅ TypeScript errors fixed"
echo -e "   ✅ Next.js build optimized"
echo -e "   ✅ EC2 deployment configuration added"
echo -e "   ✅ Production environment variables set"
echo -e "   📁 Deployment scripts created"
echo -e "   📖 Documentation updated"
