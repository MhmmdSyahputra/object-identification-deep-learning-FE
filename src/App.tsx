import React, { useState } from "react";
import { Accept, useDropzone } from "react-dropzone"; // Import react-dropzone
import "./App.css";
import {
  ApiResponseImage,
  ApiResponseVideo,
  DataResponse,
} from "./interface/object.interace";
import { uploadImage, uploadVideo } from "./services/detection.service";

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageResult, setImageResult] = useState<DataResponse | null>(null);
  const [videoResult, setVideoResult] = useState<DataResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    setIsLoading(true);
    setImageResult(null);
    setVideoResult(null);
    setError(null);

    try {
      const response: ApiResponseImage = await uploadImage(selectedFile);
      if (response.is_success) {
        setImageResult(response.data);
      } else {
        setError(
          response.error || "An error occurred during image detection."
        );
      }
    } catch (err) {
      console.error(err);
      setError("Failed to upload the image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    setIsLoading(true);
    setImageResult(null);
    setVideoResult(null);
    setError(null);

    try {
      const response: ApiResponseVideo = await uploadVideo(selectedFile);
      if (response.is_success) {
        setVideoResult(response.data.frames);
      } else {
        setError(
          response.error || "An error occurred during video detection."
        );
      }
    } catch (err) {
      console.error(err);
      setError("Failed to upload the video. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        const imageContainer = document.getElementById("image-container");
        if (imageContainer) {
          if (file.type.startsWith("image/")) {
            imageContainer.innerHTML = `<img src="${reader.result}" alt="Preview" style="max-width: 100%; border-radius: 20px;" />`;
          } else if (file.type.startsWith("video/")) {
            imageContainer.innerHTML = `<video controls style="max-width: 100%; border-radius: 20px;"><source src="${reader.result}" type="${file.type}" /></video>`;
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setImageResult(null);
    setVideoResult(null);
    setError(null);
    const imageContainer = document.getElementById("image-container");
    if (imageContainer) {
      imageContainer.innerHTML = ""; // Clear the image/video container
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: {
      "image/*": [".jpg", ".png", ".gif"], // Accept image files
      "video/*": [".mp4", ".avi", ".mov"], // Accept video files
    } as Accept,
  });

  return (
    <div className="container">
      <div className="header mb-5">
        <div className="display-6 text-center text-primary fw-bold poppins-semibold">
          OBJECT IDENTIFICATION
        </div>
        <div className="text-center text-gray fs-5">
          Upload an image or video to analyze objects in the media
        </div>
      </div>
      <div className="row g-5">
        <div className="col-12 col-md-5">
          <div className="card" style={{ borderRadius: 20 }}>
            <div className="card-body p-4">
              <h5 className="card-title text-center">Detection Results</h5>
              <hr />
              <div className="card-text py-auto pe-3" style={{ height: 320, overflowY: 'auto' }}>
                {isLoading ? (
                  <div className="text-center fs-5 text-gray mt-5">
                    Please wait, the model is loading...
                  </div>
                ) : error ? (
                  <div className="text-danger text-center mt-5">{error}</div>
                ) : imageResult ? (
                  <>
                    <div className="text-center fw-bold mt-5 display-6 text-uppercase">
                      <strong>{imageResult.entity}</strong>
                    </div>
                    <div className="text-center fw-bold mt-5 text-gray fs-4">
                      <div>Score: {imageResult.confidence_score}</div>
                    </div>
                  </>
                ) : videoResult ? (
                  <div className="text-center text-gray mt-3">
                    {videoResult.map((frame, index) => (
                      <div key={index}>
                        <div className="d-flex justify-content-between mb-3">
                          <div className="">
                          <div className="text-dark">Frame {index + 1}:</div>
                            <img src={frame.url} alt="" className="img-fluid" width={80}/>
                          </div>
                          <div className="text-end">
                            <div className="text-dark fw-bold fs-4 text-uppercase">{frame.entity} </div>
                            <div className="">Score: {frame.confidence_score}</div>
                          </div>
                        </div>
                        <hr />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center fs-5 text-gray mt-5">
                    No detection results.
                  </div>
                )}
              </div>
            </div>
          </div>
          {selectedFile && !isLoading && (
            <div className="row">
              <div className="col">
                <button
                  onClick={handleRemoveFile}
                  className="btn btn-danger w-100 py-3 fw-bold mt-3"
                >
                  REMOVE FILE
                </button>
              </div>
              <div className="col">
                {selectedFile.type.startsWith("image/") ? (
                  <button
                    onClick={handleImageUpload}
                    className="btn btn-primary w-100 py-3 fw-bold mt-3"
                  >
                    DETECT IMAGE
                  </button>
                ) : (
                  <button
                    onClick={handleVideoUpload}
                    className="btn btn-primary w-100 py-3 fw-bold mt-3"
                  >
                    DETECT VIDEO
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-7">
          <div className="card text-center" style={{ borderRadius: 20 }}>
            <div className="card-body p-4">
              <div id="image-container" className="m-0" />
              {!selectedFile && (
                <div id="content-upload">
                  <div
                    {...getRootProps()}
                    className="dropzone-container"
                    style={{ minHeight: 400 }}
                  >
                    <input {...getInputProps()} />
                    <div className="circle" id="upload-circle">
                      <i className="fa-regular fa-image" />
                    </div>
                    <p
                      className="card-text text-gray fw-medium"
                      style={{ fontSize: "1.2rem" }}
                    >
                      Drag and drop your image or video here <br />
                      or click to select a file
                    </p>
                    <p
                      className="card-text text-gray fw-medium"
                      style={{ fontSize: "1.2rem" }}
                    >
                      Supported: JPG, JPEG, PNG, MP4
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
