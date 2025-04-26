"use client";

import { uploadVideo } from "@/actions/actions";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export type AxiosErrorResponse = { error: string };

export default function HomePage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const uploadVideoMutation = useMutation({
    mutationFn: () => {
      if (!videoFile) throw new Error("No video selected");
      return uploadVideo(videoFile);
    },
    onSuccess: (data) => {
      toast.success("Video uploaded successfully!");
      console.log("Uploaded video response:", data);
      setVideoFile(null); // Clear selected file if you want
    },
    onError: (error: unknown) => {
      const err = error as AxiosErrorResponse;
      toast.error(err?.error || "Failed to upload video");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "video/mp4") {
      setVideoFile(file);
    } else {
      toast.error("Please upload a .mp4 video file only!");
    }
  };

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center p-4">
      <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
        Upload Video (.mp4)
        <input
          type="file"
          accept="video/mp4"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {videoFile && (
        <div className="mt-6">
          <video
            src={URL.createObjectURL(videoFile)}
            controls
            className="max-w-full h-auto rounded-lg shadow-md"
          />
        </div>
      )}

      <button
        onClick={() => uploadVideoMutation.mutate()}
        disabled={!videoFile || uploadVideoMutation.isPending}
        className={`mt-6 px-6 py-2 rounded-lg ${
          !videoFile || uploadVideoMutation.isPending
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        } text-white`}
      >
        {uploadVideoMutation.isPending ? "Uploading..." : "Upload Video"}
      </button>
    </main>
  );
}
