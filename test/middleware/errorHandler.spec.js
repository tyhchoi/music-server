const handleError = require( '../../middleware/errorHandler' );

describe( 'errorHandler', () => {
  describe( 'ENOENT error code', () => {
    it( 'should render the error view and pass the data when there is an error', () => {
      const err = {
        code: 'ENOENT'
      };

      const req = {
        url: 'one/two/three'
      };

      const res = {
        status: status => {
          expect( status ).to.eql( 404 );
        },
        render( view, data ) {
          expect( view ).to.eql( 'error' );
          expect( data ).to.eql( { path: 'one/two', file: 'three', code: 404 } );
        }
      };

      const next = {};

      handleError( err, req, res, next );
      req.url = 'one/two/three/';
      handleError( err, req, res, next );

      req.url = 'one';
      res.render = ( view, data ) => {
        expect( view ).to.eql( 'error' );
        expect( data ).to.eql( { path: '/', file: 'one', code: 404 } );
      };
      handleError( err, req, res, next );
    } );

    it( 'should call next when the error code is not ENOENT', () => {
      const err = {
        code: 'NO'
      };

      const next = error => {
        expect( error.code ).to.not.eql( 'ENOENT' );
      };

      handleError( err, {}, {}, next );
    } );
  } );
} );
