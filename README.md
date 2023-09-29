# Northcoders News API

This is my first back end project, which I made as part of the Northcoders boot camp using test driven development, Express.js and PostgreSQL.

## Hosted Website
https://nc-news-api-rwfo.onrender.com/api

## To view and test the code

Fork the repository, `git clone` it, `cd` into the directory then run `npm install`.

Ensure you have postgresql installed and running, you may need to run `sudo service postgresql start` in the terminal.

You will need to create two .env files: `.env.test` and `.env.development`. Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see `/db/setup.sql` for the database names).

Double check that these .env files are .gitignored.

Run `npm run setup-dbs` in the terminal to initialise the databases.

Run `npm run seed` to seed the development database.

Run `npm start` to listen on port 9090 (can be changed in listen.js) using the development data.

http://localhost:9090/api


q
