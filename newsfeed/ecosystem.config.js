module.exports = {
  apps : [{
    name: 'newsfeed',
    script: 'npm',
    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    args: 'start',
    instances: "max",
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      DATABASE_URI: 'mongodb://covidnepal-dev-usr:IsCukSKfe7kLrKm07JWykd25sQflPs%2B9%2BbgdaaNLIv4%3D@10.0.0.10:27116/?authSource=covidnepal-dev',
      DATABASE_NAME: 'newsfeed'
    }
  }]
};
