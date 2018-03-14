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
  const { artist, album } = req.params;
  const { songs } = res.locals;
  if ( songs ) {
    res.render( 'songs', { artist, album, songs } );
  } else {
    const { cd } = req.params;
    const { cdSongs } = res.locals.cdSongs;
    res.render( 'songs', {
      artist,
      album,
      cd,
      songs: cdSongs
    } );
  }
};
