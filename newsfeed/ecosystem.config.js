module.exports = {
  apps : [{
    name: 'News Feed',
    script: 'npm',
    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    args: 'start',
    instances: "max",
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      DATABASE_HOST: 'localhost', // database endpoint
      DATABASE_PORT: '5432',
      DATABASE_NAME: 'strapi', // DB name
      DATABASE_USERNAME: '', // your username for psql
      DATABASE_PASSWORD: '', // your password for psql
    }
  }]
};
