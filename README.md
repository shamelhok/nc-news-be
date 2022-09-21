# Northcoders News API

This is my first back end project, which I made as part of the Northcoders boot camp.

## Hosted Website
https://nc-news-shamel.herokuapp.com/api

## To view and test the code

Fork the repository, `git clone` it, `cd` into the directory then run `npm install`.

Ensure you have postgresql installed and running, you may need to run `sudo service postgresql start` in the terminal.

### Setting up database environment

You will need to create two .env files: `.env.test` and `.env.development`. Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see `/db/setup.sql` for the database names). Double check that these .env files are .gitignored.



