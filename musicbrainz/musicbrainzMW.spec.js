const proxyquire = require( 'proxyquire' ).noPreserveCache();

describe( 'musicbrainzMW', () => {
  context( 'Database Calls', () => {
    const mbDBStub = {};
    const mbMW = proxyquire( './musicbrainzMW', { './musicbrainzDB': mbDBStub } );

    const req = { app: { locals: { client: {} } }, params: { album: 'album' } };
    const res = { locals: {} };

    const musicbrainz = {
      artist: 'artist',
      album: 'album',
      date: 'date',
      albumList: [ '' ]
    };
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

      it( 'should get the musicbrainz data and set gotData to true', () => {
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

  context( 'API Calls', () => {
    const nbExpected = {
      artist: 'artist',
      album: 'album',
      albumID: 'albumID',
      date: 'date'
    };

    const caExpected = {
      image: Buffer.from( '1234', 'binary' ).toString( 'base64' ),
      contentType: 'contentType'
    };

    const mbAPIStub = {
      search() {
        return nbExpected;
      },
      release() {
        return caExpected;
      }
    };

    const mbMW = proxyquire( './musicbrainzMW', { './musicbrainzAPI': mbAPIStub } );

    describe( '.getAlbumData()', () => {
      const req = {};
      const res = {
        locals: {
          metadata: {
            artist: 'artist',
            album: 'album',
            date: 'date',
            albumList: [ '' ]
          }
        }
      };

      beforeEach( () => {
        res.locals.musicbrainz = undefined;
      } );

      it( 'should return the musicbrainz data', () => {
        const next = () => {
          expect( res.locals.musicbrainz ).to.eql( nbExpected );
        };

        mbMW.getAlbumData( req, res, next );
      } );

      it( 'should skip the search if musicbrainz id already exists', () => {
        res.locals.musicbrainz = { albumID: 'albumID' };

        const next = () => {
          expect( res.locals.musicbrainz ).to.eql( nbExpected );
        };

        mbMW.getAlbumData( req, res, next );
      } );

      it( 'should use metadata values if the search returns null', () => {
        const nbExpectedNull = {
          artist: 'artist',
          album: 'album',
          date: 'date'
        };

        mbAPIStub.search = () => nbExpectedNull;

        const next = () => {
          expect( res.locals.musicbrainz ).to.eql( nbExpectedNull );
        };

        mbMW.getAlbumData( req, res, next );
      } );
    } );

    describe( '.getCoverArt()', () => {
      const req = {};
      const res = {
        locals: { musicbrainz: { albumID: 'albumID' } }
      };

      beforeEach( () => {
        res.locals.coverart = {};
      } );

      it( 'should return the coverart data', () => {
        const next = () => {
          expect( res.locals.coverart ).to.eql( caExpected );
        };

        mbMW.getCoverArt( req, res, next );
      } );

      it( 'should use the default image if albumID is not given', () => {
        res.locals.musicbrainz = {};

        const next = () => {
          expect( res.locals.coverart ).to.eql( { image: '/images/default.png' } );
        };

        mbMW.getCoverArt( req, res, next );
      } );
    } );
  } );
} );
