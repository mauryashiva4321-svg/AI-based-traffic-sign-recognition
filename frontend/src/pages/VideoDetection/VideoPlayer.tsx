import { useEffect, useRef, useState } from "react";

import {
  FiPlay,
  FiPause,
  FiVolume2,
  FiMaximize,
} from "react-icons/fi";

interface VideoPlayerProps {
  videoUrl: string;
}

export default function VideoPlayer({
  videoUrl,
}: VideoPlayerProps) {
  const videoRef =
    useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const loaded = () => {
      setDuration(video.duration);
    };

    const update = () => {
      setCurrentTime(video.currentTime);
    };

    const ended = () => {
      setIsPlaying(false);
    };

    video.addEventListener(
      "loadedmetadata",
      loaded
    );

    video.addEventListener(
      "timeupdate",
      update
    );

    video.addEventListener(
      "ended",
      ended
    );

    return () => {
      video.removeEventListener(
        "loadedmetadata",
        loaded
      );

      video.removeEventListener(
        "timeupdate",
        update
      );

      video.removeEventListener(
        "ended",
        ended
      );
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;

    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const fullscreen = () => {
    const video = videoRef.current;

    if (!video) return;

    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  const format = (time: number) => {
    if (!time) return "00:00";

    const minutes = Math.floor(
      time / 60
    );

    const seconds = Math.floor(
      time % 60
    );

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div
      className="
        mt-8
        overflow-hidden
        rounded-2xl
        border
        border-slate-800
        bg-slate-900
        shadow-lg
      "
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="
          w-full
          rounded-t-2xl
          bg-black
        "
      />

      <div
        className="
          flex
          items-center
          justify-between
          gap-4
          p-4
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <button
            onClick={togglePlay}
            className="
              rounded-lg
              bg-blue-600
              p-3
              transition
              hover:bg-blue-700
            "
          >
            {isPlaying ? (
              <FiPause size={20} />
            ) : (
              <FiPlay size={20} />
            )}
          </button>

          <button
            className="
              rounded-lg
              bg-slate-800
              p-3
            "
          >
            <FiVolume2 size={20} />
          </button>
        </div>

        <div
          className="
            flex-1
            px-5
          "
        >
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={(e) => {
              const video =
                videoRef.current;

              if (!video) return;

              video.currentTime =
                Number(
                  e.target.value
                );
            }}
            className="w-full"
          />

          <div
            className="
              mt-1
              flex
              justify-between
              text-xs
              text-slate-400
            "
          >
            <span>
              {format(currentTime)}
            </span>

            <span>
              {format(duration)}
            </span>
          </div>
        </div>

        <button
          onClick={fullscreen}
          className="
            rounded-lg
            bg-slate-800
            p-3
          "
        >
          <FiMaximize size={20} />
        </button>
      </div>
    </div>
  );
}