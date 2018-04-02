const NB = require( 'nodebrainz' );
const CA = require( 'coverart' );
const mbDB = require( './musicbrainzDB' );
const mbAPI = require( './musicbrainzAPI' );

const userAgent = 'music-server/1.0.0 ( https://github.com/tyhchoi/music-server )';
const nb = new NB( { userAgent } );
const ca = new CA( { userAgent } );

exports.getAlbumData = async ( req, res, next ) => {
  if ( !res.locals.gotData ) {
    const { artist, album, albumList } = res.locals.metadata;
    let returnedData = null;

    if ( res.locals.musicbrainz === undefined ) {
      returnedData = await mbAPI.search( nb, artist, album );
    }

    if ( returnedData === null ) {
      res.locals.musicbrainz = Object.assign( {}, res.locals.musicbrainz, res.locals.metadata );
    } else {
      res.locals.musicbrainz = returnedData;
      res.locals.musicbrainz.albumList = albumList;
    }
  }

  next();
};

exports.getCoverArt = async ( req, res, next ) => {
  if ( !res.locals.gotData ) {
    const { albumID } = res.locals.musicbrainz;

    res.locals.coverart = {
      image: '/images/default.png'
    };

    if ( albumID !== undefined ) {
      res.locals.coverart = await mbAPI.release( ca, albumID );
    }
  }

  next();
};

exports.getMusicbrainzData = async ( req, res, next ) => {
  const { client } = req.app.locals;
  const { album } = req.params;

  const mbdata = await mbDB.hget( client, album );

  if ( mbdata === null ) {
    res.locals.gotData = false;
  } else {
    res.locals.musicbrainz = {
      artist: mbdata.artist,
      album: mbdata.album,
      date: mbdata.date,
      albumList: mbdata.albumList
    };

    res.locals.coverart = {
      image: mbdata.image
    };

    if ( mbdata.contentType !== undefined ) {
      res.locals.coverart.contentType = mbdata.contentType;
    }

    res.locals.gotData = true;
  }

  next();
};

exports.setMusicbrainzData = ( req, res, next ) => {
  const { client } = req.app.locals;
  const { album } = req.params;
  const { musicbrainz, coverart } = res.locals;

  mbDB.hset( client, album, musicbrainz, coverart );

  next();
};
