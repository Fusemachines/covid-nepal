module.exports = {
  apps : [{
    name: 'newsfeed',
    script: './server.js',
    instances: "max",
    env: {
      NODE_ENV: "development",
      DATABASE_URI: "mongodb://newsfeeddb-usr:e7kLrKm07JWykd25sQflPs@10.0.0.10:27116/?authSource=admin",
      DATABASE_NAME: "newsfeed"
    }
  }]
};
