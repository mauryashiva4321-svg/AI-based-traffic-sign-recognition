import {
  useState
} from "react";

import type{
    ChangeEvent
} from "react";

import {
  Upload,
  ScanLine,
} from "lucide-react";

import {
  motion
} from "framer-motion";

import toast from "react-hot-toast";

import type{
  DetectionResponse
} from "../types/prediction";

import predictionService from "../services/predictionService";

export default function ImageDetection() {

  const [
    selectedFile,
    setSelectedFile
  ] = useState<File | null>(null);

  const [
    preview,
    setPreview
  ] = useState<string | null>(
    null
  );

  const [
    result,
    setResult
  ] = useState<DetectionResponse | null>(
    null
  );

  const [
    loading,
    setLoading
  ] = useState(false);


  function handleFileChange(

    event: ChangeEvent<HTMLInputElement>

  ) {

    const file =
      event.target.files?.[0];

    if (!file) {

      return;

    }

    if (!file.type.startsWith(
      "image/"
    )) {

      toast.error(
        "Please select an image file"
      );

      return;

    }

    setSelectedFile(
      file
    );

    setPreview(
      URL.createObjectURL(
        file
      )
    );

    setResult(
      null
    );

  }


  async function handlePrediction() {

    if (!selectedFile) {

      toast.error(
        "Please select an image first"
      );

      return;

    }

    try {

      setLoading(
        true
      );

      const prediction =
        await predictionService.predictImage(
          selectedFile
        );

      setResult(
        prediction
      );

      toast.success(
        "Traffic sign detected"
      );

    } catch (error: any) {

      toast.error(

        error?.response?.data?.detail ||

        "Prediction failed"

      );

    } finally {

      setLoading(
        false
      );

    }

  }


  return (

    <div
      className="
        mx-auto
        max-w-6xl
      "
    >

      <div>

        <h1
          className="
            text-3xl
            font-bold
          "
        >
          Image Detection
        </h1>

        <p
          className="
            mt-2
            text-slate-400
          "
        >
          Upload an image to identify
          traffic signs using AI.
        </p>

      </div>


      <div
        className="
          mt-8
          grid
          gap-6
          lg:grid-cols-2
        "
      >

        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="
            rounded-2xl
            border
            border-slate-800
            bg-slate-900
            p-6
          "
        >

          <label
            className="
              flex
              min-h-80
              cursor-pointer
              flex-col
              items-center
              justify-center
              rounded-xl
              border-2
              border-dashed
              border-slate-700
              transition
              hover:border-blue-500
            "
          >

            {preview ? (

              <img
                src={preview}
                alt="Selected traffic sign"
                className="
                  max-h-72
                  max-w-full
                  rounded-xl
                  object-contain
                "
              />

            ) : (

              <>

                <Upload
                  size={48}
                  className="
                    text-blue-400
                  "
                />

                <p
                  className="
                    mt-4
                    font-semibold
                  "
                >
                  Upload Traffic Sign Image
                </p>

                <p
                  className="
                    mt-2
                    text-sm
                    text-slate-500
                  "
                >
                  JPG, PNG or WEBP
                </p>

              </>

            )}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={
                handleFileChange
              }
            />

          </label>


          <button
            onClick={
              handlePrediction
            }
            disabled={
              !selectedFile ||
              loading
            }
            className="
              mt-6
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-blue-600
              px-6
              py-3
              font-semibold
              transition
              hover:bg-blue-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >

            <ScanLine
              size={20}
            />

            {loading
              ? "Analyzing..."
              : "Analyze Image"}

          </button>

        </motion.div>


        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.1
          }}
          className="
            rounded-2xl
            border
            border-slate-800
            bg-slate-900
            p-6
          "
        >

          <h2
            className="
              text-xl
              font-bold
            "
          >
            Detection Result
          </h2>


          {result && (

    <div className="mt-6 space-y-6">

        <div className="rounded-xl bg-blue-500/10 p-5">

            <p className="text-sm text-slate-400">
                Total Traffic Signs Detected
            </p>

            <h2 className="mt-2 text-3xl font-bold text-blue-400">
                {result.total_detections}
            </h2>

        </div>

        {result.total_detections === 0 && (

            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">

                <p className="text-red-300">

                    No traffic signs were detected.

                </p>

            </div>

        )}

        {result.detections.map((detection, index) => (

            <div
                key={index}
                className="rounded-xl border border-slate-800 bg-slate-900 p-5"
            >

                <div className="flex items-center justify-between">

                    <h2 className="text-2xl font-bold text-blue-400">

                        {detection.class_name}

                    </h2>

                    <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold">

                        #{index + 1}

                    </span>

                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">

                    <div className="rounded-lg bg-slate-800 p-4">

                        <p className="text-xs text-slate-400">

                            Detection Confidence

                        </p>

                        <p className="mt-2 text-xl font-bold text-green-400">

                            {(detection.detector_confidence * 100).toFixed(2)}%

                        </p>

                    </div>

                    <div className="rounded-lg bg-slate-800 p-4">

                        <p className="text-xs text-slate-400">

                            Classification Confidence

                        </p>

                        <p className="mt-2 text-xl font-bold text-blue-400">

                            {(detection.classification_confidence * 100).toFixed(2)}%

                        </p>

                    </div>

                </div>

                <div className="mt-6 rounded-xl border border-slate-800 p-4">

                    <h3 className="font-semibold">

                        Description

                    </h3>

                    <p className="mt-2 text-sm text-slate-400">

                        {detection.description}

                    </p>

                </div>

                <div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/5 p-4">

                    <h3 className="font-semibold text-green-400">

                        Recommended Driver Action

                    </h3>

                    <p className="mt-2 text-sm text-slate-300">

                        {detection.recommended_action}

                    </p>

                </div>

            </div>

        ))}

    </div>

)}

            <div
              className="
                flex
                min-h-80
                items-center
                justify-center
                text-center
                text-slate-500
              "
            >

              <div>

                <ScanLine
                  size={48}
                  className="
                    mx-auto
                    text-slate-700
                  "
                />

                <p
                  className="
                    mt-4
                  "
                >
                  Upload an image to see
                  detection results.
                </p>

              </div>

            </div>

          

        </motion.div>

      </div>

    </div>

  );

}