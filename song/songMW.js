const songDB = require( './songDB' );

exports.getSongs = async ( req, res, next ) => {
  const { client } = req.app.locals;
  const { album } = req.params;

  res.locals.songNames = await songDB.hget( client, album );

  next();
};

exports.setSongs = ( req, res, next ) => {
  const { client } = req.app.locals;
  const { album } = req.params;
  const { songNames } = res.locals;

  songDB.hset( client, album, songNames );

  next();
};

exports.renderSongs = ( req, res ) => {
  const { artist, album } = req.params;
  const { songs, songNames } = res.locals;

  const mbartist = res.locals.musicbrainz.artist;
  const mbalbum = res.locals.musicbrainz.album;
  const { date, albumList } = res.locals.musicbrainz;

  const { image, contentType } = res.locals.coverart;

  const values = {
    artist, album, albumList, songs, songNames, mbartist, mbalbum, date, image, contentType
  };

  res.render( 'songs', values );
};
