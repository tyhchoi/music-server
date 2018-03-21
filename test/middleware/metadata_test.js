const proxyquire = require( 'proxyquire' ).noPreserveCache();

describe( 'metadata', () => {
  const metadataStub = {};
  const metadata = proxyquire( '../../middleware/metadata', { 'music-metadata': metadataStub } );
  const req = {
    params: { artist: 'artist', album: 'album' }
  };
  const res = {};
  const returned = {};

  beforeEach( () => {
    returned.common = { artist: 'artist1', album: 'album1', date: 'date' };
    res.locals = { songs: [ 'song' ] };
  } );

  describe( '.getMetadata()', () => {
    it( 'should get the metadata of the file', () => {
      metadataStub.parseFile = () => Promise.resolve( returned );

      const next = () => {
        expect( res.locals.metadata ).to.eql( { artist: 'artist1', album: 'album1', date: 'date' } );
        expect( res.locals.musicbrainz ).to.eql( undefined );
      };

      metadata.getMetadata( req, res, next );
    } );

    it( 'should get the musicbrainz info when it is provided', () => {
      returned.common.musicbrainz_albumid = '1234';

      metadataStub.parseFile = () => Promise.resolve( returned );

      const next = () => {
        expect( res.locals.metadata ).to.eql( { artist: 'artist1', album: 'album1', date: 'date' } );
        expect( res.locals.musicbrainz ).to.eql( { albumID: '1234' } );
      };

      metadata.getMetadata( req, res, next );
    } );

    it( 'should return an error when there is an error', () => {
      metadataStub.parseFile = () => Promise.reject( new Error( 'Parsing Error' ) );

      const next = err => {
        expect( err.message ).to.eql( 'Parsing Error' );
        expect( res.locals.metadata ).to.eql( undefined );
        expect( res.locals.musicbrainz ).to.eql( undefined );
      };

      metadata.getMetadata( req, res, next );
    } );
  } );
} );
