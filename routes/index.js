const express = require( 'express' );
const filesMW = require( '../middleware/files/filesMW' );
const metadataMW = require( '../middleware/metadata/metadataMW' );
const artistMW = require( '../artist/artistMW' );
const albumMW = require( '../album/albumMW' );
const songMW = require( '../song/songMW' );
const mbMW = require( '../middleware/musicbrainz/musicbrainzMW' );

const router = express.Router();

router.get(
  '/',
  filesMW.getArtists,
  artistMW.getArtists,
  artistMW.jsonArtists
);
router.get(
  '/:artist',
  filesMW.getAlbums,
  artistMW.getArtist,
  albumMW.getAlbums,
  albumMW.jsonAlbums
);
router.get(
  '/:artist/:album',
  filesMW.getSongs,
  songMW.getSongs,
  mbMW.getMusicbrainzData,
  metadataMW.getMetadata,
  songMW.setSongs,
  mbMW.getAlbumData,
  mbMW.getCoverArt,
  mbMW.setMusicbrainzData,
  artistMW.setArtist,
  albumMW.setAlbum,
  songMW.jsonSongs
);

module.exports = router;
