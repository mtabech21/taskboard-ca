import { config } from 'dotenv'; config()
import 'tsconfig-paths/register';
import 'colors'
import express from 'express'
import routes from './routes/routes';
import public_routes from './routes/public';
import { authorization } from './routes/auth';
import configurations from './routes/config';
import initializer from './middleware/initializer';

const app = express(); app.set('trust proxy', true)

app.use(configurations)
app.use(public_routes)

app.use(authorization, routes)

app.listen(2021, initializer)

