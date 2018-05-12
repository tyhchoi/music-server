const proxyquire = require( 'proxyquire' ).noPreserveCache();

describe( 'albumMW', () => {
  const albumDBStub = {};
  const albumMW = proxyquire( './albumMW', { './albumDB': albumDBStub } );

  const albums = [ { albumLink: 'album1', albumName: 'albumName1' }, { albumLink: 'album2', albumName: 'albumName2' } ];
  const artist = { artistLink: 'artist', artistName: 'artistName' };

  const req = { app: { locals: { client: {} } }, params: { artist } };
  const res = { locals: { artist, albumLinks: [ 'album1', 'album2' ], musicbrainz: {} } };

  describe( '.getAlbums()', () => {
    it( 'should get all the album names', () => {
      albumDBStub.hgetall = () => [ 'albumName1', 'albumName2' ];

      const next = () => {
        expect( res.locals.albums ).to.eql( albums );
      };

      albumMW.getAlbums( req, res, next );
    } );
  } );

  describe( '.setAlbum()', () => {
    it( 'should set the album name', () => {
      let count = 0;
      req.params.album = 'album';
      res.locals.musicbrainz.album = 'albumName';
      albumDBStub.hset = () => count++;

      const next = () => {
        expect( count ).to.eql( 1 );
      };

      albumMW.setAlbum( req, res, next );
    } );
  } );

  describe( '.jsonAlbums()', () => {
    it( 'should send a json object of the data', () => {
      res.json = data => {
        expect( data ).to.eql( {
          artist,
          albums
        } );
      };

      albumMW.jsonAlbums( req, res );
    } );
  } );
} );
