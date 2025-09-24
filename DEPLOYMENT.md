# Deployment Guide

## GitHub Pages Deployment

This project is configured to automatically deploy to GitHub Pages using GitHub Actions.

### Setup Instructions

1. **Enable GitHub Pages**:
   - Go to your repository Settings
   - Navigate to "Pages" in the left sidebar
   - Under "Source", select "GitHub Actions"

2. **Configure Repository Secrets** (if needed):
   - No additional secrets are required for basic deployment
   - The workflow uses `GITHUB_TOKEN` which is automatically provided

3. **Automatic Deployment**:
   - Push to the `main` branch triggers automatic deployment
   - Pull requests to `main` also trigger builds (but no deployment)
   - Check the "Actions" tab in your repository to monitor deployment status

### Important Notes

- This app uses SQLite and server-side features that won't work on GitHub Pages (static hosting)
- The deployment creates a static export of the client-side components only
- Server-side features (API routes, authentication, database) will not function
- Consider this deployment for demo/preview purposes only

### For Full Functionality

For a production deployment with full functionality, consider:
- **Vercel**: Automatic deployment with server-side support
- **Netlify**: Similar to Vercel with serverless functions
- **Railway/Render**: Full-stack hosting with database support
- **AWS/Azure**: Complete cloud infrastructure

### Local Testing of Static Export

To test the static export locally:

```bash
npm run build
npx serve out
```

This will serve the static files on `http://localhost:3000`

### Troubleshooting

- **Build failures**: Check the Actions tab for detailed logs
- **Missing pages**: Ensure all pages are statically exportable
- **Image issues**: Verify images are in the `public/` directory
- **API calls**: Static exports cannot handle API routes

### Custom Domain (Optional)

To use a custom domain:
1. Add a `CNAME` file to the `public/` directory with your domain
2. Configure DNS settings with your domain provider
3. Update repository settings under Pages > Custom domain