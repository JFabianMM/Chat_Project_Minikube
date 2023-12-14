FROM --platform=linux/amd64 node:18

RUN mkdir -p /home/app1

COPY . /home/app1

WORKDIR /home/app1

RUN npm install

EXPOSE 4001

CMD ["node", "/home/app1/src/index.js"]