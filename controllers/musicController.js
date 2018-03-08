const path = require( 'path' );
const musicFiles = require( '../helpers/musicFiles' );

exports.getArtists = ( req, res ) => {
  const artists = musicFiles.readDir( true );
  res.render( 'artists', { title: 'Artists', artists } );
};

exports.getAlbums = ( req, res ) => {
  const { artist } = req.params;
  const albums = musicFiles.readDir( true, artist );
  res.render( 'albums', { artist, albums } );
};

exports.isCD = ( req, res, next ) => {
  const { artist, album } = req.params;
  const joinedPath = path.join( artist, album );
  const cds = musicFiles.readDir( true, joinedPath );
  if ( cds.length > 0 ) {
    res.render( 'cds', { artist, album, cds } );
  } else {
    res.locals.songs = musicFiles.readDir( false, joinedPath );
    next();
  }
};

exports.getSongs = ( req, res ) => {
  const { artist, album } = req.params;
  const { songs } = res.locals;
  if ( songs ) {
    res.render( 'songs', { artist, album, songs } );
  } else {
    const { cd } = req.params;
    const cdSongs = musicFiles.readDir( false, path.join( artist, album, cd ) );
    res.render( 'songs', {
      artist,
      album,
      cd,
      songs: cdSongs
    } );
  }
};
