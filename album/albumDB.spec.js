const albumDB = require( './albumDB' );

describe( 'albumDB', () => {
  let count = 0;
  const client = {
    hgetall( hash, callback ) {
      callback( null, { album1: 'albumName1', album2: 'albumName2' } );
    },
    hexists( hash, key, callback ) {
      callback( null, 1 );
    },
    hset() {
      count++;
    }
  };

  describe( '.hgetall()', () => {
    it( 'should get all the album names in the hash', async () => {
      const albumNames = await albumDB.hgetall( client, 'artist', [ 'album1', 'album2' ] );
      expect( albumNames ).to.eql( [ 'albumName1', 'albumName2' ] );
    } );

    it( 'should get the names but if it does not exist, return old name', async () => {
      client.hgetall = ( hash, callback ) => {
        callback( null, { album1: 'albumName1' } );
      };

      const albumNames = await albumDB.hgetall( client, 'artist', [ 'album1', 'album2' ] );
      expect( albumNames ).to.eql( [ 'albumName1', 'album2' ] );
    } );
  } );

  describe( '.hset()', () => {
    it( 'should not set the album name if it exists in the hash', () => {
      albumDB.hset( client, 'artist', 'album1' );
      expect( count ).to.eql( 0 );
    } );

    it( 'should set the album name if it does not exist in the hash', () => {
      client.hexists = ( hash, key, callback ) => {
        callback( null, 0 );
      };
      albumDB.hset( client, 'artist', 'album1' );
      expect( count ).to.eql( 1 );
    } );
  } );
} );
