const { promisify } = require( 'util' );

exports.hgetall = ( client, artist, albums ) => {
  const hgetall = promisify( client.hgetall ).bind( client );

  return hgetall( artist )
    .then( data => albums.map( album => {
      if ( data !== null && data[album] !== undefined ) {
        return data[album];
      }

      return album;
    } ) );
};

exports.hset = ( client, artist, album, mbalbum ) => {
  client.hexists( artist, album, ( err, data ) => {
    if ( data === 0 ) {
      client.hset( artist, album, mbalbum );
    }
  } );
};
