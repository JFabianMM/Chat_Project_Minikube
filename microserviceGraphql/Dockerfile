FROM --platform=linux/amd64 node:18

RUN mkdir -p /home/app2

COPY . /home/app2

EXPOSE 4000

CMD ["node", "/home/app2/src/index.js"]