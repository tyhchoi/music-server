require( 'dotenv' ).config();
const server = require( 'http' );
const app = require( './app' );

server.createServer( app ).listen( process.env.PORT || 8888 );
