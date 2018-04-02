const proxyquire = require( 'proxyquire' ).noPreserveCache();

describe( 'songMW', () => {
  const songDBStub = {};
  const songMW = proxyquire( './songMW', { './songDB': songDBStub } );

  const artist = 'artist';
  const album = 'album';
  const date = 'date';
  const albumList = [ '' ];
  const songs = [ { cd: 'cd1', songs: [ 'file1.flac', 'file2.flac' ] } ];
  const songNames = [ [ 'title1', 'title2' ] ];

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
    albumList,
    songs,
    songNames,
    mbartist: artist,
    mbalbum: album,
    date,
    image: coverart.image,
    contentType: coverart.contentType
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

  describe( '.renderSongs()', () => {
    it( 'should call render and pass the data', () => {
      res.locals = {
        songs,
        songNames,
        musicbrainz,
        coverart
      };
      res.render = ( view, data ) => {
        expect( view ).to.eql( 'songs' );
        expect( data ).to.eql( expected );
      };

      songMW.renderSongs( req, res );
    } );
  } );
} );
