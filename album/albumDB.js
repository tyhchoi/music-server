const { promisify } = require( 'util' );

exports.hgetall = ( client, artistLink, albumLinks ) => {
  const hgetall = promisify( client.hgetall ).bind( client );

  return hgetall( artistLink )
    .then( data => albumLinks.map( albumLink => {
      if ( data !== null && data[albumLink] !== undefined ) {
        return data[albumLink];
      }

      return albumLink;
    } ) );
};

exports.hset = ( client, artistLink, albumLink, albumName ) => {
  client.hexists( artistLink, albumLink, ( err, data ) => {
    if ( data === 0 ) {
      client.hset( artistLink, albumLink, albumName );
    }
  } );
};
