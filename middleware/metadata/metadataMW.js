const path = require( 'path' );
const mm = require( 'music-metadata' );

const parseSongs = song => mm.parseFile( song, { skipCovers: true } )
  .then( data => {
    const metadata = data.common;
    return {
      name: metadata.title,
      artist: metadata.artist,
      album: metadata.album,
      albumID: metadata.musicbrainz_albumid,
      date: metadata.date
    };
  } )
  .catch( err => err );

const parseAlbum = ( songs, directory ) => {
  const parsedAlbum = songs.map( obj => {
    const parsedSongs = obj.songs.map( song => {
      let joinedPath = '';
      if ( obj.cd === null ) {
        joinedPath = path.join( directory, song );
      } else {
        joinedPath = path.join( directory, obj.cd, song );
      }

      return parseSongs( joinedPath );
    } );

    return Promise.all( parsedSongs );
  } );

  return Promise.all( parsedAlbum );
};

const commonAlbumName = array => {
  if ( array.length === 1 ) {
    return array[0];
  }

  const name1 = array[0].split( ' ' );
  const name2 = array[1].split( ' ' );

  let i = 0;
  let name = '';

  while ( true ) {
    if ( name1[i] === undefined ) {
      break;
    }

    if ( name1[i] === name2[i] ) {
      name += `${name1[i]} `;
    } else {
      break;
    }
    i++;
  }

  if ( name === '' ) {
    return array.join( ' / ' );
  }

  const exclude = [ '(Disc', '(disc', '[Disc', '[disc', 'Disc', 'disc', '(CD', '(cd', '[CD', '[cd', 'CD', 'cd' ];

  const piece = exclude.filter( ex => name.endsWith( `${ex} ` ) );

  return name.replace( piece[0], '' ).trim();
};

exports.getMetadata = async ( req, res, next ) => {
  if ( !res.locals.gotData ) {
    const musicDirectory = process.env.NODE_ENV === 'test' ? 'test/fixtures' : process.env.MUSIC_DIRECTORY;

    const { artist, album } = req.params;
    const { songs } = res.locals;

    const metadata = await parseAlbum( songs, path.join( musicDirectory, artist, album ) );

    const songObject = metadata[0][0];

    if ( songObject.message !== undefined ) {
      return next( songObject );
    }

    const albumNames = metadata.map( obj => obj[0].album );
    const common = commonAlbumName( albumNames );
    let albumList = albumNames.map( cd => cd.replace( common, '' ).trim() );

    let count = 0;
    if ( albumList.length !== 1 ) {
      albumList = albumList.map( name => {
        if ( name === '' ) {
          count++;
          return `(Disc 0${count})`;
        }
        return name;
      } );
    }

    res.locals.metadata = {
      artist: songObject.artist,
      album: common,
      albumList,
      date: songObject.date
    };

    res.locals.songNames = metadata.map( obj => obj.map( song => song.name ) );

    const { albumID } = songObject;

    if ( albumID !== undefined ) {
      res.locals.musicbrainz = { albumID };
    }
  }

  next();
};
