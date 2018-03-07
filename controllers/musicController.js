const fs = require( 'fs' );
const path = require( 'path' );

const readDir = ( checkDir, subDirectory = '' ) => {
  const musicDirectory = process.env.NODE_ENV === 'testing' ? 'music' : process.env.MUSIC_DIRECTORY;
  const joinedPath = path.join( musicDirectory, subDirectory );
  const dir = fs.readdirSync( joinedPath );

  const contains = dir.filter( file => file.includes( 'flac' ) );

  if ( checkDir ) {
    if ( contains.length > 0 ) {
      return [];
    }
    return dir.filter( file => fs.lstatSync( path.join( joinedPath, file ) ).isDirectory() );
  }
  return contains;
};

exports.getArtists = ( req, res ) => {
  const artists = readDir( true );
  res.render( 'artists', { title: 'Artists', artists } );
};

exports.getAlbums = ( req, res ) => {
  const { artist } = req.params;
  const albums = readDir( true, artist );
  res.render( 'albums', { artist, albums } );
};

exports.isCD = ( req, res, next ) => {
  const { artist, album } = req.params;
  const joinedPath = path.join( artist, album );
  const cds = readDir( true, joinedPath );
  if ( cds.length > 0 ) {
    res.render( 'cds', { artist, album, cds } );
  }

  req.params.songs = readDir( false, joinedPath );
  next();
};

exports.getSongs = ( req, res ) => {
  const { artist, album, songs } = req.params;
  if ( songs ) {
    res.render( 'songs', { artist, album, songs } );
  } else {
    const { cd } = req.params;
    const cdSongs = readDir( false, path.join( artist, album, cd ) );
    res.render( 'songs', {
      artist,
      album,
      cd,
      songs: cdSongs
    } );
  }
};
