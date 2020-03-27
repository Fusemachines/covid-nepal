module.exports = {
  apps : [{
    name: 'News Feed',
    script: 'yarn',
    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    args: 'start',
    instances: "max",
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      DATABASE_HOST: 'localhost',
      DATABASE_PORT: '5432',
      DATABASE_NAME: 'strapi',
      DATABASE_USERNAME: '',
      DATABASE_PASSWORD: '',
    }
  }]
};
