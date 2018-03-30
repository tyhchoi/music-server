exports.renderSongs = ( req, res ) => {
  const { artist, album } = req.params;
  const { songs, songNames } = res.locals;

  const mbartist = res.locals.musicbrainz.artist;
  const mbalbum = res.locals.musicbrainz.album;
  const { date } = res.locals.musicbrainz;

  const { image, contentType } = res.locals.coverart;

  const values = {
    artist, album, songs, songNames, mbartist, mbalbum, date, image, contentType
  };

  res.render( 'songs', values );
};
