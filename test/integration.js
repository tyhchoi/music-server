const supertest = require( 'supertest' );
const app = require( '../app' );

const request = supertest( app );

describe( 'Integration test for routes', () => {
  describe( 'GET /', () => {
    it( 'should successfully get /', done => {
      request
        .get( '/' )
        .expect( 'Content-Type', /html/ )
        .expect( 200 )
        .end( done );
    } );
  } );

  describe( 'GET /:artist', () => {
    it( 'should successfully get albums from artist', done => {
      request
        .get( '/artist' )
        .expect( 'Content-Type', /html/ )
        .expect( 200 )
        .end( done );
    } );
  } );

  describe( 'GET /:artist/:album', () => {
    it( 'should successfully get songs from album1 by artist', done => {
      request
        .get( '/artist/album1' )
        .expect( 'Content-Type', /html/ )
        .expect( 200 )
        .end( done );
    } );

    it( 'should successfully get cds from album2 by artist', done => {
      request
        .get( '/artist/album2' )
        .expect( 'Content-Type', /html/ )
        .expect( 200 )
        .end( done );
    } );
  } );

  describe( 'GET /:artist/:album/:cd', () => {
    it( 'should successfully get songs from cd1 of album2 by artist', done => {
      request
        .get( '/artist/album2/cd1' )
        .expect( 'Content-Type', /html/ )
        .expect( 200 )
        .end( done );
    } );
  } );

  describe( 'Error Handling', () => {
    it( 'should show a 404 error', done => {
      request
        .get( '/artist/album3' )
        .expect( 'Content-Type', /html/ )
        .expect( 404 )
        .end( done );
    } );
  } );
} );
