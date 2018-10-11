FROM node:8-alpine

# for i in `seq 89 94`; do FNAME=`printf "%04d" $i`; curl -O "http://runeberg.org/svetym/$FNAME.html"; done

EXPOSE 8989
WORKDIR /svetym-back

COPY package.json package-lock.json ./
RUN npm install

COPY . .
CMD ["node", "."]
