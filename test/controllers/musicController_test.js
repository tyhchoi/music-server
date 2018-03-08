const proxyquire = require( 'proxyquire' );
const { expect } = require( 'chai' );

describe( 'musicController', () => {
  const musicFilesStub = {};
  const musicController = proxyquire( '../../controllers/musicController', { '../helpers/musicFiles': musicFilesStub } );
  const req = {};
  let res = {};

  beforeEach( () => {
    req.params = {};
    res = {
      locals: {},
      render( view, data ) {
        this.view = view;
        this.data = data;
      }
    };
    musicFilesStub.readDir = () => [ 'file1', 'file2', 'file3' ];
  } );

  describe( '.getArtists()', () => {
    it( 'should render the artists view and pass the data', () => {
      musicController.getArtists( req, res );

      expect( res.view ).to.eql( 'artists' );
      expect( res.data ).to.eql( { title: 'Artists', artists: [ 'file1', 'file2', 'file3' ] } );
    } );
  } );

  describe( '.getAlbums()', () => {
    it( 'should render the albums view and pass the data', () => {
      const data = { artist: 'artist' };
      req.params = data;

      musicController.getAlbums( req, res );

      expect( res.view ).to.eql( 'albums' );
      data.albums = [ 'file1', 'file2', 'file3' ];
      expect( res.data ).to.eql( data );
    } );
  } );

  describe( '.isCD()', () => {
    it( 'should render the cds view and pass the data when only directories are found', () => {
      const data = { artist: 'artist', album: 'album' };
      req.params = data;
      musicController.isCD( req, res );

      expect( res.view ).to.eql( 'cds' );
      data.cds = [ 'file1', 'file2', 'file3' ];
      expect( res.data ).to.eql( data );
    } );

    it( 'should pass to the next route if there are music files', () => {
      req.params = { artist: 'artist', album: 'album' };
      const songs = [ 'file1', 'file2', 'file3' ];
      musicFilesStub.readDir = dir => {
        if ( dir ) {
          return [];
        }
        return songs;
      };

      const next = () => {
        expect( res.locals.songs ).to.eql( songs );
      };

      musicController.isCD( req, res, next );
    } );
  } );

  describe( '.getSongs()', () => {
    it( 'should render the songs view and pass the data', () => {
      const data = { artist: 'artist', album: 'album' };
      req.params = data;
      res.locals.songs = [ 'file1', 'file2', 'file3' ];
      musicController.getSongs( req, res );

      expect( res.view ).to.eql( 'songs' );
      data.songs = res.locals.songs;
      expect( res.data ).to.eql( data );
    } );

    it( 'should also render the songs view and pass the data if there contains cd', () => {
      const data = { artist: 'artist', album: 'album', cd: 'cd' };
      req.params = data;
      musicController.getSongs( req, res );

      expect( res.view ).to.eql( 'songs' );
      data.songs = [ 'file1', 'file2', 'file3' ];
      expect( res.data ).to.eql( data );
    } );
  } );
} );
