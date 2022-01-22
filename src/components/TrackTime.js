import React, {useState} from 'react';
import { useEffect } from 'react/cjs/react.development';

const TrackTime = ({audioPlayer, rangeSlider, setRangeSlider, isPlaying, isLoaded}) => {
    const [trackDuration, setTrackDuration] = useState("00:00");
    const [currentTrackTime, setCurrentTrackTime] = useState("00:00");
    const [nowTime, setNowTime] = useState(0); 

    function convertTime(time) {    
        var mins = Math.floor(time / 60);
        if (mins < 10) {
          mins = '0' + String(mins);
        }
        var secs = Math.floor(time % 60);
        if (secs < 10) {
          secs = '0' + String(secs);
        }
    
        return mins + ':' + secs;
    }

    useEffect(() => {
        if(isLoaded) {
            setTimeout(() => {
                const totalTime = audioPlayer.current.duration;
                const currentTime = (totalTime / 100);
                setNowTime(currentTime * rangeSlider);
        
                setCurrentTrackTime(convertTime(nowTime));
                setTrackDuration(convertTime(totalTime));
            }, 1000)
        }
 
    }, [rangeSlider, isLoaded])

    useEffect(() => {
        if(isPlaying) {
            setInterval(() => {
                const time = audioPlayer.current.currentTime;
                setCurrentTrackTime(convertTime(time));
            }, 500)
        }
    }, [isPlaying])
  return(
    <>
      <span className="current-track-time"><small>{currentTrackTime}</small></span>
      <span className="total-track-time">/<small>{trackDuration}</small></span>
    </>
  ) 
}

export default TrackTime;