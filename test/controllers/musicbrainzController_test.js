const proxyquire = require( 'proxyquire' ).noPreserveCache();

describe( 'musicbrainzController', () => {
  const mbModelStub = {};
  const mbController = proxyquire( '../../controllers/musicbrainzController', { '../models/musicbrainzModel.js': mbModelStub } );

  const req = { app: { locals: { client: {} } }, params: { album: 'album' } };
  const res = { locals: {} };

  const musicbrainz = { artist: 'artist', album: 'album', date: 'date' };
  const coverart = { image: 'image' };
  const output = Object.assign( {}, musicbrainz, coverart );

  describe( '.getMusicbrainzData()', () => {
    it( 'should set gotData to false when null is returned', () => {
      mbModelStub.hget = () => null;

      const next = () => {
        expect( res.locals.gotData ).to.eql( false );
      };

      mbController.getMusicbrainzData( req, res, next );
    } );

    it( 'should get the musicbrainz data', () => {
      mbModelStub.hget = () => output;

      const next = () => {
        expect( res.locals.musicbrainz ).to.eql( musicbrainz );
        expect( res.locals.coverart ).to.eql( coverart );
        expect( res.locals.gotData ).to.eql( true );
      };

      mbController.getMusicbrainzData( req, res, next );
    } );
  } );

  describe( '.setMusicbrainzData()', () => {
    it( 'should set the musicbrainz data', () => {
      let count = 0;
      mbModelStub.hset = () => count++;

      const next = () => {
        expect( count ).to.eql( 1 );
      };

      mbController.setMusicbrainzData( req, res, next );
    } );
  } );
} );
