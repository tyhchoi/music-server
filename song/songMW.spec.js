const songMW = require( './songMW' );

describe( 'songMW', () => {
  const artist = 'artist';
  const album = 'album';
  const songs = [ { cd: 'cd1', songs: [ 'file1.flac', 'file2.flac' ] } ];
  const songNames = [ [ 'title1', 'title2' ] ];

  const musicbrainz = { artist: 'mbartist', album: 'mbalbum', date: 'date' };
  const coverart = { image: '1234', contentType: 'content' };

  const req = { params: { artist, album } };
  const res = { locals: { songs, songNames, musicbrainz, coverart } };

  const expected = {
    artist,
    album,
    songs,
    songNames,
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

      songMW.renderSongs( req, res );
    } );
  } );
} );
