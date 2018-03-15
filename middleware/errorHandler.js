module.exports = ( err, req, res, next ) => {
  if ( err.code === 'ENOENT' ) {
    const fullPath = req.url.split( '/' );
    let [ file ] = fullPath.splice( -1 );
    if ( file === '' ) {
      [ file ] = fullPath.splice( -1 );
    }
    let path = fullPath.join( '/' );
    if ( path === '' ) {
      path = '/';
    }

    res.status( 404 );
    res.render( 'error', { path, file, code: 404 } );
  } else {
    next( err );
  }
};
