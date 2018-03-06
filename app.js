const express = require( 'express' );
const path = require( 'path' );
const routes = require( './routes/index' );

const app = express();

app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'pug' );

if ( process.env.NODE_ENV === 'testing' ) {
  app.use( express.static( 'public' ) );
} else {
  app.use( express.static( process.env.MUSIC_DIRECTORY ) );
}

app.use( '/', routes );

module.exports = app;
