import {
  useEffect,
  useRef,
} from "react";

interface WebcamCanvasProps {
  running: boolean;
  onFrame: (frame: string) => void;
}

const FRAME_INTERVAL = 150; // ms (~6-7 FPS)

export default function WebcamCanvas({
  running,
  onFrame,
}: WebcamCanvasProps) {
  const videoRef =
    useRef<HTMLVideoElement>(null);

  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  const streamRef =
    useRef<MediaStream | null>(null);

  const intervalRef =
    useRef<number | null>(null);

  //----------------------------------------------------
  // START CAMERA
  //----------------------------------------------------

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: {
              width: 1280,
              height: 720,
              facingMode: "environment",
            },
            audio: false,
          });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          await videoRef.current.play();
        }
      } catch (error) {
        console.error(error);
      }
    };

    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  //----------------------------------------------------
  // START STREAMING
  //----------------------------------------------------

  useEffect(() => {
    if (!running) {
      stopCapture();
      return;
    }

    startCapture();

    return () => stopCapture();
  }, [running]);

  //----------------------------------------------------
  // CAPTURE LOOP
  //----------------------------------------------------

  const startCapture = () => {
    if (intervalRef.current) return;

    intervalRef.current = window.setInterval(() => {
      captureFrame();
    }, FRAME_INTERVAL);
  };

  //----------------------------------------------------
  // STOP LOOP
  //----------------------------------------------------

  const stopCapture = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);

      intervalRef.current = null;
    }
  };

  //----------------------------------------------------
  // STOP CAMERA
  //----------------------------------------------------

  const stopCamera = () => {
    stopCapture();

    streamRef.current
      ?.getTracks()
      .forEach((track) => track.stop());
  };

  //----------------------------------------------------
  // CAPTURE FRAME
  //----------------------------------------------------

  const captureFrame = () => {
    const video =
      videoRef.current;

    const canvas =
      canvasRef.current;

    if (!video || !canvas) return;

    if (video.readyState < 2) return;

    canvas.width =
      video.videoWidth;

    canvas.height =
      video.videoHeight;

    const context =
      canvas.getContext("2d");

    if (!context) return;

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const image =
      canvas.toDataURL(
        "image/jpeg",
        0.8
      );

    onFrame(image);
  };

  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-800
        bg-slate-900
        shadow-xl
      "
    >
      <div
        className="
          border-b
          border-slate-800
          p-4
        "
      >
        <h2
          className="
            text-xl
            font-bold
          "
        >
          Live Camera
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-slate-400
          "
        >
          Webcam feed used for
          real-time traffic sign
          detection.
        </p>
      </div>

      <div
        className="
          relative
          aspect-video
          bg-black
        "
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="
            h-full
            w-full
            object-cover
          "
        />

        <canvas
          ref={canvasRef}
          className="hidden"
        />

        {running && (
          <div
            className="
              absolute
              left-4
              top-4
              flex
              items-center
              gap-2
              rounded-full
              bg-red-600
              px-4
              py-2
              text-sm
              font-semibold
            "
          >
            <span
              className="
                h-2
                w-2
                animate-pulse
                rounded-full
                bg-white
              "
            />

            LIVE
          </div>
        )}
      </div>
    </div>
  );
}