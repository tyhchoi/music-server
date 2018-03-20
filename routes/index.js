const express = require( 'express' );
const musicController = require( '../controllers/musicController' );
const musicFiles = require( '../middleware/musicFiles' );
const metadata = require( '../middleware/metadata' );
const musicbrainz = require( '../middleware/musicbrainz' );
const artistController = require( '../controllers/artistController' );
const albumController = require( '../controllers/albumController' );

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
  musicController.renderCDs,
  musicFiles.getSongs,
  metadata.getMetadata,
  musicbrainz.getAlbumData,
  musicbrainz.getCoverArt,
  artistController.setArtist,
  albumController.setAlbum,
  musicController.renderSongs
);
router.get(
  '/:artist/:album/:cd',
  musicFiles.getSongs,
  metadata.getMetadata,
  musicbrainz.getAlbumData,
  musicbrainz.getCoverArt,
  artistController.setArtist,
  albumController.setAlbum,
  musicController.renderSongs
);

module.exports = router;
