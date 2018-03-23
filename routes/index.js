const express = require( 'express' );
const musicFiles = require( '../middleware/musicFiles' );
const metadata = require( '../middleware/metadata' );
const musicbrainz = require( '../middleware/musicbrainz' );
const artistMW = require( '../artist/artistMW' );
const albumMW = require( '../album/albumMW' );
const cdMW = require( '../cd/cdMW' );
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
  musicFiles.isCD,
  cdMW.renderCDs,
  musicFiles.getSongs,
  mbMW.getMusicbrainzData,
  metadata.getMetadata,
  musicbrainz.getAlbumData,
  musicbrainz.getCoverArt,
  artistMW.setArtist,
  albumMW.setAlbum,
  mbMW.setMusicbrainzData,
  songMW.renderSongs
);
router.get(
  '/:artist/:album/:cd',
  musicFiles.getSongs,
  mbMW.getMusicbrainzData,
  metadata.getMetadata,
  musicbrainz.getAlbumData,
  musicbrainz.getCoverArt,
  artistMW.setArtist,
  albumMW.setAlbum,
  mbMW.setMusicbrainzData,
  songMW.renderSongs
);

module.exports = router;
