# music-backend
The Cloudflare Workers backend that powers stevenson.space Jukebox! Acts as a proxy layer between Cloudflare R2 object storage and the client for rate limiting purposes.

Why Cloudflare Workers?
- Globally distributed backend
- Native R2 storage support
- Allows for simple ratelimiting with Upstash

## Project setup
1. Create/login to a [Cloudflare](https://cloudflare.com) account
2. [Create an R2 bucket](https://dash.cloudflare.com/sign-up/r2) named `stevenson-space-music-dev`
3. We are currently not using ratelimiting, ignore. ~~[Create an Upstash Serverless Redis instance](https://docs.upstash.com/redis) - Upstash allows us to ratelimit requests in order to prevent abuse.~~
4. Fill in the enviornment variables in `/wrangler.toml`
5. Run the following commands:
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
