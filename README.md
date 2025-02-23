Set up to Start Project 
1. change file name .env.example to .env
2. run npm i
3. docker compose up
4. npx prisma generate
5. npx prisma migrate dev
6. npm run dev


Note : 23-2-2568 edit password to be password
0. docker ps  // to find container name
1. docker exec -it <container name> psql -U user -d mydb
2. ALTER USER "user" WITH PASSWORD 'password';
    after run the 2. it should be ans ALTER ROLE 
3. \q
4. docker-compose down
5. docker-compose up -d
6. npx prisma migrate reset   // to run seed



