# Covid Nepal

## Installation

```[bash]
git clone https://github.com/Fusemachines/covid-nepal.git
yarn install
```

### Configuration

copy `.env.sample` file to `.env.development` and update your configuration

### Running local Server

```[bash]
yarn dev
```

> Application should be running under [localhost:5000](http://localhost:8000)

### Production Deployment

Copy `.env.sample` file to `.env.production` and update your configuration for production
environment in .env.production file

- Run ```yarn prod``` to start production
- Run ```pm2 logs``` to watch logs
