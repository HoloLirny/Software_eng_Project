FROM node:18

<<<<<<< HEAD
WORKDIR /app
=======
WORKDIR ./
>>>>>>> 1fdc07e7fc82db24daea4ad2c4d12b1f89d3a4eb
COPY package*.json ./
RUN npm install
COPY .env . 
COPY . . 
EXPOSE 3000
<<<<<<< HEAD
CMD npm run dev
=======
CMD ["npm", "run", "dev"]
>>>>>>> 1fdc07e7fc82db24daea4ad2c4d12b1f89d3a4eb
