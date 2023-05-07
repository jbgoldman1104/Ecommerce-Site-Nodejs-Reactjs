## MongoDB Connection

You need to create a `.env` file on the main folder (./).
Your `.env` file's format must be the same as following;

```
MONGO_USERNAME  =   <username>
MONGO_PASSWORD  =   <yourpassword>
JWT_SECRET      =   <anysecretisOK>
EMAIL_ADDR      =   <EMAIL_ADDR>
EMAIL_PASS      =   <EMAIL_ADDR_PASS>
```

### Docker

You can use `docker-compose` for the local development environment instead of your actual MongoDB Cluster. Also, tests are using `docker`. 

In order to set up required images and local environment;
```shell
$ docker-compose up -d
```

## Run Server

```shell
$ npm run dev
```

Server listens on `:3000`. The port number can be changed by exporting `PORT`.

```shell
$ export PORT="3001"
$ npm run dev
```
