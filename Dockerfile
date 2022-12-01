# Build the project in one container and use the artifacts in another one.
FROM node:16-alpine AS build

# Git is needed for fetching dependencies. build-base and python3 are included
# for building native libraries.
RUN apk add --no-cache build-base git python3

# Switch to an unpriviledged user for building software.
USER node
WORKDIR /home/node

# Copy lockfiles and install dependencies.
COPY --chown=node:node \
        package*.json \
        tsconfig*.json \
        nest-cli.json \
        ./

RUN npm ci

# Copy source code and build.
COPY --chown=node:node \
        src \
        ./src

RUN npm run build


# Start again for running the software, including only what is truly needed.
FROM node:16-alpine AS runner

# Switch to an unpriviledged user for running software.
USER node
WORKDIR /home/node

# Copy the required artifacts from the build container.
# Assumes that `npm run build` places built files in `./dist` directory.
COPY --from=build --chown=node:node /home/node/node_modules ./node_modules
COPY --from=build --chown=node:node /home/node/dist ./dist

# Run the software.
ENTRYPOINT ["node", "./dist/index.js"]