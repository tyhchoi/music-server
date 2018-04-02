const { promisify } = require( 'util' );

exports.hget = ( client, album ) => {
  const hget = promisify( client.hget ).bind( client );

  return hget( album, 'mbdata' )
    .then( data => JSON.parse( data ) );
};

exports.hset = ( client, album, musicbrainz, coverart ) => {
  const mbdata = Object.assign( {}, musicbrainz, coverart );

  client.hexists( album, 'mbdata', ( err, data ) => {
    if ( data === 0 ) {
      client.hset( album, 'mbdata', JSON.stringify( mbdata ) );
    }
  } );
};
