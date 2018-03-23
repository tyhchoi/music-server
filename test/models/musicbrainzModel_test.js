const mbModel = require( '../../models/musicbrainzModel' );

describe( 'musicbrainzModel', () => {
  let count = 0;
  const expected = { mb: 'one', ca: 'two' };
  const client = {
    hget( hash, key, callback ) {
      callback( null, JSON.stringify( expected ) );
    },
    hexists( hash, key, callback ) {
      callback( null, 1 );
    },
    hset() {
      count++;
    }
  };

  describe( '.hget()', () => {
    it( 'should get the musicbrainz data from the hash', async () => {
      const mbdata = await mbModel.hget( client, 'album', { mb: 'one' }, { ca: 'two' } );
      expect( mbdata ).to.eql( expected );
    } );

    it( 'should return the same name if it is not in the hash', async () => {
      client.hget = ( hash, key, callback ) => {
        callback( null, null );
      };

      const mbdata = await mbModel.hget( client, 'album', { mb: 'one' }, { ca: 'two' } );
      expect( mbdata ).to.eql( null );
    } );
  } );

  describe( '.hset()', () => {
    it( 'should not get the musicbrainz data if it exists in the hash', () => {
      mbModel.hset( client, 'album', {}, {} );
      expect( count ).to.eql( 0 );
    } );

    it( 'should set the musicbrainz data if it does not exist in the hash', () => {
      client.hexists = ( hash, key, callback ) => {
        callback( null, 0 );
      };
      mbModel.hset( client, 'album', {}, {} );
      expect( count ).to.eql( 1 );
    } );
  } );
} );
