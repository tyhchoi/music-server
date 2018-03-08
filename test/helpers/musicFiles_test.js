const proxyquire = require( 'proxyquire' );

describe( 'musicController', () => {
  const fsStub = {};
  const musicFiles = proxyquire( '../../helpers/musicFiles', { fs: fsStub } );

  describe( '.readDir()', () => {
    it( 'should return all folders in the directory when checking for directories', () => {
      const files = [ 'dir1', 'dir2', 'dir3' ];
      fsStub.readdirSync = () => files;
      fsStub.lstatSync = () => ( {
        isDirectory: () => true
      } );
      const folders = musicFiles.readDir( true );
      expect( folders ).to.eql( files );
    } );

    it( 'should return empty when music files are found but checking for directories', () => {
      const files = [ 'file1.flac', 'file2.flac', 'file3.flac' ];
      fsStub.readdirSync = () => files;
      const music = musicFiles.readDir( true );
      expect( music ).to.eql( [] );
    } );

    it( 'should return all music files in the directory when checking for files', () => {
      const files = [ 'file1.flac', 'file2.flac', 'file3.flac' ];
      fsStub.readdirSync = () => files;
      const music = musicFiles.readDir( false );
      expect( music ).to.eql( files );
    } );
  } );
} );
