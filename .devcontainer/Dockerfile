FROM node:20-alpine

RUN apk add --no-cache sudo postgresql postgresql-contrib

ARG USERNAME=node
RUN echo "$USERNAME ALL=(root) NOPASSWD:ALL" > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

ENV DEVCONTAINER=true

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

COPY .env /app/.env
ENV DATABASE_URL=postgresql://postgres:postgres@db:5432/challenge?schema=public

EXPOSE 3000

CMD ["npm", "run", "start"]
