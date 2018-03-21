const artistModel = require( '../../models/artistModel' );

describe( 'artistModel', () => {
  let count = 0;
  const client = {
    hgetall( hash, callback ) {
      callback( null, { artist1: 'artistName1', artist2: 'artistName2' } );
    },
    hget( hash, key, callback ) {
      callback( null, 'artistName1' );
    },
    hexists( hash, key, callback ) {
      callback( null, 1 );
    },
    hset() {
      count++;
    }
  };

  describe( '.hgetall()', () => {
    it( 'should get all the artist names in the hash', async () => {
      const artistNames = await artistModel.hgetall( client, [ 'artist1', 'artist2' ] );
      expect( artistNames ).to.eql( [ 'artistName1', 'artistName2' ] );
    } );

    it( 'should get the names but if it does not exist, return old name', async () => {
      client.hgetall = ( hash, callback ) => {
        callback( null, { artist1: 'artistName1' } );
      };

      const artistNames = await artistModel.hgetall( client, [ 'artist1', 'artist2' ] );
      expect( artistNames ).to.eql( [ 'artistName1', 'artist2' ] );
    } );
  } );

  describe( '.hget()', () => {
    it( 'should get the artist name from the hash', async () => {
      const artistName = await artistModel.hget( client, 'artist1' );
      expect( artistName ).to.eql( 'artistName1' );
    } );

    it( 'should return the same name if it is not in the hash', async () => {
      client.hget = ( hash, key, callback ) => {
        callback( null, null );
      };

      const artistName = await artistModel.hget( client, 'artist1' );
      expect( artistName ).to.eql( 'artist1' );
    } );
  } );

  describe( '.hset()', () => {
    it( 'should not set the artist name if it exists in the hash', () => {
      artistModel.hset( client, 'artist1' );
      expect( count ).to.eql( 0 );
    } );

    it( 'should set the artist name if it does not exist in the hash', () => {
      client.hexists = ( hash, key, callback ) => {
        callback( null, 0 );
      };
      artistModel.hset( client, 'artist1' );
      expect( count ).to.eql( 1 );
    } );
  } );
} );
