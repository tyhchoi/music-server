const { promisify } = require( 'util' );

exports.hgetall = ( client, artistLinks ) => {
  const hgetall = promisify( client.hgetall ).bind( client );

  return hgetall( 'artists' )
    .then( data => artistLinks.map( artistLink => {
      const artistName = data[artistLink];
      if ( data !== null && artistName !== undefined ) {
        return artistName;
      }

      return artistLink;
    } ) );
};

exports.hget = ( client, artistLink ) => {
  const hget = promisify( client.hget ).bind( client );

  return hget( 'artists', artistLink )
    .then( artistName => {
      if ( artistName === null ) {
        return artistLink;
      }

      return artistName;
    } );
};

exports.hset = ( client, artistLink, artistName ) => {
  client.hexists( 'artists', artistLink, ( err, data ) => {
    if ( data === 0 ) {
      client.hset( 'artists', artistLink, artistName );
    }
  } );
};
