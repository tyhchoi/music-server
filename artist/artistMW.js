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
  const { artistLink } = req.params;

  const artistName = await artistDB.hget( client, artistLink );

  res.locals.artist = { artistLink, artistName };

  next();
};

exports.setArtist = ( req, res, next ) => {
  const { client } = req.app.locals;
  const { artist } = req.params;
  const mbartist = res.locals.musicbrainz.artist;

  artistDB.hset( client, artist, mbartist );

  next();
};

exports.jsonArtists = ( req, res ) => {
  const { artists } = res.locals;
  res.json( { artists } );
};
