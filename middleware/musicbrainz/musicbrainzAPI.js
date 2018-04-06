const { promisify } = require( 'util' );

exports.search = async ( nodebrainz, artist, album, albumID = '' ) => {
  const search = promisify( nodebrainz.search ).bind( nodebrainz );
  const release = promisify( nodebrainz.release ).bind( nodebrainz );

  let returnedData = null;

  if ( albumID === '' ) {
    returnedData = await search( 'release', { artist, release: album, status: 'Official' } )
      .then( data => data.releases[0] )
      .catch( err => undefined );
  } else {
    returnedData = await release( albumID, { inc: 'artists+release-groups' } )
      .then( data => data )
      .catch( err => undefined );
  }

  if ( returnedData !== undefined ) {
    return {
      artist: returnedData['artist-credit'][0].artist.name,
      album: returnedData.title,
      albumID: returnedData['release-group'].id,
      date: returnedData.date
    };
  }

  return null;
};

exports.releaseGroup = async ( coverart, albumID ) => {
  const defaultImage = {
    image: '/images/default.png'
  };

  const releaseGroup = promisify( coverart.releaseGroup ).bind( coverart );

  const returnedData = await releaseGroup( albumID, { piece: 'front' } )
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
