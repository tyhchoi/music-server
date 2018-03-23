const proxyquire = require( 'proxyquire' ).noPreserveCache();

describe( 'artistMW', () => {
  const artistDBStub = {};
  const artistMW = proxyquire( './artistMW', { './artistDB': artistDBStub } );

  const artists = [ 'artist1', 'artist2' ];
  const artistNames = [ 'artistName1', 'artistName2' ];

  const req = { app: { locals: { client: {} } }, params: {} };
  const res = { locals: { artists, musicbrainz: {} } };

  beforeEach( () => {
    res.locals.artistNames = undefined;
  } );

  describe( '.getArtists()', () => {
    it( 'should get all the artist names', () => {
      artistDBStub.hgetall = () => artistNames;

      const next = () => {
        expect( res.locals.artistNames ).to.eql( artistNames );
      };

      artistMW.getArtists( req, res, next );
    } );
  } );

  describe( '.getArtist()', () => {
    it( 'should get the artist name', () => {
      req.params.artist = 'artist';
      artistDBStub.hget = () => 'artistName';

      const next = () => {
        expect( res.locals.artistName ).to.eql( 'artistName' );
      };

      artistMW.getArtist( req, res, next );
    } );
  } );

  describe( '.setArtist()', () => {
    it( 'should set the artist name', () => {
      let count = 0;
      req.params.artist = 'artist';
      res.locals.musicbrainz.artist = 'mbartist';
      artistDBStub.hset = () => count++;

      const next = () => {
        expect( count ).to.eql( 1 );
      };

      artistMW.setArtist( req, res, next );
    } );
  } );

  describe( '.renderArtists()', () => {
    it( 'should call render and pass the data', () => {
      res.locals.artistNames = artistNames;
      res.render = ( view, data ) => {
        expect( view ).to.eql( 'artists' );
        expect( data ).to.eql( { artists, artistNames } );
      };

      artistMW.renderArtists( req, res );
    } );
  } );
} );
