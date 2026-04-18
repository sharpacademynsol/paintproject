You are a senior full-stack engineer and frontend architect.

I have a website downloaded using “Save All Resources” which contains many unnecessary files such as duplicate CSS, fonts, third-party CDN assets, SCSS source files, unused JS, and vendor libraries.

Your task is to CLEAN, OPTIMIZE, and RESTRUCTURE this project with the following goals:

# OBJECTIVES
Extract ONLY the essential UI layout and styles required to replicate the design.
Remove all unnecessary, duplicate, or unused files.
Convert the project into a clean, production-ready frontend.
Identify and document the original tech stack used in the project.
Prepare the project to integrate into a modern edge-first architecture.

# CLEANUP INSTRUCTIONS
Perform the following:

## Remove:
node_modules folder completely
All SCSS source files (keep only compiled CSS if used)
Unused CSS classes (tree-shake or minimize)
Duplicate font files and unused font weights
External CDN references (Google Fonts, etc.) → replace with local or optimized loading
Unused JS libraries and plugins
Any analytics, tracking scripts, or ads
## Keep ONLY:
Final HTML structure (cleaned and semantic)
Required CSS (minimized and merged into 1–2 files max)
Required JS (only if necessary for UI behavior)
Essential assets (images, icons)
## Optimize:
Minify CSS and JS
Convert images to optimized formats (WebP if possible)
Remove inline styles and move to CSS
Ensure responsive design is preserved

# UI EXTRACTION
1.  Convert HTML into reusable components:
    -   Header
    -   Footer
    -   Hero section
    -   Product cards
    -   Navigation
    -   Forms
2.  Ensure:
    -   Clean class naming (BEM or utility-based)
    -   No dependency on Bootstrap SCSS source
    -   If Bootstrap is used, replace with minimal custom CSS or utility classes

# TARGET ARCHITECTURE (VERY IMPORTANT)
    Now restructure the cleaned project into:
    High-performance edge-first e-commerce platform using:
    -   Node.js (API layer if needed)
    -   Cloudflare Workers (backend logic)
    -   Cloudflare D1 (database)
    -   Cloudflare R2 (file storage)

# REQUIRED FINAL STRUCTURE
/project
/frontend
/components
/pages
/styles
/assets
index.html

/worker
worker.js
routes/
controllers/

/database
schema.sql

/storage
(R2 integration logic)

wrangler.toml
package.json

# IMPLEMENTATION REQUIREMENTS
Convert frontend to static + component-based structure
Create sample Worker routes:
/products
/orders
/upload (R2)
Provide D1 schema for:
products
users
orders
Optimize for:
performance (no unused CSS/JS)
edge deployment
fast loading

# OUTPUT FORMAT
Provide:

Cleaned folder structure
List of removed files and why
Extracted tech stack
Optimized CSS/JS summary
New project structure (Cloudflare-based)
Sample Worker code
D1 schema
R2 upload example
Suggestions for further optimization

# IMPORTANT:
Do NOT blindly keep Bootstrap SCSS files
Do NOT keep node_modules
Focus on minimal, clean, fast frontend
Preserve design exactly, but improve structure
Assume this will go to production