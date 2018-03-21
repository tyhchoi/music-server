const cdController = require( '../../controllers/cdController' );

describe( 'cdController', () => {
  const artist = 'artist';
  const album = 'album';
  const cds = [ 'cd1', 'cd2' ];

  const req = { params: { artist, album } };
  const res = { locals: { cds } };

  describe( '.renderCDs()', () => {
    it( 'should call render and pass the data', () => {
      res.render = ( view, data ) => {
        expect( view ).to.eql( 'cds' );
        expect( data ).to.eql( {
          artist,
          album,
          cds
        } );
      };

      cdController.renderCDs( req, res );
    } );
  } );
} );
