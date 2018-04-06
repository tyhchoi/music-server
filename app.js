const express = require( 'express' );
const path = require( 'path' );
const routes = require( './routes/index' );
const errorHandlerMW = require( './middleware/errorHandler/errorHandlerMW' );
const redis = require( 'redis' );

const app = express();
const client = redis.createClient();

client.on( 'ready', () => {
  client.flushdb();
} );

app.locals.client = client;

app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'pug' );

const musicDirectory = process.env.NODE_ENV === 'test' ? 'test/fixtures' : process.env.MUSIC_DIRECTORY;
app.use( '/music', express.static( musicDirectory ) );
app.use( express.static( path.join( __dirname, 'public' ) ) );

app.use( '/', routes );

app.use( errorHandlerMW );

module.exports = app;
