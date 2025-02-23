Set up to Start Project 
1. change file name .env.example to .env
2. run npm i
3. docker compose up
4. npx prisma generate
5. npx prisma migrate dev
6. npm run dev


Note : 23-2-2568 edit password to be password
1. docker exec -it project_se_t12-postgres-1 psql -U user -d mydb
2. ALTER USER "user" WITH PASSWORD 'password';
    after run the 2. it should be ans ALTER ROLE 
3. \q
4. docker-compose down
5. docker-compose up -d



