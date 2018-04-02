const { promisify } = require( 'util' );

exports.hget = ( client, album ) => {
  const hget = promisify( client.hget ).bind( client );

  return hget( album, 'songs' )
    .then( data => JSON.parse( data ) );
};

exports.hset = ( client, album, songs ) => {
  client.hexists( album, 'songs', ( err, data ) => {
    if ( data === 0 ) {
      client.hset( album, 'songs', JSON.stringify( songs ) );
    }
  } );
};
