const express = require( 'express' );
const path = require( 'path' );
const routes = require( './routes/index' );
const errorHandler = require( './helpers/errorHandler' );

const app = express();

app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'pug' );

const musicDirectory = process.env.NODE_ENV === 'test' ? 'music' : process.env.MUSIC_DIRECTORY;
app.use( express.static( musicDirectory ) );
app.use( express.static( path.join( __dirname, 'public' ) ) );

app.use( '/', routes );

app.use( errorHandler );

module.exports = app;
