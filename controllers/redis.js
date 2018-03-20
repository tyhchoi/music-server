const { promisify } = require( 'util' );

exports.getArtists = async ( req, res, next ) => {
  const { client } = req.app.locals;
  const { artists } = res.locals;

  const hgetall = promisify( client.hgetall ).bind( client );

  const artistNames = await hgetall( 'artists' )
    .then( data => artists.map( artist => {
      if ( data !== null && data[artist] !== undefined ) {
        return data[artist];
      }

      return artist;
    } ) )
    .catch( err => err );

  res.locals.artistNames = artistNames;

  next();
};

exports.setArtist = ( req, res, next ) => {
  const { client } = req.app.locals;
  const { artist } = req.params;
  const mbartist = res.locals.musicbrainz.artist;

  client.hexists( 'artists', artist, ( err, data ) => {
    if ( data === 0 ) {
      client.hset( 'artists', artist, mbartist );
    }
  } );

  next();
};
