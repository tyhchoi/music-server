const fs = require( 'fs' );
const path = require( 'path' );

const readDir = ( checkDir, subDirectory = '' ) => {
  const musicDirectory = process.env.NODE_ENV === 'test' ? 'test/fixtures' : process.env.MUSIC_DIRECTORY;
  const fileType = process.env.NODE_ENV === 'test' ? '.flac' : process.env.FILE_TYPE;
  const joinedPath = path.join( musicDirectory, subDirectory );
  const dir = fs.readdirSync( joinedPath );

  const contains = dir.filter( file => file.includes( fileType ) );

  if ( checkDir ) {
    if ( contains.length > 0 ) {
      return [];
    }
    return dir.filter( file => fs.lstatSync( path.join( joinedPath, file ) ).isDirectory() );
  }
  return contains;
};

exports.getArtists = ( req, res, next ) => {
  const artists = readDir( true );
  res.locals.artists = artists;
  next();
};

exports.getAlbums = ( req, res, next ) => {
  const { artist } = req.params;
  const albums = readDir( true, artist );
  res.locals.albums = albums;
  next();
};

exports.isCD = ( req, res, next ) => {
  const { artist, album } = req.params;
  const cds = readDir( true, path.join( artist, album ) );
  if ( cds.length > 0 ) {
    res.locals.cds = cds;
  }
  next();
};

exports.getSongs = ( req, res, next ) => {
  const { artist, album, cd } = req.params;
  if ( cd ) {
    res.locals.songs = readDir( false, path.join( artist, album, cd ) );
    next();
  } else {
    res.locals.songs = readDir( false, path.join( artist, album ) );
    next();
  }
};
