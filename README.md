## Description

This is the solution for a development test whith [Nest](https://github.com/nestjs/nest), framework TypeScript starter repository.

- The solution is a simple RESTful API that allows users to create, read, update and delete (user, projects, organizational units, vehicles and transfers).
- The solution uses a Postgres database to store user data.
- The solution uses TypeORM as the ORM to interact with the database.
- The solution uses Swagger to document the API.
- The solution uses Jest to write unit tests for the API.
- The solution uses Docker Compose to run the Postgres databaseI.
- The solution uses TypeORM migrations to create the database schema.
- The solution uses TypeORM seed to define the initial data like roles, users and permissions.
- The solution uses NestJS Guards to protect the routes.
- The solution uses JWT and secure cookies for authentication.


## Installation

```bash
$ npm install
```

## setup environment variables
- Rename .env.example file to .env in the root directory and add the following variables

## Running the DB docker container

```bash
docker-compose up
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# run migrations
$ npm run migrate

# run seed
$ npm run seed:run
```

## Test

```bash
# unit tests
$ npm run test


# test coverage
$ npm run test:cov
```

## Api Docs
The Api is documented with swagger, to view the api documentation, visit the following url:
```bash
http://localhost:3000/docs
```

