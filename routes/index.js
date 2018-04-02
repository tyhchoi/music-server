const express = require( 'express' );
const musicFiles = require( '../middleware/musicFiles' );
const metadata = require( '../middleware/metadata' );
const artistMW = require( '../artist/artistMW' );
const albumMW = require( '../album/albumMW' );
const songMW = require( '../song/songMW' );
const mbMW = require( '../musicbrainz/musicbrainzMW' );

const router = express.Router();

router.get(
  '/',
  musicFiles.getArtists,
  artistMW.getArtists,
  artistMW.renderArtists
);
router.get(
  '/:artist',
  musicFiles.getAlbums,
  artistMW.getArtist,
  albumMW.getAlbums,
  albumMW.renderAlbums
);
router.get(
  '/:artist/:album',
  musicFiles.getSongs,
  songMW.getSongs,
  mbMW.getMusicbrainzData,
  metadata.getMetadata,
  songMW.setSongs,
  mbMW.getAlbumData,
  mbMW.getCoverArt,
  mbMW.setMusicbrainzData,
  artistMW.setArtist,
  albumMW.setAlbum,
  songMW.renderSongs
);

module.exports = router;
