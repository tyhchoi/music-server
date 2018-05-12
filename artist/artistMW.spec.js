const proxyquire = require( 'proxyquire' ).noPreserveCache();

describe( 'artistMW', () => {
  const artistDBStub = {};
  const artistMW = proxyquire( './artistMW', { './artistDB': artistDBStub } );

  const artists = [ { artistLink: 'artist1', artistName: 'artistName1' }, { artistLink: 'artist2', artistName: 'artistName2' } ];

  const req = { app: { locals: { client: {} } }, params: {} };
  const res = { locals: { artistLinks: [ 'artist1', 'artist2' ], musicbrainz: {} } };

  beforeEach( () => {
    res.locals.artists = undefined;
  } );

  describe( '.getArtists()', () => {
    it( 'should get all the artist names', () => {
      artistDBStub.hgetall = () => [ 'artistName1', 'artistName2' ];

      const next = () => {
        expect( res.locals.artists ).to.eql( artists );
      };

      artistMW.getArtists( req, res, next );
    } );
  } );

  describe( '.getArtist()', () => {
    it( 'should get the artist name', () => {
      req.params.artist = 'artist';
      artistDBStub.hget = () => 'artistName';

      const next = () => {
        expect( res.locals.artist ).to.eql( { artistLink: 'artist', artistName: 'artistName' } );
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

  describe( '.jsonArtists()', () => {
    it( 'should send a json object of the data', () => {
      res.locals.artists = artists;
      res.json = data => {
        expect( data ).to.eql( { artists } );
      };

      artistMW.jsonArtists( req, res );
    } );
  } );
} );
