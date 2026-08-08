import type { ChangeEvent, RefObject } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { motion } from "framer-motion";

interface Props {
  inputRef: RefObject<HTMLInputElement | null>;
  onBrowse: () => void;
  onSelect: (file: File) => void;
}

const MAX_SIZE = 200 * 1024 * 1024; // 200 MB

const ALLOWED_TYPES = [
  "video/mp4",
  "video/x-msvideo",
  "video/quicktime",
  "video/x-matroska",
];

export default function VideoUploader({
  inputRef,
  onBrowse,
  onSelect,
}: Props) {
  const validateFile = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("Only MP4, AVI, MOV and MKV videos are allowed.");
      return false;
    }

    if (file.size > MAX_SIZE) {
      alert("Video size must be less than 200 MB.");
      return false;
    }

    return true;
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!validateFile(file)) return;

    onSelect(file);
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();

    const file = event.dataTransfer.files[0];

    if (!file) return;

    if (!validateFile(file)) return;

    onSelect(file);
  };

  return (
    <>
      <input
        ref={inputRef}
        hidden
        type="file"
        accept="video/*"
        onChange={handleChange}
      />

      <motion.div
        whileHover={{
          scale: 1.01,
        }}
        whileTap={{
          scale: 0.99,
        }}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="
          cursor-pointer
          rounded-2xl
          border-2
          border-dashed
          border-slate-700
          bg-slate-900
          p-14
          text-center
          transition
          hover:border-blue-500
        "
        onClick={onBrowse}
      >
        <FiUploadCloud
          className="
            mx-auto
            text-6xl
            text-blue-400
          "
        />

        <h2
          className="
            mt-5
            text-2xl
            font-bold
          "
        >
          Upload Traffic Video
        </h2>

        <p
          className="
            mt-3
            text-slate-400
          "
        >
          Drag & Drop your video here
        </p>

        <p
          className="
            mt-2
            text-slate-500
            text-sm
          "
        >
          Supported:
          MP4 • AVI • MOV • MKV
        </p>

        <button
          type="button"
          className="
            mt-8
            rounded-xl
            bg-blue-600
            px-8
            py-3
            font-semibold
            transition
            hover:bg-blue-700
          "
        >
          Browse Video
        </button>
      </motion.div>
    </>
  );
}