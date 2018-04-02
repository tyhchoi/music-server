$( document ).ready( () => {
  const audio = $( '#audio' )[0];
  const playlist = $( '#playlist' );
  const playlistLength = playlist.find( 'li a' ).length;
  let playlistIndex = 0;
  let playlistTrack = playlist.find( 'a' )[playlistIndex];

  $( playlistTrack ).parent().addClass( 'active' );

  const playTrack = ( track, player ) => {
    const nowPlaying = $( 'h3' );
    nowPlaying[0].innerText = `Now Playing - ${track[0].innerText}`;
    player.src = track.attr( 'href' );
    const parent = track.parent();
    parent.addClass( 'active' ).siblings().removeClass( 'active' );
    player.load();
    player.play();
  };

  const lastTrack = ( index, len, player, plist ) => {
    let trackNumber = len - 1;
    if ( index !== 0 ) {
      trackNumber = index - 1;
    }
    const track = plist.find( 'a' )[trackNumber];
    playTrack( $( track ), player );
    return [ track, trackNumber ];
  };

  const nextTrack = ( index, len, player, plist ) => {
    let trackNumber = 0;
    if ( index !== ( len - 1 ) ) {
      trackNumber = index + 1;
    }
    const track = plist.find( 'a' )[trackNumber];
    playTrack( $( track ), player );
    return [ track, trackNumber ];
  };

  playlist.on( 'click', 'a', function ( e ) {
    e.preventDefault();
    playlistTrack = $( this );
    playlistIndex = playlistTrack.parent().index();
    playTrack( playlistTrack, audio );
  } );

  audio.addEventListener( 'ended', () => {
    [ playlistTrack, playlistIndex ] = nextTrack( playlistIndex, playlistLength, audio, playlist );
  } );

  $( this ).keydown( e => {
    e.preventDefault();
    switch ( e.which ) {
      // spacebar
      case 32:
        if ( audio.paused ) {
          audio.play();
        } else {
          audio.pause();
        }
        break;
      // right arrow key
      case 37:
        if ( !e.shiftKey ) {
          audio.currentTime -= 5;
        } else if ( audio.currentTime < 1 ) {
          [ playlistTrack, playlistIndex ] = lastTrack( playlistIndex, playlistLength, audio, playlist );
        } else {
          audio.currentTime = 0;
        }
        break;
      // left arrow key
      case 39:
        if ( !e.shiftKey ) {
          audio.currentTime += 5;
        } else {
          [ playlistTrack, playlistIndex ] = nextTrack( playlistIndex, playlistLength, audio, playlist );
        }
        break;
      // up arrow key
      case 38:
        audio.volume = ( 1 - audio.volume ) < 0.05 ? 1 : audio.volume + 0.05;
        break;
      // down arrow key
      case 40:
        audio.volume = audio.volume < 0.05 ? 0 : audio.volume - 0.05;
        break;
      // l key
      case 76:
        audio.loop = !audio.loop;
        break;
      // m key
      case 77:
        audio.muted = !audio.muted;
        break;
      default:
        break;
    }
  } );
} );
