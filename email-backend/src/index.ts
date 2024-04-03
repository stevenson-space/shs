/* eslint-disable no-case-declarations */

export interface Env {
  MAILGUN_KEY: string;
}

export default {
  async fetch(
    request: Request,
    env: Env,
  ): Promise<Response> {
    let parsedMessage = '';

    switch (request.method) {
      case 'OPTIONS':
        return new Response(null, {
          headers: {
            'Access-Control-Allow-Origin': 'https://stevenson.space', // change to * for dev
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        })
      case 'POST':
        console.log(env.MAILGUN_KEY);
        if (request.body === null) {
          return new Response('Bad Request', { status: 400 });
        }

        const body = await request.json() as Record<string, string>;
        let targetEmail = '';
        for (const [key, value] of Object.entries(body)) {
          parsedMessage += `${value.name}: ${value.value}\n`;
          if (value.name === 'contact-address') {
            targetEmail = value.value;
          }
        }

        const emailBody = new URLSearchParams();
        emailBody.append('from', 'stevenson.space Document Request <documents@stevenson.space>');
        emailBody.append('to', 'me@andreww.co');
        if (targetEmail) {
          emailBody.append('h:Reply-To', targetEmail);
        }
        emailBody.append('subject', '📚 New Document Request');
        emailBody.append('text', parsedMessage);
        emailBody.append('html', parsedMessage.replace(/\n/g, '<br>'));

        try {
          const res = await fetch('https://api.mailgun.net/v3/stevenson.space/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `Basic ${btoa(`api:${env.MAILGUN_KEY}`)}`,
            },
            body: emailBody.toString(),
          });
          if (res.ok) {
            return new Response('OK', { status: 200 });
          } else {
            console.log(res);
          }
          return new Response('Internal Server Error', { status: 500 });
        } catch (e) {
          console.error(e);
          return new Response('Internal Server Error', { status: 500 });
        }
        break;
      default:
        return new Response('Method Not Allowed', {
          status: 405,
          headers: {
            Allow: 'POST',
          },
        });
    }
  },
};
