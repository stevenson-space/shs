# email-backend
The Cloudflare Workers backend that powers stevenson.space email forms! 

Why Cloudflare Workers?
- Globally distributed backend

## Project setup
1. Create/login to a [Cloudflare](https://cloudflare.com) account
2. Fill in the enviornment variables in `/wrangler.toml`
3. Run the following commands:
```
npm install -g wrangler
wrangler login
npm i
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Deploy to production
```
npm run deploy
```
