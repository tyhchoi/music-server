const express = require( 'express' );
const musicController = require( '../controllers/musicController' );

const router = express.Router();

router.get( '/', musicController.getArtists );
router.get( '/:artist', musicController.getAlbums );
router.get( '/:artist/:album', musicController.isCD, musicController.getSongs );
router.get( '/:artist/:album/:cd', musicController.getSongs );

module.exports = router;
