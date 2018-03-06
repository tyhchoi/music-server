const express = require( 'express' );
const path = require( 'path' );
const routes = require( './routes/index' );

const app = express();

app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'pug' );

const musicDirectory = process.env.NODE_ENV === 'testing' ? 'music' : process.env.MUSIC_DIRECTORY;
app.use( express.static( path.join( musicDirectory ) ) );
app.use( express.static( path.join( __dirname, 'public' ) ) );

app.use( '/', routes );

module.exports = app;
