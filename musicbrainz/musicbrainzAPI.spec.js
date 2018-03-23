const mbAPI = require( './musicbrainzAPI' );

describe( 'musicbrainzAPI', () => {
  describe( '.search()', () => {
    const artist = 'artist';
    const album = 'album';
    const returned = {
      releases: [ {
        'artist-credit': [ { artist: { name: 'artist' } } ],
        date: 'date',
        id: 'albumID',
        title: 'album'
      } ]
    };

    const nb = {
      search( string, obj, callback ) {
        callback( null, returned );
      }
    };

    it( 'should return the musicbrainz data', async () => {
      const expected = {
        artist: 'artist',
        album: 'album',
        albumID: 'albumID',
        date: 'date'
      };

      const output = await mbAPI.search( nb, artist, album );

      expect( output ).to.eql( expected );
    } );

    it( 'should return null if the search returned nothing', async () => {
      nb.search = ( string, obj, callback ) => {
        callback( null, { releases: [] } );
      };

      const output = await mbAPI.search( nb, artist, album );

      expect( output ).to.eql( null );
    } );

    it( 'should return null when there is an error', async () => {
      nb.search = ( string, obj, callback ) => {
        callback( 'Error', null );
      };

      const output = await mbAPI.search( nb, artist, album );

      expect( output ).to.eql( null );
    } );
  } );

  describe( '.getCoverArt()', () => {
    const albumID = 'albumID';

    const returned = {
      image: '1234',
      contentType: 'contentType'
    };

    const ca = {
      release( string, obj, callback ) {
        callback( null, returned );
      }
    };

    it( 'should return the coverart data', async () => {
      const expected = {
        image: Buffer.from( '1234', 'binary' ).toString( 'base64' ),
        contentType: 'contentType'
      };

      const output = await mbAPI.release( ca, albumID );

      expect( output ).to.eql( expected );
    } );

    it( 'should use the default image if coverart was not returned', async () => {
      ca.release = ( string, obj, callback ) => {
        callback( { statusCode: 404 }, null );
      };

      const output = await mbAPI.release( ca, albumID );

      expect( output ).to.eql( { image: '/images/default.png' } );
    } );
  } );
} );
