exports.renderCDs = ( req, res, next ) => {
  const { artist, album } = req.params;
  const { cds } = res.locals;
  if ( cds ) {
    res.render( 'cds', { artist, album, cds } );
  } else {
    next();
  }
};
