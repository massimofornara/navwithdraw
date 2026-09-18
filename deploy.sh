#!/bin/bash

echo "🚀 Deploy Globale - Universal Reconciliation System"
echo "=================================================="
echo ""

# Check if build exists
if [ ! -d "dist" ]; then
    echo "📦 Building project..."
    npm run build
fi

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Vercel
echo -e "${BLUE}🔺 Deploying to Vercel...${NC}"
if command -v vercel &> /dev/null; then
    vercel --prod --yes
    echo -e "${GREEN}✅ Vercel deploy completato${NC}"
else
    echo "⚠️  Vercel CLI non installato. Installa con: npm install -g vercel"
fi
echo ""

# Netlify
echo -e "${BLUE}🔵 Deploying to Netlify...${NC}"
if command -v netlify &> /dev/null; then
    netlify deploy --prod --dir=dist
    echo -e "${GREEN}✅ Netlify deploy completato${NC}"
else
    echo "⚠️  Netlify CLI non installato. Installa con: npm install -g netlify-cli"
fi
echo ""

# GitHub Pages
echo -e "${BLUE}🐙 Deploying to GitHub Pages...${NC}"
if command -v gh-pages &> /dev/null; then
    npm run deploy:github
    echo -e "${GREEN}✅ GitHub Pages deploy completato${NC}"
else
    echo "⚠️  gh-pages non installato. Installa con: npm install -g gh-pages"
fi
echo ""

# Cloudflare
echo -e "${BLUE}☁️  Deploying to Cloudflare Pages...${NC}"
if command -v wrangler &> /dev/null; then
    wrangler pages deploy dist
    echo -e "${GREEN}✅ Cloudflare deploy completato${NC}"
else
    echo "⚠️  Wrangler CLI non installato. Installa con: npm install -g wrangler"
fi
echo ""

# Surge
echo -e "${BLUE}⚡ Deploying to Surge...${NC}"
if command -v surge &> /dev/null; then
    surge dist
    echo -e "${GREEN}✅ Surge deploy completato${NC}"
else
    echo "⚠️  Surge non installato. Installa con: npm install -g surge"
fi
echo ""

echo "=================================================="
echo -e "${GREEN}✅ Deploy completato su tutte le piattaforme disponibili!${NC}"
echo ""
echo "🌍 Ricorda di configurare i domini personalizzati su ogni piattaforma."
echo "📖 Leggi DEPLOY_GLOBALE.md per istruzioni dettagliate."
