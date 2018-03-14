module.exports = ( err, req, res, next ) => {
  if ( err.code === 'ENOENT' ) {
    const fullPath = req.url.split( '/' );
    let [ file ] = fullPath.splice( -1 );
    if ( file === '' ) {
      [ file ] = fullPath.splice( -1 );
    }
    const path = fullPath.join( '/' );
    res.status( 404 );
    res.render( 'error', { path, file, code: 404 } );
  } else {
    next( err );
  }
};
