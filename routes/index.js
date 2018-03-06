const express = require( 'express' );
const musicController = require( '../controllers/musicController' );

const router = express.Router();

router.get( '/', musicController.getArtists );
router.get( '/:artist', musicController.getAlbums );
router.get( '/:artist/:album', musicController.getSongs );

module.exports = router;
