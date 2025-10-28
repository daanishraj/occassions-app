# Public Folder Files for SPA Routing

This folder contains platform-specific configuration files for Single Page Application (SPA) routing.

## Files Included:

### 1. `_redirects` 
- **Platform:** Netlify
- **Purpose:** Tells Netlify to serve index.html for all routes
- **Format:** `/*    /index.html   200`

### 2. `vercel.json`
- **Platforms:** Vercel, Render, Firebase
- **Purpose:** Rewrites all routes to index.html
- **Format:** JSON with rewrites configuration

### 3. `404.html`
- **Platforms:** GitHub Pages, any static host
- **Purpose:** Fallback - redirects to index.html using JavaScript
- **How:** If a route isn't found, server serves 404.html which redirects

## How It Works:

When you deploy to **any** platform:
1. Vite copies everything from `public/` to `dist/` during build (`npm run build`)
2. The platform's hosting detects the configuration file it supports
3. All routes (like `/occasions`) now serve `index.html`
4. React Router then handles the client-side routing

## Platform Support:

- ✅ **Vercel** - Uses `vercel.json`
- ✅ **Render** - Uses `vercel.json` 
- ✅ **Netlify** - Uses `_redirects`
- ✅ **Firebase** - Uses `vercel.json` or `firebase.json`
- ✅ **GitHub Pages** - Uses `404.html`
- ✅ **AWS S3 + CloudFront** - Uses `vercel.json` or Lambda@Edge
- ✅ **Most other hosts** - At least one of these will work

## Testing Locally:

After building (`npm run build`), the files will be in `dist/`. You can test with:

```bash
cd ui
npm run build
npx serve dist
# Then visit http://localhost:3000/occasions (should work!)
```

