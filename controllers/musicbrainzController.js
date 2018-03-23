const mbModel = require( '../models/musicbrainzModel.js' );

exports.getMusicbrainzData = async ( req, res, next ) => {
  const { client } = req.app.locals;
  const { album } = req.params;

  const mbdata = await mbModel.hget( client, album );

  if ( mbdata === null ) {
    res.locals.gotData = false;
  } else {
    res.locals.musicbrainz = {
      artist: mbdata.artist,
      album: mbdata.album,
      date: mbdata.date
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

  mbModel.hset( client, album, musicbrainz, coverart );

  next();
};
