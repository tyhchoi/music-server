const express = require( 'express' );
const musicFiles = require( '../middleware/musicFiles' );
const metadata = require( '../middleware/metadata' );
const musicbrainz = require( '../middleware/musicbrainz' );
const artistController = require( '../controllers/artistController' );
const albumController = require( '../controllers/albumController' );
const cdController = require( '../controllers/cdController' );
const songController = require( '../controllers/songController' );
const mbController = require( '../controllers/musicbrainzController' );

const router = express.Router();

router.get(
  '/',
  musicFiles.getArtists,
  artistController.getArtists,
  artistController.renderArtists
);
router.get(
  '/:artist',
  musicFiles.getAlbums,
  artistController.getArtist,
  albumController.getAlbums,
  albumController.renderAlbums
);
router.get(
  '/:artist/:album',
  musicFiles.isCD,
  cdController.renderCDs,
  musicFiles.getSongs,
  mbController.getMusicbrainzData,
  metadata.getMetadata,
  musicbrainz.getAlbumData,
  musicbrainz.getCoverArt,
  artistController.setArtist,
  albumController.setAlbum,
  mbController.setMusicbrainzData,
  songController.renderSongs
);
router.get(
  '/:artist/:album/:cd',
  musicFiles.getSongs,
  mbController.getMusicbrainzData,
  metadata.getMetadata,
  musicbrainz.getAlbumData,
  musicbrainz.getCoverArt,
  artistController.setArtist,
  albumController.setAlbum,
  mbController.setMusicbrainzData,
  songController.renderSongs
);

module.exports = router;
