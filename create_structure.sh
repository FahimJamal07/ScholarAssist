#!/bin/bash
# ScholarAssist Directory Generation Script (Bash)
# Run this script to recreate the production-grade folder layout and base files.

echo "Creating ScholarAssist folder structure..."

# Define directories
dirs=(
    "frontend"
    "frontend/public"
    "frontend/src"
    "frontend/src/pages"
    "frontend/src/components"
    "frontend/src/components/layout"
    "frontend/src/components/chat"
    "frontend/src/components/upload"
    "frontend/src/components/analytics"
    "frontend/src/components/cards"
    "frontend/src/components/ui"
    "frontend/src/services"
    "frontend/src/hooks"
    "frontend/src/context"
    "frontend/src/routes"
    "frontend/src/utils"
    "frontend/src/styles"
    "backend"
    "backend/config"
    "backend/api"
    "backend/api/routes"
    "backend/api/middleware"
    "backend/services"
    "backend/orchestrator"
    "backend/adapters"
    "backend/models"
    "backend/utils"
    "vector_store"
    "database"
    "database/migrations"
    "ai_services"
    "ai_services/prompts"
    "ai_services/eval"
    "ai_services/config"
    "ai_services/utils"
    "tests"
    "tests/backend"
    "tests/frontend"
    "docs"
)

# Create folders
for dir in "${dirs[@]}"; do
    if [ ! -d "$dir" ]; then
        mkdir -p "$dir"
        echo "Created folder: $dir"
    fi
done

echo ""
echo "ScholarAssist folders generated successfully!"
