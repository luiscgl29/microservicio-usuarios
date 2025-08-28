FROM node:22-alpine

RUN apk add --no-cache openssh-client sshpass
WORKDIR /home/app
ENV SSH_HOSTNAME="samuelgarcia.site"
ENV SSH_PORT="21098"
ENV SSH_USERNAME="samuxybw"
ENV SSH_PASSWORD="5XWZW7L4sDoM"
ENV DATABASE_URL="mysql://samuxybw_luiscarlos:g)$[Ln(7XQb)@127.0.0.1:3306/samuxybw_luis_pos"

COPY package*.json ./
RUN npm i
COPY . .
RUN npx prisma generate

RUN mkdir -p /root/.ssh && chmod 700 /root/.ssh
EXPOSE 3000


RUN echo '#!/bin/sh' > /start.sh && \
    echo 'ssh-keyscan -p $SSH_PORT $SSH_HOSTNAME >> /root/.ssh/known_hosts 2>/dev/null' >> /start.sh && \
    echo 'sshpass -p "$SSH_PASSWORD" ssh -f -N -L 3306:127.0.0.1:3306 -p $SSH_PORT $SSH_USERNAME@$SSH_HOSTNAME' >> /start.sh && \
    echo 'echo "SHH ✅"' >> /start.sh && \
    echo 'sleep 5' >> /start.sh && \
    echo 'echo "Ejecutando prisma 💎..."' >> /start.sh && \
    echo 'npx prisma db push --accept-data-loss' >> /start.sh && \
    echo 'echo "Tablas ✅"' >> /start.sh && \
    echo 'exec npm run start' >> /start.sh && \
    chmod +x /start.sh

CMD ["/start.sh"]