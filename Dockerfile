FROM node:20-slim

# system deps
RUN apt-get update && \
    apt-get install -y python3 curl ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# install yt-dlp
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
    -o /usr/local/bin/yt-dlp && \
    chmod +x /usr/local/bin/yt-dlp

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "start"]
