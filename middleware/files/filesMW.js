const fs = require( 'fs' );
const path = require( 'path' );

const readDir = ( mainDirectory, subDirectory = '' ) => {
  const joinedPath = path.join( mainDirectory, subDirectory );
  const files = fs.readdirSync( joinedPath );
  return files.filter( file => {
    const fstat = fs.lstatSync( path.join( joinedPath, file ) );
    return fstat.isDirectory() || fstat.isSymbolicLink();
  } );
};

const readSongs = ( mainDirectory, subDirectory, ext ) => {
  const joinedPath = path.join( mainDirectory, subDirectory );
  const files = fs.readdirSync( joinedPath );

  const songs = files.filter( file => ext === path.extname( file ) );
  const subdir = readDir( mainDirectory, subDirectory );

  if ( songs.length === 0 ) {
    const output = subdir.map( dir => {
      const cd = path.join( joinedPath, dir );
      const cdFiles = fs.readdirSync( cd );

      const cdSongs = cdFiles.filter( file => ext === path.extname( file ) );

      return { cd: dir, songs: cdSongs };
    } );

    return output.filter( obj => obj.songs.length !== 0 );
  }

  return [ { cd: null, songs } ];
};

const musicDirectory = process.env.NODE_ENV === 'test' ? 'test/fixtures' : process.env.MUSIC_DIRECTORY;
const fileType = process.env.NODE_ENV === 'test' ? '.flac' : process.env.FILE_TYPE;

exports.getArtists = ( req, res, next ) => {
  const artists = readDir( musicDirectory );
  res.locals.artists = artists;
  next();
};

exports.getAlbums = ( req, res, next ) => {
  const { artist } = req.params;
  const albums = readDir( musicDirectory, artist );
  res.locals.albums = albums;
  next();
};

exports.getSongs = ( req, res, next ) => {
  const { artist, album } = req.params;
  res.locals.songs = readSongs( musicDirectory, path.join( artist, album ), fileType );
  next();
};
