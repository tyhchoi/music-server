const albumMW = require( './albumDB' );

exports.getAlbums = async ( req, res, next ) => {
  const { client } = req.app.locals;
  const { artist } = req.params;
  const { albums } = res.locals;

  res.locals.albumNames = await albumMW.hgetall( client, artist, albums );

  next();
};

exports.setAlbum = ( req, res, next ) => {
  const { client } = req.app.locals;
  const { artist, album } = req.params;
  const mbalbum = res.locals.musicbrainz.album;

  albumMW.hset( client, artist, album, mbalbum );

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
