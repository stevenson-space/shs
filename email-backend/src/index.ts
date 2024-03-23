/* eslint-disable no-case-declarations */

import { EmailMessage } from "cloudflare:email";
import { createMimeMessage } from "mimetext";

export default {
  async fetch(
    request: Request,
    env: Env,
  ): Promise<Response> {
    let parsedMessage = '';

    switch (request.method) {
      case 'POST':
        // in case we'd like to automate song uploading in the future
        if (request.body === null) {
          return new Response('Bad Request', { status: 400 });
        }

        const msg = createMimeMessage();
        msg.setSender({ name: 'Document Request', addr: 'documents@stevenson.space' });
        msg.setSubject('📚 New Document Request');

        const body = await request.json() as Record<string, string>;
        for (const [key, value] of Object.entries(body)) {
          parsedMessage += `${key}: ${value}\n`;
        }

        msg.addMessage({
          contentType: 'text/plain',
          data: parsedMessage,
        });

        const email = new EmailMessage(
          'documents@stevenson.space',
          'admin@stevenson.space',
          msg.asRaw(),
        );

        try {
          await env.SEB.send(email);
        } catch (e) {
          console.error(e);
          return new Response('Internal Server Error', { status: 500 });
        }
        return new Response('Forbidden', { status: 403 });
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
