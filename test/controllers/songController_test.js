const songController = require( '../../controllers/songController' );

describe( 'songController', () => {
  const artist = 'artist';
  const album = 'album';
  const cd = 'cd';
  const songs = [ 'song1', 'song2' ];

  const musicbrainz = { artist: 'mbartist', album: 'mbalbum', date: 'date' };
  const coverart = { image: '1234', contentType: 'content' };

  const req = { params: { artist, album } };
  const res = { locals: { songs, musicbrainz, coverart } };

  const expected = {
    artist,
    album,
    songs,
    mbartist: musicbrainz.artist,
    mbalbum: musicbrainz.album,
    date: musicbrainz.date,
    image: coverart.image,
    contentType: coverart.contentType
  };

  describe( '.renderSongs()', () => {
    it( 'should call render and pass the data', () => {
      res.render = ( view, data ) => {
        expect( view ).to.eql( 'songs' );
        expect( data ).to.eql( expected );
      };

      songController.renderSongs( req, res );
    } );

    it( 'should call render and pass the data if cd is there as well', () => {
      req.params.cd = cd;
      expected.cd = cd;
      res.render = ( view, data ) => {
        expect( view ).to.eql( 'songs' );
        expect( data ).to.eql( expected );
      };

      songController.renderSongs( req, res );
    } );
  } );
} );
