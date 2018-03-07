const fs = require( 'fs' );
const path = require( 'path' );

const getFiles = ( directory, files = '' ) => {
  const musicDirectory = process.env.NODE_ENV === 'testing' ? 'music' : process.env.MUSIC_DIRECTORY;
  const dir = path.join( musicDirectory, files );

  if ( directory ) {
    return fs.readdirSync( dir ).filter( file => fs.lstatSync( path.join( dir, file ) ).isDirectory() );
  }
  return fs.readdirSync( dir ).filter( file => file.includes( '.flac' ) );
};

exports.getArtists = ( req, res ) => {
  const artists = getFiles( true );
  res.render( 'artists', { title: 'Artists', artists } );
};

exports.getAlbums = ( req, res ) => {
  const { artist } = req.params;
  const albums = getFiles( true, artist );
  res.render( 'albums', { artist, albums } );
};

exports.getSongs = ( req, res ) => {
  const { artist, album } = req.params;
  const songs = getFiles( false, path.join( artist, album ) );
  res.render( 'songs', { artist, album, songs } );
};
