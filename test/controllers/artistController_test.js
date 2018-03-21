const proxyquire = require( 'proxyquire' ).noPreserveCache();

describe( 'artistController', () => {
  const artistModelStub = {};
  const artistController = proxyquire( '../../controllers/artistController', { '../models/artistModel.js': artistModelStub } );

  const artists = [ 'artist1', 'artist2' ];
  const artistNames = [ 'artistName1', 'artistName2' ];

  const req = { app: { locals: { client: {} } }, params: {} };
  const res = { locals: { artists, musicbrainz: {} } };

  beforeEach( () => {
    res.locals.artistNames = undefined;
  } );

  describe( '.getArtists()', () => {
    it( 'should get all the artist names', () => {
      artistModelStub.hgetall = () => artistNames;

      const next = () => {
        expect( res.locals.artistNames ).to.eql( artistNames );
      };

      artistController.getArtists( req, res, next );
    } );
  } );

  describe( '.getArtist()', () => {
    it( 'should get the artist name', () => {
      req.params.artist = 'artist';
      artistModelStub.hget = () => 'artistName';

      const next = () => {
        expect( res.locals.artistName ).to.eql( 'artistName' );
      };

      artistController.getArtist( req, res, next );
    } );
  } );

  describe( '.setArtist()', () => {
    it( 'should set the artist name', () => {
      let count = 0;
      req.params.artist = 'artist';
      res.locals.musicbrainz.artist = 'mbartist';
      artistModelStub.hset = () => count++;

      const next = () => {
        expect( count ).to.eql( 1 );
      };

      artistController.setArtist( req, res, next );
    } );
  } );

  describe( '.renderArtists()', () => {
    it( 'should call render and pass the data', () => {
      res.locals.artistNames = artistNames;
      res.render = ( view, data ) => {
        expect( view ).to.eql( 'artists' );
        expect( data ).to.eql( { artists, artistNames } );
      };

      artistController.renderArtists( req, res );
    } );
  } );
} );
