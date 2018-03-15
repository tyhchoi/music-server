const path = require( 'path' );
const mm = require( 'music-metadata' );

exports.getMetadata = async ( req, res, next ) => {
  const musicDirectory = process.env.NODE_ENV === 'test' ? 'test/fixtures' : process.env.MUSIC_DIRECTORY;

  const { artist, album, cd } = req.params;
  const song = res.locals.songs[0];
  let joinedPath = '';
  if ( cd ) {
    joinedPath = path.join( musicDirectory, artist, album, cd, song );
  } else {
    joinedPath = path.join( musicDirectory, artist, album, song );
  }

  const metadata = await mm.parseFile( joinedPath, { skipCovers: true } )
    .then( data => data.common )
    .catch( console.error );

  res.locals.metadata = {
    artist: metadata.artist,
    album: metadata.album
  };
  next();
};
