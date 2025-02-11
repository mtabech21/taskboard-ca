import { config } from 'dotenv'; config()
import 'tsconfig-paths/register';
import 'colors'
import express from 'express'
import routes from './routes/routes';
import public_routes from './routes/public';
import { authorization } from './routes/auth';
import configurations, { HUB_URL, LANDING_URL, PORTAL_URL } from './routes/config';
import initializer from './middleware/initializer';
import http from 'http'
import { Server } from 'socket.io'

const app = express(); app.set('trust proxy', true)

app.use(configurations)
app.use(public_routes)

app.use(authorization, routes)

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: [LANDING_URL, HUB_URL, PORTAL_URL,],
    credentials: true
  }
})

app.set('io',io)

server.listen(2021, initializer)