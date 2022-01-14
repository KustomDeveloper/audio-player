import React, { useEffect, useState, useRef } from "react";
import previous from '../img/previous.svg';
import play from '../img/play.svg';
import pause from '../img/pause.svg';
import next from '../img/next.svg';
import SoundWave from './SoundWave';
import AlbumArt from './AlbumArt';


const AudioFiles = () => {
    const [audioTracks, setAudioTracks] = useState({});
    const [playlist, setPlaylist] = useState([]);
    const [audioSrc, setAudioSrc] = useState();
    const [songTitle, setSongTitle] = useState([]);
    const [item, setItem] = useState(0);
    const [isPlaying, setisPlaying] = useState(null);
    const audioPlayer = useRef(null);
    const author = "Julian Awad";
    const playlistArray = [];
    const songtitleArray = [];

    const firstTrack = playlist[0];

    async function checkStorage() {
        const data = await getTrackData();
        const trackNum = await getTrackNumber();

        if(data !== undefined) {
            setAudioSrc(data);
        }
        if(trackNum !== undefined) {
            setItem(trackNum);
        }
    }

    const storeData = async (key, value) => {
        try {
            localStorage.setItem(key, value)
        } catch (e) {
            console.log("Store Data Saving Error: (fn storeData) ", e);
        }
    }

    const getTrackData = async () => {
        try {
          const value = await localStorage.getItem('audio-src');
          if(value !== null) {
            return value;
          }
        } catch(e) {
          console.log("Get Data Error: (fn getTrackData)", e);
        }
    }
    const getTrackNumber = async () => {
        try {
          const value = await localStorage.getItem('track-number');
          if(value !== null) {
            return value;
          }
        } catch(e) {
          console.log("Get Data Error: (fn getTrackNumber) ", e);
        }
    }

    const playControl = (e) => {
        if(isPlaying === null || isPlaying === false) {
            audioPlayer.current.play();
            setisPlaying(true);
        } else {
            audioPlayer.current.pause();
            setisPlaying(false);
        }
    }

    const playPreviousControl = (e) => {
      const i = parseInt(item);

      if(i !== 0 ) {
        const prev = (i - 1);
        setAudioSrc(playlist[prev])
        setItem(prev);
        storeData('track-number', prev);
        storeData('audio-src', playlist[prev]);
        setisPlaying(true);

        audioPlayer.current.play();

      } else {
        const prev = 0;
        setAudioSrc(playlist[prev])
        setItem(prev);
        storeData('track-number', prev);
        storeData('audio-src', playlist[prev]);
        setisPlaying(true);

        audioPlayer.current.play();
      }
    }

    const playNextControl = (e) => {
      const i = parseInt(item);
      const totalTracks = parseInt(playlist.length - 1);

      if(i < 9 ) {
        const next = (i + 1);
        setAudioSrc(playlist[next])
        setItem(next);
        storeData('track-number', next);
        storeData('audio-src', playlist[next]);
        setisPlaying(true);

        audioPlayer.current.play();

      } else {
        const next = 0;
        setAudioSrc(playlist[next])
        setItem(next);
        storeData('track-number', next);
        storeData('audio-src', playlist[next]);
        setisPlaying(true);

        audioPlayer.current.play();
      }
    }

    const playTrack = (e) => {
      const src = e.target.getAttribute("data-src");
      console.log(src)
      const i = parseInt(e.target.getAttribute("data-item"));

      setItem(i);
      setAudioSrc(src);
      storeData('audio-src', src);
      storeData('track-number', i);
      setisPlaying(true);
      
      audioPlayer.current.play();
    }

    const continuousPlay = () => {
        console.log("Audio track has ended")
        const count = playlist.length

        if(item < count - 1) {
            let currentItem = parseInt(item);
            let itemNum = Number(currentItem + 1);

            setItem(itemNum);
            setAudioSrc(playlist[itemNum]);
            storeData('track-number', itemNum);
            storeData('audio-src', playlist[itemNum]);

            audioPlayer.current.play();
        } else {
            setItem(0);
        }

    }
    
    async function getAudioTracks() {
        await fetch('https://cominghomeministries.net/wp-json/wp/v2/audio')
         .then(response => response.json())
         .then(data => {
            setAudioTracks(data);

            data.forEach((item) => {
                playlistArray.push(item.cloud_url);
                songtitleArray.push(item.title.rendered);
            })

            setPlaylist(playlistArray);
            setSongTitle(songtitleArray);
         }) 
    }
    
    useEffect(() => {
        getAudioTracks();
    }, [])

    useEffect(() => {
       checkStorage();
    }, [])

    return(
        <React.Fragment>
            <div className="album-art-lg">{<AlbumArt />}</div>
            
            <div className="song-title">{ songTitle ? songTitle[item] : null } <span className="author">{author}</span></div>

            <div className="player-controls"><img onClick={ e => playPreviousControl(e) } src={previous} /> <img onClick={ e => playControl(e) } src={isPlaying === null || isPlaying === false ? play : pause} /> <img onClick={ e => playNextControl(e) } src={next} /></div>

            <div class="slidecontainer">
              <input type="range" min="1" max="100" value="50" class="slider" id="myRange" />
            </div>

            <audio onEnded={continuousPlay} ref={audioPlayer} src={audioSrc ? audioSrc : firstTrack} controls autoPlay />

            <div className="full-playlist">
              <ul>
              {Object.keys(audioTracks).map((key, i) => {
                  return(
                      <li className="listItem">
                        <span className="album-art">{<AlbumArt />}</span>
                        <span key={i} data-item={i} data-src={audioTracks[key].cloud_url} onClick={e => playTrack(e)} className="track-title">{audioTracks[key].title.rendered}
                        </span> 
                        <span className="wave-container">{item == i ? <SoundWave /> : null}</span> 
                        <span className="author">{author}</span>
                      </li>
                  )
              })}
              </ul>
            </div>
        </React.Fragment>
    )
}

export default AudioFiles