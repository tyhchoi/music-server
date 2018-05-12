const proxyquire = require( 'proxyquire' ).noPreserveCache();

describe( 'songMW', () => {
  const songDBStub = {};
  const songMW = proxyquire( './songMW', { './songDB': songDBStub } );

  const artist = 'artist';
  const album = 'album';
  const date = 'date';
  const albumList = [ '' ];
  const songLinks = [ { cd: 'cd1', songs: [ 'file1.flac', 'file2.flac' ] } ];
  const songNames = [ [ 'title1', 'title2' ] ];

  const songs = [
    {
      cd: 'cd1',
      songs: [
        {
          songLink: 'file1.flac',
          songName: 'title1'
        },
        {
          songLink: 'file2.flac',
          songName: 'title2'
        }
      ]
    }
  ];

  const musicbrainz = {
    artist,
    album,
    date,
    albumList
  };
  const coverart = { image: '1234', contentType: 'content' };

  const req = { app: { locals: { client: {} } }, params: { artist, album } };
  const res = { locals: {} };

  const expected = {
    artist,
    album,
    songs,
    musicbrainz,
    coverart
  };

  describe( '.getSongs()', () => {
    it( 'should get the song names', () => {
      songDBStub.hget = () => songNames;

      const next = () => {
        expect( res.locals.songNames ).to.eql( songNames );
      };

      songMW.getSongs( req, res, next );
    } );
  } );

  describe( '.setSongs()', () => {
    it( 'should set the song names', () => {
      let count = 0;
      songDBStub.hset = () => count++;

      const next = () => {
        expect( count ).to.eql( 1 );
      };

      songMW.setSongs( req, res, next );
    } );
  } );

  describe( '.jsonSongs()', () => {
    it( 'should send a json object of the data', () => {
      res.locals = {
        songLinks,
        songNames,
        musicbrainz,
        coverart
      };
      res.json = data => {
        expect( data ).to.eql( expected );
      };

      songMW.jsonSongs( req, res );
    } );
  } );
} );
