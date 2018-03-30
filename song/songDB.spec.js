const songDB = require( './songDB' );

describe( 'songDB', () => {
  let count = 0;
  const expected = [ { cd: null, songs: [ 'file1.flac', 'file2.flac' ] } ];
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
    it( 'should get the song data from the hash', async () => {
      const songs = await songDB.hget( client, 'album', expected );
      expect( songs ).to.eql( expected );
    } );

    it( 'should return null if it is not in the hash', async () => {
      client.hget = ( hash, key, callback ) => {
        callback( null, null );
      };

      const songs = await songDB.hget( client, 'album', expected );
      expect( songs ).to.eql( null );
    } );
  } );

  describe( '.hset()', () => {
    it( 'should not get the song data if it exists in the hash', () => {
      songDB.hset( client, 'album', [] );
      expect( count ).to.eql( 0 );
    } );

    it( 'should set the song data if it does not exist in the hash', () => {
      client.hexists = ( hash, key, callback ) => {
        callback( null, 0 );
      };
      songDB.hset( client, 'album', [] );
      expect( count ).to.eql( 1 );
    } );
  } );
} );
