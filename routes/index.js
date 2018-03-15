const express = require( 'express' );
const musicController = require( '../controllers/musicController' );
const musicFiles = require( '../middleware/musicFiles' );
const metadata = require( '../middleware/metadata' );

const router = express.Router();

if ( process.env.NODE_ENV === 'test' ) {
  router.get( '/', musicFiles.getArtists, musicController.renderArtists );
  router.get( '/:artist', musicFiles.getAlbums, musicController.renderAlbums );
  router.get( '/:artist/:album', musicFiles.isCD, musicController.renderCDs, musicFiles.getSongs, musicController.renderSongs );
  router.get( '/:artist/:album/:cd', musicFiles.getSongs, musicController.renderSongs );
} else {
  router.get( '/', musicFiles.getArtists, musicController.renderArtists );
  router.get( '/:artist', musicFiles.getAlbums, musicController.renderAlbums );
  router.get( '/:artist/:album', musicFiles.isCD, musicController.renderCDs, musicFiles.getSongs, metadata.getMetadata, musicController.renderSongs );
  router.get( '/:artist/:album/:cd', musicFiles.getSongs, metadata.getMetadata, musicController.renderSongs );
}

module.exports = router;
