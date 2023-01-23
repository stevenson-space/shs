import { Redis } from '@upstash/redis/cloudflare';
import { Ratelimit } from '@upstash/ratelimit';

/* eslint-disable no-case-declarations */
export interface Env {
  MUSIC_BUCKET: R2Bucket;

  AUTH_KEY_SECRET: string;
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
}

const cache = new Map();

const hasValidAuth = (request: Request, env: Env): boolean => request.headers.get('X-API-Key') === env.AUTH_KEY_SECRET;

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);
    const key = url.pathname.slice(1);

    switch (request.method) {
      case 'PUT':
        // in case we'd like to automate song uploading in the future
        if (hasValidAuth(request, env)) {
          await env.MUSIC_BUCKET.put(key, request.body);
          return new Response(`Put ${key} successfully!`);
        }
        return new Response('Forbidden', { status: 403 });
      case 'GET':
        // we want to ratelimit all GET requests, to prevent abuse, so we'll use Upstash Serverless Redis to do this
        const ratelimit = new Ratelimit({
          redis: Redis.fromEnv(env),
          limiter: Ratelimit.fixedWindow(30, '60 s'), // 30 requests every 60 seconds
          ephemeralCache: cache,
        });
        const ratelimitReq = await ratelimit.limit(request.headers.get('CF-Connecting-IP') || 'none');
        if (ratelimitReq.success) {
          const object = await env.MUSIC_BUCKET.get(key);

          if (object === null) {
            return new Response('Object Not Found', { status: 404 });
          }

          const headers = new Headers();
          object.writeHttpMetadata(headers);
          headers.set('etag', object.httpEtag);

          return new Response(object.body, {
            headers,
          });
        }
        return new Response('You are ratelimited', { status: 429 });
      default:
        return new Response('Method Not Allowed', {
          status: 405,
          headers: {
            Allow: 'PUT, GET',
          },
        });
    }
  },
};
