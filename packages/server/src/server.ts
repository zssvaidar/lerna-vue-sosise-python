// The most first thing you need to load the config
import dotenv from 'dotenv';
dotenv.config();

// import Server from 'sosise-core/build/server';
import Server from './rewrite/sosise-core/server';

const server = new Server();
server.run();
