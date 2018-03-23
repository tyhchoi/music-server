const proxyquire = require( 'proxyquire' ).noPreserveCache();

describe( 'musicbrainzMW', () => {
  const mbDBStub = {};
  const mbMW = proxyquire( './musicbrainzMW', { './musicbrainzDB': mbDBStub } );

  const req = { app: { locals: { client: {} } }, params: { album: 'album' } };
  const res = { locals: {} };

  const musicbrainz = { artist: 'artist', album: 'album', date: 'date' };
  const coverart = { image: 'image' };
  const output = Object.assign( {}, musicbrainz, coverart );

  describe( '.getMusicbrainzData()', () => {
    it( 'should set gotData to false when null is returned', () => {
      mbDBStub.hget = () => null;

      const next = () => {
        expect( res.locals.gotData ).to.eql( false );
      };

      mbMW.getMusicbrainzData( req, res, next );
    } );

    it( 'should get the musicbrainz data', () => {
      mbDBStub.hget = () => output;

      const next = () => {
        expect( res.locals.musicbrainz ).to.eql( musicbrainz );
        expect( res.locals.coverart ).to.eql( coverart );
        expect( res.locals.gotData ).to.eql( true );
      };

      mbMW.getMusicbrainzData( req, res, next );
    } );
  } );

  describe( '.setMusicbrainzData()', () => {
    it( 'should set the musicbrainz data', () => {
      let count = 0;
      mbDBStub.hset = () => count++;

      const next = () => {
        expect( count ).to.eql( 1 );
      };

      mbMW.setMusicbrainzData( req, res, next );
    } );
  } );
} );
