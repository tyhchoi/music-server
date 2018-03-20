const { promisify } = require( 'util' );

exports.getAlbums = async ( req, res, next ) => {
  const { client } = req.app.locals;
  const { artist } = req.params;
  const { albums } = res.locals;

  const hgetall = promisify( client.hgetall ).bind( client );

  const albumNames = await hgetall( artist )
    .then( data => albums.map( album => {
      if ( data !== null && data[album] !== undefined ) {
        return data[album];
      }

      return album;
    } ) )
    .catch( err => err );

  res.locals.albumNames = albumNames;

  next();
};

exports.setAlbum = ( req, res, next ) => {
  const { client } = req.app.locals;
  const { artist, album } = req.params;
  const mbalbum = res.locals.musicbrainz.album;

  client.hexists( artist, album, ( err, data ) => {
    if ( data === 0 ) {
      client.hset( artist, album, mbalbum );
    }
  } );

  next();
};

exports.renderAlbums = ( req, res ) => {
  const { artist } = req.params;
  const { albums, albumNames, artistName } = res.locals;
  res.render( 'albums', {
    artist,
    albums,
    albumNames,
    artistName
  } );
};
