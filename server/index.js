const compression = require('compression');
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import http from 'http';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack.config';
// import authenticate from './middlewares/authenticate';
// import authorise from './middlewares/authorise';

import login from './routes/login';
import admin from './routes/admin';
import loginAuth from './helper/loginAuth';
import leaves from './routes/employee';
import manager from './routes/manager';

const socketIO = require('socket.io');

const port = process.env.PORT || 3002;
const app = express();
const server = http.createServer(app);

const io = socketIO(server);
global.socket = io;
io.on('connection', (socket) => {
  console.log(`New Connection, socket ID ${socket.id}`);
  // global.socket = socket;
});

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/rolebasedwebapp', { useMongoClient: true });

app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(compression());

// app.use('/api/users', signup);
app.use('/api/login', login);
app.use('/api/employee', loginAuth, admin);
app.use('/api/leaves', loginAuth, leaves);
app.use('/api/manager', loginAuth, manager);


const compiler = webpack(webpackConfig);

app.use(webpackMiddleware(compiler, {
  hot: true,
  publicPath: webpackConfig.output.publicPath,
  noInfo: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
  },
}));
app.use(webpackHotMiddleware(compiler));

app.use(express.static(path.resolve('public')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

process.on('unhandledRejection', async (reason, promise) => {
  console.log('Unhandled Rejection at:', reason);
});

server.listen(port, () => console.log(`Running on localhost:${port}`));
