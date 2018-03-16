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
      returned.common.musicbrainz_artistid = '1234';
      returned.common.musicbrainz_albumid = '5678';

      metadataStub.parseFile = () => Promise.resolve( returned );

      const next = () => {
        expect( res.locals.metadata ).to.eql( { artist: 'artist1', album: 'album1', date: 'date' } );
        expect( res.locals.musicbrainz ).to.eql( { artistID: '1234', albumID: '5678' } );
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
