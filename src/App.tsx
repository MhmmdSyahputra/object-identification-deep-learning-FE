import React, { useState } from "react";
import { Accept, useDropzone } from "react-dropzone"; // Import react-dropzone
import { uploadImage, ApiResponse } from "./services/detection.service";
import "./App.css";

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Silakan pilih file terlebih dahulu.");
      return;
    }

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const response: ApiResponse = await uploadImage(selectedFile);
      if (response.is_success) {
        setResult(response.data);
      } else {
        setError(response.error || "Terjadi kesalahan saat mendeteksi objek.");
      }
    } catch (err) {
      console.error(err);
      setError("Gagal mengunggah gambar. Silakan coba lagi.");
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
    setResult(null);
    setError(null);
    const imageContainer = document.getElementById("image-container");
    if (imageContainer) {
      imageContainer.innerHTML = ""; // Clear the image/video container
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'image/*': ['.jpg', '.png', '.gif'],  // Accept image files
      'video/*': ['.mp4', '.avi', '.mov'], // Accept video files
    } as Accept, // Menggunakan tipe Accept dari react-dropzone
  });

  return (
    <div className="container">
      <div className="header mb-5">
        <div className="h1 text-center text-primary fw-bold">
          Sistem Deteksi Objek
        </div>
        <div className="text-center text-gray fs-5">
          Unggah gambar atau video untuk menganalisis objek pada media
        </div>
      </div>
      <div className="row g-5">
        <div className="col-12 col-md-5">
          <div className="card" style={{ borderRadius: 20 }}>
            <div className="card-body p-4">
              <h5 className="card-title text-center">Hasil Deteksi</h5>
              <hr />
              <div className="card-text py-auto" style={{ height: 200 }}>
                {isLoading ? (
                  <div className="text-center fs-5 text-gray mt-5">
                    Harap Tunggu, Model sedang dimuat...
                  </div>
                ) : error ? (
                  <div className="text-danger text-center mt-5">{error}</div>
                ) : result ? (
                  <div className="text-center fw-bold mt-5 display-4 text-uppercase">
                    <strong>{result}</strong>
                  </div>
                ) : (
                  <div className="text-center fs-5 text-gray mt-5">
                    Tidak ada hasil deteksi.
                  </div>
                )}
              </div>
            </div>
          </div>
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
                      Tarik dan lepas gambar atau video anda disini <br />
                      atau klik untuk memilih file
                    </p>
                    <p
                      className="card-text text-gray fw-medium"
                      style={{ fontSize: "1.2rem" }}
                    >
                      Mendukung: JPG, PNG, GIF, MP4, MOV, AVI
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          {selectedFile && !isLoading && (
            <div className="row">
              <div className="col">
                {selectedFile && (
                  <div className="d-flex justify-content-center">
                    <button
                      onClick={handleRemoveFile}
                      className="btn btn-danger w-100 py-3 fw-bold mt-3"
                    >
                      HAPUS FILE
                    </button>
                  </div>
                )}
              </div>
              <div className="col">
                <button
                  onClick={handleFileUpload}
                  className="btn btn-primary w-100 py-3 fw-bold mt-3"
                >
                  DETEKSI MEDIA
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
