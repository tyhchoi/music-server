const albumModel = require( '../models/albumModel.js' );

exports.getAlbums = async ( req, res, next ) => {
  const { client } = req.app.locals;
  const { artist } = req.params;
  const { albums } = res.locals;

  res.locals.albumNames = await albumModel.hgetall( client, artist, albums );

  next();
};

exports.setAlbum = ( req, res, next ) => {
  const { client } = req.app.locals;
  const { artist, album } = req.params;
  const mbalbum = res.locals.musicbrainz.album;

  albumModel.hset( client, artist, album, mbalbum );

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
