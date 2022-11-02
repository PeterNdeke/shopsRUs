## Prerequisites

- Node.js
- NPM
- Postgres
- typeScript

## Getting Started

Follow these steps at the command line on your local machine

```

git clone https://github.com/PeterNdeke/shopsRUs.git

cd shopsRUs

npm install

npm run compile

copy .env_example into .env

create postgres db and add your db credentils on the .env file

run command npm run sequelize-migrate-latest  to migrate tables

run command npm run start:dev to start application

navigate to http://localhost:9090/v1/health and see the running instant of the app
```

## Api Documention Links

- Route Definition http://localhost:9090/v1/health/routes

- Documentation Site https://localhost:9090/v1/health/routes/html

- Postman Collection https://localhost:9090/v1/health/postman
