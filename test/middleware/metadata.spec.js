const proxyquire = require( 'proxyquire' ).noPreserveCache();

describe( 'metadata', () => {
  const metadataStub = {};
  const metadata = proxyquire( '../../middleware/metadata', { 'music-metadata': metadataStub } );
  const req = {
    params: { artist: 'artist', album: 'album' }
  };
  const res = { locals: {} };
  const returned = {};

  const expectedSongNames = [ 'title', 'title' ];
  const expected = {
    artist: 'artist',
    album: 'album',
    date: 'date',
    albumList: [ '' ]
  };

  beforeEach( () => {
    returned.common = {
      artist: 'artist',
      album: 'album',
      date: 'date',
      title: 'title',
      musicbrainz_albumid: undefined
    };
    res.locals.metadata = undefined;
    res.locals.songs = [ { cd: null, songs: [ 'file1.flac', 'file2.flac' ] } ];
    res.locals.musicbrainz = undefined;
  } );

  describe( '.getMetadata()', () => {
    it( 'should get the metadata of the album', () => {
      metadataStub.parseFile = () => Promise.resolve( returned );

      const next = () => {
        expect( res.locals.songNames ).to.eql( [ expectedSongNames ] );
        expect( res.locals.metadata ).to.eql( expected );
        expect( res.locals.musicbrainz ).to.eql( undefined );
      };

      metadata.getMetadata( req, res, next );
    } );

    it( 'should get the musicbrainz info when it is provided', () => {
      returned.common.musicbrainz_albumid = '1234';

      const next = () => {
        expect( res.locals.songNames ).to.eql( [ expectedSongNames ] );
        expect( res.locals.metadata ).to.eql( expected );
        expect( res.locals.musicbrainz ).to.eql( { albumID: '1234' } );
      };

      metadata.getMetadata( req, res, next );
    } );

    it( 'should get the metadata of multi-cd albums', () => {
      metadataStub.parseFile = song => {
        if ( song.includes( 'cd1' ) ) {
          const newReturned = {
            common: {
              artist: 'artist',
              album: 'album (disc 1)',
              date: 'date',
              title: 'title',
              musicbrainz_albumid: undefined
            }
          };
          return Promise.resolve( newReturned );
        }
        returned.common.album = 'album (disc 2)';
        return Promise.resolve( returned );
      };
      res.locals.songs = [
        { cd: 'cd1', songs: [ 'file1.flac', 'file2.flac' ] },
        { cd: 'cd2', songs: [ 'file1.flac', 'file2.flac' ] }
      ];

      const next = () => {
        expected.albumList = [ '(disc 1)', '(disc 2)' ];

        expect( res.locals.songNames ).to.eql( [ expectedSongNames, expectedSongNames ] );
        expect( res.locals.metadata ).to.eql( expected );
        expect( res.locals.musicbrainz ).to.eql( undefined );
      };

      metadata.getMetadata( req, res, next );
    } );

    it( 'should return an error when there is an error', () => {
      metadataStub.parseFile = () => Promise.reject( new Error( 'Parsing Error' ) );

      const next = err => {
        expect( err.message ).to.eql( 'Parsing Error' );
        expect( res.locals.metadata ).to.eql( undefined );
        expect( res.locals.musicbrainz ).to.eql( undefined );
      };

      metadata.getMetadata( req, res, next );
    } );
  } );
} );
