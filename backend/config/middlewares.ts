export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: ['https://potential-waffle-jj4qpxxjjgpgh5r5q-3000.app.github.dev'],
      headers: [
        'Content-Type',
        'Authorization',
        'Origin',
        'Accept',
        'Cache-Control',
        'If-Match',
        'If-None-Match',
        'If-Modified-Since',
        'User-Agent',
        'X-Requested-With'
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      keepHeaderOnError: true,
      credentials: true,
      maxAge: 3600 
    }
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  {
    name: 'global::track-user-actions',
    config: {
      enabled: true
    }
  }
];
