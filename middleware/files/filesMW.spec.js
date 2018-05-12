const filesMW = require( './filesMW' );

describe( 'filesMW', () => {
  const req = {};
  const res = {};

  beforeEach( () => {
    req.params = {};
    res.locals = {};
  } );

  describe( '.getArtists()', () => {
    it( 'should get the artists and call next', () => {
      const next = () => {
        expect( res.locals.artistLinks ).to.eql( [ 'artist' ] );
      };
      filesMW.getArtists( req, res, next );
    } );
  } );

  describe( '.getAlbums()', () => {
    it( 'should get the albums and call next', () => {
      req.params = { artist: 'artist' };
      const next = () => {
        expect( res.locals.albums ).to.eql( [ 'album1', 'album2', 'album3' ] );
      };
      filesMW.getAlbums( req, res, next );
    } );
  } );

  describe( '.getSongs()', () => {
    it( 'should get songs and call next', () => {
      req.params = { artist: 'artist', album: 'album1' };
      const next = () => {
        expect( res.locals.songs ).to.eql( [ { cd: null, songs: [ 'file1.flac', 'file2.flac' ] } ] );
      };
      filesMW.getSongs( req, res, next );
    } );

    it( 'should get songs from cd and call next', () => {
      req.params = { artist: 'artist', album: 'album2' };
      const next = () => {
        expect( res.locals.songs ).to.eql( [
          { cd: 'cd1', songs: [ 'file1.flac', 'file2.flac' ] },
          { cd: 'cd2', songs: [ 'file1.flac', 'file2.flac' ] }
        ] );
      };
      filesMW.getSongs( req, res, next );
    } );
  } );
} );
