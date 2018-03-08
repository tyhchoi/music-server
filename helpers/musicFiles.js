const fs = require( 'fs' );
const path = require( 'path' );

exports.readDir = ( checkDir, subDirectory = '' ) => {
  const musicDirectory = process.env.NODE_ENV === 'test' ? 'music' : process.env.MUSIC_DIRECTORY;
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
