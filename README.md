
## How to run

### General
* Create a new Postgres DB

### In server directory
* Run `npm ci`
* Set up your `.env` file, check `.env.sample` as an example
* run `npx prisma migrate dev` to run migration files on DB
* Run `nodemon index.js`

### In client directory
* Run `npm ci`
* Run `npm start`
* Go to localhost:3000
