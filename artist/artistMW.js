const artistDB = require( './artistDB' );

exports.getArtists = async ( req, res, next ) => {
  const { client } = req.app.locals;
  const { artistLinks } = res.locals;

  const artistNames = await artistDB.hgetall( client, artistLinks );

  res.locals.artists = artistLinks.map( ( artistLink, i ) => ( { artistLink, artistName: artistNames[i] } ) );

  next();
};

exports.getArtist = async ( req, res, next ) => {
  const { client } = req.app.locals;
  const { artist } = req.params;

  const artistName = await artistDB.hget( client, artist );

  res.locals.artist = { artistLink: artist, artistName };

  next();
};

exports.setArtist = ( req, res, next ) => {
  const { client } = req.app.locals;
  const { artist } = req.params;
  const artistName = res.locals.musicbrainz.artist;

  artistDB.hset( client, artist, artistName );

  next();
};

exports.jsonArtists = ( req, res ) => {
  const { artists } = res.locals;
  res.json( { artists } );
};
