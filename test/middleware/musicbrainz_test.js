const proxyquire = require( 'proxyquire' ).noPreserveCache();

describe( 'musicbrainz', () => {
  describe( '.getAlbumArt()', () => {
    const req = {};
    const res = {
      locals: {
        metadata: {
          artist: 'metadata-artist',
          album: 'metadata-album',
          date: 'metadata-date'
        }
      }
    };
    const returned = {};

    class musicbrainzStub {
      constructor( string ) {
        this.string = string;
      }

      search( string, object, callback ) {
        this.string = string;
        this.object = object;
        callback( null, returned );
      }
    }

    const musicbrainz = proxyquire( '../../middleware/musicbrainz', { nodebrainz: musicbrainzStub } );

    beforeEach( () => {
      res.locals.musicbrainz = undefined;
      returned.releases = [ {
        title: 'musicbrainz-album',
        id: 'album-id',
        date: 'musicbrainz-date',
        'artist-credit': [ {
          artist: {
            name: 'musicbrainz-artist',
            id: 'artist-id'
          }
        }
        ]
      } ];
    } );

    it( 'should return the musicbrainz data', () => {
      const expected = {
        artist: 'musicbrainz-artist',
        artistID: 'artist-id',
        album: 'musicbrainz-album',
        albumID: 'album-id',
        date: 'musicbrainz-date'
      };

      const next = () => {
        expect( res.locals.musicbrainz ).to.eql( expected );
      };

      musicbrainz.getAlbumData( req, res, next );
    } );

    it( 'should skip the search if musicbrainz ids are already provided', () => {
      const expected = {
        artist: 'metadata-artist',
        artistID: 'artist-id',
        album: 'metadata-album',
        albumID: 'album-id',
        date: 'metadata-date'
      };
      res.locals.musicbrainz = { artistID: 'artist-id', albumID: 'album-id' };

      const next = () => {
        expect( res.locals.musicbrainz ).to.eql( expected );
      };

      musicbrainz.getAlbumData( req, res, next );
    } );

    it( 'should use metadata values if the search returns nothing', () => {
      const expected = {
        artist: 'metadata-artist',
        album: 'metadata-album',
        date: 'metadata-date'
      };
      returned.releases = [];

      const next = () => {
        expect( res.locals.musicbrainz ).to.eql( expected );
      };

      musicbrainz.getAlbumData( req, res, next );
    } );

    it( 'should return an error when there is an error', () => {
      musicbrainzStub.prototype.search = ( string, object, callback ) => {
        callback( new Error( 'Search Error' ), null );
      };

      const next = err => {
        expect( err.message ).to.eql( 'Search Error' );
      };

      musicbrainz.getAlbumData( req, res, next );
    } );
  } );

  describe( '.getCoverArt()', () => {
    const req = {};
    const res = {
      locals: {}
    };
    const returned = {
      image: '1234',
      contentType: 'content'
    };

    class coverartStub {
      constructor( string ) {
        this.string = string;
      }

      release( string, object, callback ) {
        this.string = string;
        this.object = object;
        callback( null, returned );
      }
    }

    const coverart = proxyquire( '../../middleware/musicbrainz', { coverart: coverartStub } );

    beforeEach( () => {
      res.locals.musicbrainz = { albumID: 'album-id' };
      res.locals.coverart = {};
    } );

    it( 'should return the coverart data', () => {
      const expected = {
        image: Buffer.from( '1234', 'binary' ).toString( 'base64' ),
        contentType: 'content'
      };

      const next = () => {
        expect( res.locals.coverart ).to.eql( expected );
      };

      coverart.getCoverArt( req, res, next );
    } );

    it( 'should use the default image if albumID is not given', () => {
      res.locals.musicbrainz = {};
      const next = () => {
        expect( res.locals.coverart ).to.eql( { image: '/images/default.png' } );
      };

      coverart.getCoverArt( req, res, next );
    } );

    it( 'should use the default image if coverart was not returned', () => {
      coverartStub.prototype.release = ( string, object, callback ) => {
        callback( { statusCode: 404 }, null );
      };

      const next = () => {
        expect( res.locals.coverart ).to.eql( { image: '/images/default.png' } );
      };

      coverart.getCoverArt( req, res, next );
    } );
  } );
} );
