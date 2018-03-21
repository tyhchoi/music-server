const artistModel = require( '../models/artistModel.js' );

exports.getArtists = async ( req, res, next ) => {
  const { client } = req.app.locals;
  const { artists } = res.locals;

  res.locals.artistNames = await artistModel.hgetall( client, artists );

  next();
};

exports.getArtist = async ( req, res, next ) => {
  const { client } = req.app.locals;
  const { artist } = req.params;

  res.locals.artistName = await artistModel.hget( client, artist );

  next();
};

exports.setArtist = ( req, res, next ) => {
  const { client } = req.app.locals;
  const { artist } = req.params;
  const mbartist = res.locals.musicbrainz.artist;

  artistModel.hset( client, artist, mbartist );

  next();
};

exports.renderArtists = ( req, res ) => {
  const { artists, artistNames } = res.locals;
  res.render( 'artists', { artists, artistNames } );
};
