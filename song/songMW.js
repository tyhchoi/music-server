const songDB = require( './songDB' );

exports.getSongs = async ( req, res, next ) => {
  const { client } = req.app.locals;
  const { album } = req.params;

  res.locals.songNames = await songDB.hget( client, album );

  next();
};

exports.setSongs = ( req, res, next ) => {
  const { client } = req.app.locals;
  const { album } = req.params;
  const { songNames } = res.locals;

  songDB.hset( client, album, songNames );

  next();
};

exports.jsonSongs = ( req, res ) => {
  const { artist, album } = req.params;
  const {
    songLinks, songNames, musicbrainz, coverart
  } = res.locals;

  const songs = songLinks.map( ( cd, i ) => {
    const songLinksZ = cd.songs.map( ( songLink, j ) => ( { songLink, songName: songNames[i][j] } ) );

    return { cd: cd.cd, songs: songLinksZ };
  } );

  const values = {
    artist, album, songs, musicbrainz, coverart
  };

  res.json( values );
};
