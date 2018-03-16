exports.renderArtists = ( req, res ) => {
  const { artists } = res.locals;
  res.render( 'artists', { artists } );
};

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

  const values = {
    artist, album, songs, mbartist, mbalbum, date
  };

  if ( cd ) {
    values.cd = cd;
  }
  res.render( 'songs', values );
};
