exports.renderAlbums = ( req, res ) => {
  const { artist } = req.params;
  const { albums } = res.locals;
  res.render( 'albums', { artist, albums } );
};

exports.renderCDs = ( req, res, next ) => {
  const { artist, album } = req.params;
  const { cds } = res.locals;
  if ( cds ) {
    res.render( 'cds', { artist, album, cds } );
  } else {
    next();
  }
};

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
