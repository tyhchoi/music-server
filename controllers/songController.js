exports.renderSongs = ( req, res ) => {
  const { artist, album, cd } = req.params;
  const { songs } = res.locals;

  const mbartist = res.locals.musicbrainz.artist;
  const mbalbum = res.locals.musicbrainz.album;
  const { date } = res.locals.musicbrainz;

  const { image, contentType } = res.locals.coverart;

  const values = {
    artist, album, songs, mbartist, mbalbum, date, image, contentType
  };

  if ( cd ) {
    values.cd = cd;
  }
  res.render( 'songs', values );
};
