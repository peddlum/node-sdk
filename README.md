# @peddlum/node-sdk

Official Node.js SDK for Peddlum. Gives apps created via peddlum's seller
dashboard an auth / query / storage / chatbot / payments / push / email /
AI / search surface over HTTPS.

## Install

```bash
# Development builds (hits api-dev.peddlum.com)
npm install "github:peddlum/node-sdk#develop"

# Production builds (hits api.peddlum.com)
npm install "github:peddlum/node-sdk"
```

npm publishing will follow in `1.0.0`. For now, `github:` install is the
only supported path — matches the peddlum deploy pipeline's expectations.

## Quick start

```ts
import { PeddlumClient } from '@peddlum/node-sdk';

const client = new PeddlumClient(process.env.PEDDLUM_API_KEY!);

// Sign up an end user
const { user, token } = await client.auth.register({
  email: 'user@example.com',
  password: 'hunter2',
  name: 'Jane Doe',
});

// Sign in
const session = await client.auth.login({
  email: 'user@example.com',
  password: 'hunter2',
});

// Fetch the current user (requires session token)
client.setHeader('Authorization', `Bearer ${session.token}`);
const me = await client.auth.me();
```

## Status

Phase 1: `client.auth.*` (register, login, logout, me, OAuth, password
reset, email verification, teams).

Phases 2–12 add `client.query.*`, `client.storage.*`, `client.email.*`,
`client.push.*`, `client.ai.*`, `client.chatbot.*`, `client.search.*`,
`client.vector.*`, `client.payment.*`, `client.realtime.*`,
`client.videoConferencing.*`. See the peddlum repo's
`APP-SDK-IMPLEMENTATION.md` for the roadmap.

## Development

Source of truth lives in the private repo `peddlum/node-sdk-private`.
The public `peddlum/node-sdk` repo is synced by CI on every push to
`develop` or `main`. The `main` sync runs `scripts/patch-urls-for-public.sh`
to rewrite the base URL to `api.peddlum.com`.

```bash
npm install
npm run build
npm test
```

## License

MIT © Peddlum
