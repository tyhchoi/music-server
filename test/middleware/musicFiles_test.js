const musicFiles = require( '../../middleware/musicFiles' );

describe( 'musicFiles', () => {
  const req = {};
  const res = {};

  beforeEach( () => {
    req.params = {};
    res.locals = {};
  } );

  describe( '.getArtists()', () => {
    it( 'should get the artists and call next', () => {
      const next = () => {
        expect( res.locals.artists ).to.eql( [ 'artist' ] );
      };
      musicFiles.getArtists( req, res, next );
    } );
  } );

  describe( '.getAlbums()', () => {
    it( 'should get the albums and call next', () => {
      req.params = { artist: 'artist' };
      const next = () => {
        expect( res.locals.albums ).to.eql( [ 'album1', 'album2' ] );
      };
      musicFiles.getAlbums( req, res, next );
    } );
  } );

  describe( '.isCD()', () => {
    it( 'should get the cds and call next', () => {
      req.params = { artist: 'artist', album: 'album2' };
      const next = () => {
        expect( res.locals.cds ).to.eql( [ 'cd1', 'cd2' ] );
      };
      musicFiles.isCD( req, res, next );
    } );

    it( 'should get nothing and call next', () => {
      req.params = { artist: 'artist', album: 'album1' };
      const next = () => {
        expect( res.locals ).to.eql( {} );
      };
      musicFiles.isCD( req, res, next );
    } );
  } );

  describe( '.getSongs()', () => {
    it( 'should get songs and call next', () => {
      req.params = { artist: 'artist', album: 'album1' };
      const next = () => {
        expect( res.locals.songs ).to.eql( [ 'file1.flac', 'file2.flac' ] );
      };
      musicFiles.getSongs( req, res, next );
    } );

    it( 'should get songs from cd and call next', () => {
      req.params = { artist: 'artist', album: 'album2', cd: 'cd1' };
      const next = () => {
        expect( res.locals.songs ).to.eql( [ 'file1.flac', 'file2.flac' ] );
      };
      musicFiles.getSongs( req, res, next );
    } );
  } );
} );
