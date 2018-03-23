const { promisify } = require( 'util' );

exports.search = async ( nodebrainz, artist, album ) => {
  const search = promisify( nodebrainz.search ).bind( nodebrainz );

  const returnedData = await search( 'release', { artist, release: album, status: 'Official' } )
    .then( data => data.releases[0] )
    .catch( err => {
      console.log( err );
      return undefined;
    } );

  if ( returnedData !== undefined ) {
    return {
      artist: returnedData['artist-credit'][0].artist.name,
      album: returnedData.title,
      albumID: returnedData.id,
      date: returnedData.date
    };
  }

  return null;
};

exports.release = async ( coverart, albumID ) => {
  const defaultImage = {
    image: '/images/default.png'
  };

  const release = promisify( coverart.release ).bind( coverart );

  const returnedData = await release( albumID, { piece: 'front' } )
    .then( data => data )
    .catch( err => err );

  if ( returnedData.statusCode !== 404 ) {
    return {
      image: Buffer.from( returnedData.image, 'binary' ).toString( 'base64' ),
      contentType: returnedData.contentType
    };
  }

  return defaultImage;
};
