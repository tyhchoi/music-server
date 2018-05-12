const albumDB = require( './albumDB' );

exports.getAlbums = async ( req, res, next ) => {
  const { client } = req.app.locals;
  const { artist } = req.params;
  const { albumLinks } = res.locals;

  const albumNames = await albumDB.hgetall( client, artist, albumLinks );
  res.locals.albums = albumLinks.map( ( albumLink, i ) => ( { albumLink, albumName: albumNames[i] } ) );

  next();
};

exports.setAlbum = ( req, res, next ) => {
  const { client } = req.app.locals;
  const { artist, album } = req.params;
  const albumName = res.locals.musicbrainz.album;

  albumDB.hset( client, artist, album, albumName );

  next();
};

exports.jsonAlbums = ( req, res ) => {
  const { artist, albums } = res.locals;
  res.json( {
    artist,
    albums
  } );
};
