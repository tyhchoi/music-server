const express = require( 'express' );
const musicController = require( '../controllers/musicController' );
const musicFiles = require( '../middleware/musicFiles' );

const router = express.Router();

router.get( '/', musicFiles.getArtists, musicController.renderArtists );
router.get( '/:artist', musicFiles.getAlbums, musicController.renderAlbums );
router.get( '/:artist/:album', musicFiles.isCD, musicController.renderCDs, musicFiles.getSongs, musicController.renderSongs );
router.get( '/:artist/:album/:cd', musicFiles.getSongs, musicController.renderSongs );

module.exports = router;
