const proxyquire = require( 'proxyquire' ).noPreserveCache();

describe( 'albumController', () => {
  const albumModelStub = {};
  const albumController = proxyquire( '../../controllers/albumController', { '../models/albumModel.js': albumModelStub } );

  const albums = [ 'album1', 'album2' ];
  const albumNames = [ 'albumName1', 'albumName2' ];
  const artist = 'artist';
  const artistName = 'artistName';

  const req = { app: { locals: { client: {} } }, params: { artist } };
  const res = { locals: { albums, musicbrainz: {} } };

  describe( '.getAlbums()', () => {
    it( 'should get all the album names', () => {
      albumModelStub.hgetall = () => albumNames;

      const next = () => {
        expect( res.locals.albumNames ).to.eql( albumNames );
      };

      albumController.getAlbums( req, res, next );
    } );
  } );

  describe( '.setAlbum()', () => {
    it( 'should set the album name', () => {
      let count = 0;
      req.params.album = 'album';
      res.locals.musicbrainz.album = 'mbalbum';
      albumModelStub.hset = () => count++;

      const next = () => {
        expect( count ).to.eql( 1 );
      };

      albumController.setAlbum( req, res, next );
    } );
  } );

  describe( '.renderAlbums()', () => {
    it( 'should call render and pass the data', () => {
      res.locals.albumNames = albumNames;
      res.locals.artistName = artistName;
      res.render = ( view, data ) => {
        expect( view ).to.eql( 'albums' );
        expect( data ).to.eql( {
          artist,
          albums,
          albumNames,
          artistName
        } );
      };

      albumController.renderAlbums( req, res );
    } );
  } );
} );
