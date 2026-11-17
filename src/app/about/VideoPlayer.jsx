import { useEffect, useRef, useState } from "react";

// import { getVideoType } from "./getVideoType";
import "./style.css";
import { getVideoType } from "@/utils/getVideoType";

// type VideoPlayerProps = {
//   src: string;
//   poster?: string;
//   title?: string;
// };

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const VideoPlayer = ({ src, poster, title = "Video player" }) => {
  const playerRef = useRef(null);
  const videoRef = useRef(null);
  const videoType = getVideoType(src);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasLoadError, setHasLoadError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.pause();
    video.load();

    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setHasLoadError(false);
  }, [src]);

  const togglePlay = async () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    try {
      if (video.paused) {
        await video.play();
      } else {
        video.pause();
      }
    } catch (error) {
      console.error("Unable to play video:", error);
    }
  };

  const seekBy = (seconds) => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const nextTime = Math.min(
      Math.max(video.currentTime + seconds, 0),
      video.duration || 0,
    );

    video.currentTime = nextTime;
  };

  const handleProgressChange = (event) => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const nextTime = Number(event.target.value);

    video.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const toggleMute = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVolumeChange = (event) => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const nextVolume = Number(event.target.value);

    video.volume = nextVolume;
    video.muted = nextVolume === 0;

    setVolume(nextVolume);
    setIsMuted(nextVolume === 0);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await playerRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Unable to change fullscreen mode:", error);
    }
  };

  const handleVideoClick = (event) => {
    event.stopPropagation();
    void togglePlay();
  };

  return (
    <div ref={playerRef} className="video-player">
      <video
        ref={videoRef}
        className="video-player__video"
        poster={poster}
        preload="metadata"
        playsInline
        aria-label={title}
        onClick={handleVideoClick}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(event) => {
          setCurrentTime(event.currentTarget.currentTime);
        }}
        onLoadedMetadata={(event) => {
          setDuration(event.currentTarget.duration);
          setVolume(event.currentTarget.volume);
        }}
        onVolumeChange={(event) => {
          setVolume(event.currentTarget.volume);
          setIsMuted(event.currentTarget.muted);
        }}
        onEnded={() => setIsPlaying(false)}
        onError={() => setHasLoadError(true)}
      >
        {videoType && <source src={src} type={videoType} />}
        Your browser does not support HTML video.
      </video>

      {!videoType && (
        <p role="alert">Unsupported video type.</p>
      )}
      {videoType && hasLoadError && (
        <p role="alert">Unable to load this video.</p>
      )}

      <div className="video-player__controls">
        <input
          className="video-player__progress"
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(currentTime, duration || 0)}
          onChange={handleProgressChange}
          aria-label="Video progress"
        />

        <div className="video-player__control-row">
          <div className="video-player__control-group">
            <button
              type="button"
              className="video-player__button"
              onClick={() => seekBy(-10)}
              aria-label="Rewind 10 seconds"
            >
              ↶ 10
            </button>

            <button
              type="button"
              className="video-player__button video-player__play-button"
              onClick={() => void togglePlay()}
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? "❚❚" : "▶"}
            </button>

            <button
              type="button"
              className="video-player__button"
              onClick={() => seekBy(10)}
              aria-label="Forward 10 seconds"
            >
              10 ↷
            </button>

            <span className="video-player__time">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="video-player__control-group">
            <button
              type="button"
              className="video-player__button"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted || volume === 0 ? "🔇" : "🔊"}
            </button>

            <input
              className="video-player__volume"
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              aria-label="Volume"
            />

            <button
              type="button"
              className="video-player__button"
              onClick={() => void toggleFullscreen()}
              aria-label="Toggle fullscreen"
            >
              ⛶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
