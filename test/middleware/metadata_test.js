const proxyquire = require( 'proxyquire' ).noPreserveCache();

describe( 'metadata', () => {
  const metadataStub = {};
  const metadata = proxyquire( '../../middleware/metadata', { 'music-metadata': metadataStub } );
  const req = {};
  const res = {
    locals: {}
  };

  describe( '.getMetadata()', () => {
    it( 'should get the metadata of the file', () => {
      metadataStub.parseFile = () => Promise.resolve( { common: { artist: 'artist1', album: 'album1' } } );
      req.params = { artist: 'artist', album: 'album' };
      res.locals.songs = [ 'song' ];

      const next = () => {
        expect( res.locals.metadata ).to.eql( { artist: 'artist1', album: 'album1' } );
      };

      metadata.getMetadata( req, res, next );
    } );
  } );
} );
