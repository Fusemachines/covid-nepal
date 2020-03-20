# Covid Nepal

## Installation
```
git clone https://github.com/Fusemachines/covid-nepal.git
yarn install
```

## Configuration
copy `.env.sample` file to `.env.development` and update your configuration

## Running Server
```
yarn dev
```
> Application should be running under [Localhost:5001](http://localhost:5001)


### Deployment
copy `.env.sample` file to `.env.production` and update your configuration

Run ```yarn prod``` to start production
Run ```pm2 logs``` to watch logs