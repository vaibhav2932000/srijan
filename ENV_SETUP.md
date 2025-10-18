# Environment Variables Setup

Since `.env.example` couldn't be created, here's how to set up your environment:

## Quick Setup

Your `.env.local` file has been created with default values. Update it with your actual configuration:

```bash
# Required: Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Required: Admin API Key for CSV uploads
NEXT_PUBLIC_ADMIN_API_KEY=Ws1BDHknKjSlPSAiEBq8gZjjbG13

# Optional: AWS S3 Configuration (if using S3 for images)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=srijan-products

# Optional: Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## Environment Variables Explained

### Required Variables

1. **NEXT_PUBLIC_API_URL**
   - Your backend REST API base URL
   - Example: `http://localhost:3001/api` (development)
   - Example: `https://api.yourdomain.com/api` (production)
   - Used for: Product fetching, search, categories, CSV upload

2. **NEXT_PUBLIC_ADMIN_API_KEY**
   - API key for admin authentication
   - Used for CSV upload endpoint
   - Get this from your backend admin panel
   - Example: `admin-secret-key-123`

### Optional Variables

3. **AWS Configuration** (for S3 image storage)
   - Only needed if you want to download and store images from CSV URLs
   - `AWS_REGION`: Your AWS region (e.g., `us-east-1`)
   - `AWS_ACCESS_KEY_ID`: Your AWS access key
   - `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
   - `AWS_S3_BUCKET`: Your S3 bucket name

4. **NEXT_PUBLIC_GA_ID**
   - Google Analytics tracking ID
   - Optional for analytics tracking

## Security Notes

⚠️ **Important:**
- Never commit `.env.local` to version control (it's in `.gitignore`)
- Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Keep API keys and secrets secure
- Use different API keys for development and production

## Development vs Production

### Development (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_ADMIN_API_KEY=dev-api-key
```

### Production (Deployment Platform)
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_ADMIN_API_KEY=prod-api-key-secure
```

Set production variables in your deployment platform:
- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Build & Deploy → Environment
- **Others**: See DEPLOYMENT.md

## Quick Test

After setting up your `.env.local`:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Visit http://localhost:3000
# The app should now connect to your backend API
```

## Troubleshooting

**"API connection failed"**
- Check that `NEXT_PUBLIC_API_URL` is correct
- Ensure your backend is running
- Check CORS settings on backend

**"CSV upload unauthorized"**
- Verify `NEXT_PUBLIC_ADMIN_API_KEY` matches backend
- Check that backend expects `X-API-Key` header

**"Environment variables not working"**
- Restart dev server after changing `.env.local`
- Check that variable names are exactly as shown
- Ensure no extra spaces around `=`

---

✅ Your `.env.local` file is ready! Just update the values and you're good to go.

## Firebase and Razorpay Environment Variables

Add these to your `.env.local` (no quotes):

```bash
# Firebase (required for auth, Firestore, and persistence)
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyCetAYB46upzQXjUWFL9huQjca5bPavTTg"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="srijan-8f159.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="srijan-8f159"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="srijan-8f159.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="778546975199"
NEXT_PUBLIC_FIREBASE_APP_ID="1:778546975199:web:093f925067433276ddb46a"

# Razorpay (required for payments)
RAZORPAY_KEY_ID=rzp_live_RUrsTkiMwvqhH9
RAZORPAY_KEY_SECRET=0p0HjaZW66b25h6rRqynHyeu
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_RUrsTkiMwvqhH9
```

Notes:
- Keep `RAZORPAY_KEY_SECRET` server-only (do not prefix with `NEXT_PUBLIC_`).
- Use separate Firebase projects and Razorpay keys for dev vs prod.
- After adding/updating these, restart `npm run dev`.

