FROM node:20-alpine AS client-build

WORKDIR /client
COPY ./client/package*.json ./
RUN npm install --force
COPY ./client ./
RUN npm run build

FROM denoland/deno:debian AS server-build

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ nodejs npm \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /myspeed

COPY ./server /myspeed/server
COPY ./deno.json /myspeed/deno.json

RUN deno install --allow-scripts

FROM denoland/deno:debian

RUN apt-get update && apt-get install -y --no-install-recommends \
    tzdata \
    && rm -rf /var/lib/apt/lists/*

ENV TZ=Etc/UTC

WORKDIR /myspeed

COPY --from=server-build /myspeed/server /myspeed/server
COPY --from=server-build /myspeed/deno.json /myspeed/deno.json
COPY --from=server-build /myspeed/node_modules /myspeed/node_modules
COPY --from=server-build /deno-dir /deno-dir
COPY --from=client-build /client/build /myspeed/build

VOLUME ["/myspeed/data"]

EXPOSE 5216

CMD ["deno", "run", "--allow-all", "server/index.js"]