const { promisify } = require( 'util' );

exports.hgetall = ( client, artists ) => {
  const hgetall = promisify( client.hgetall ).bind( client );

  return hgetall( 'artists' )
    .then( data => artists.map( artist => {
      if ( data !== null && data[artist] !== undefined ) {
        return data[artist];
      }

      return artist;
    } ) );
};

exports.hget = ( client, artist ) => {
  const hget = promisify( client.hget ).bind( client );

  return hget( 'artists', artist )
    .then( data => {
      if ( data === null ) {
        return artist;
      }

      return data;
    } );
};

exports.hset = ( client, artist, mbartist ) => {
  client.hexists( 'artists', artist, ( err, data ) => {
    if ( data === 0 ) {
      client.hset( 'artists', artist, mbartist );
    }
  } );
};
