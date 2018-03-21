const { promisify } = require( 'util' );
const NB = require( 'nodebrainz' );
const CA = require( 'coverart' );

const userAgent = 'music-server/1.0.0 ( https://github.com/tyhchoi/music-server )';
const nb = new NB( { userAgent } );
const ca = new CA( { userAgent } );

exports.getAlbumData = async ( req, res, next ) => {
  const { artist, album } = res.locals.metadata;

  res.locals.musicbrainz = Object.assign( {}, res.locals.musicbrainz, res.locals.metadata );

  if ( res.locals.musicbrainz.albumID === undefined ) {
    const search = promisify( nb.search ).bind( nb );

    const returnedData = await search( 'release', { artist, release: album, status: 'Official' } )
      .then( data => data.releases[0] )
      .catch( err => next( err ) );

    if ( returnedData !== undefined ) {
      res.locals.musicbrainz = {
        artist: returnedData['artist-credit'][0].artist.name,
        album: returnedData.title,
        albumID: returnedData.id,
        date: returnedData.date
      };
    }
  }

  next();
};

exports.getCoverArt = async ( req, res, next ) => {
  const { albumID } = res.locals.musicbrainz;
  res.locals.coverart = {
    image: '/images/default.png'
  };

  if ( albumID !== undefined ) {
    const release = promisify( ca.release ).bind( ca );

    const returnedData = await release( albumID, { piece: 'front' } )
      .then( data => data )
      .catch( err => err );

    if ( returnedData.statusCode !== 404 ) {
      res.locals.coverart = {
        image: Buffer.from( returnedData.image, 'binary' ).toString( 'base64' ),
        contentType: returnedData.contentType
      };
    }
  }

  next();
};
