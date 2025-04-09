"use client";

import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { load as cocoSSDLoad } from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';
import { renderPrediction } from '../utils/render-prediction'; // Custom drawing + alert logic

// Webcam ke liye video constraints define kiye
const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

const ObjectDetection = () => {
  const webcamRef = useRef(null);      // webcam ref
  const canvasRef = useRef(null);      // canvas ref
  const audioRef = useRef(null);       // audio ref for alert.mp3

  const [capturedImage, setCapturedImage] = useState(null); // screenshot state
  const [isLoading, setIsLoading] = useState(true);         // model loading state

  useEffect(() => {
    const runObjectDetection = async () => {
      // coco-ssd model load karo
      const net = await cocoSSDLoad();
      setIsLoading(false); // model load hone ke baad loading hata do

      // Detect function — baar baar chalne wala loop
      const detect = async () => {
        if (
          webcamRef.current &&
          webcamRef.current.video.readyState === 4 &&
          canvasRef.current
        ) {
          const video = webcamRef.current.video;

          const videoWidth = video.videoWidth;
          const videoHeight = video.videoHeight;

          // canvas size ko webcam ke size ke equal rakho
          canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight;

          // video frame se object detect karo
          const predictions = await net.detect(video);

          // canvas context lo aur usme prediction draw + audio alert karo
          const ctx = canvasRef.current.getContext("2d");
          renderPrediction(predictions, ctx, audioRef); // audioRef pass kiya
        }

        requestAnimationFrame(detect); // next frame ke liye loop chalao
      };

      detect(); // first call
    };

    runObjectDetection(); // start detection on mount
  }, []);

  // Screenshot capture function
  const captureScreenshot = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  return (
    <div className="mt-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Object Detection</h1>

      {/* Alert sound ke liye hidden audio tag */}
      <audio ref={audioRef} src="/alert.mp3" />

      {/* Webcam + Canvas rendering */}
      {isLoading ? (
        <p className="text-gray-600 text-lg mb-4">Loading model, please wait...</p>
      ) : (
        <div className="relative">
          <Webcam
            ref={webcamRef}
            audio={false}
            width={640}
            height={480}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="rounded-md border shadow-md"
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 rounded-md"
          />
        </div>
      )}

      {/* Screenshot Button */}
      <button
        onClick={captureScreenshot}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Capture Screenshot
      </button>

      {/* Captured image preview */}
      {capturedImage && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Captured Image:</h2>
          <img
            src={capturedImage}
            alt="Captured Screenshot"
            className="border rounded-md shadow-md"
          />
        </div>
      )}
    </div>
  );
};

export default ObjectDetection;




// "use client";

// import React, { useRef, useEffect, useState } from 'react';
// import Webcam from 'react-webcam';
// import { load as cocoSSDLoad } from '@tensorflow-models/coco-ssd';
// import * as tf from '@tensorflow/tfjs';
// import { renderPrediction } from '../utils/render-prediction'; // 

// const videoConstraints = {
//   width: 640,
//   height: 480,
//   facingMode: "user",
// };

// const ObjectDetection = () => {
//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const runObjectDetection = async () => {
//       const net = await cocoSSDLoad(); // Load model
//       setIsLoading(false);

//       const detect = async () => {
//         if (
//           webcamRef.current &&
//           webcamRef.current.video.readyState === 4 &&
//           canvasRef.current
//         ) {
//           const video = webcamRef.current.video;
//           const videoWidth = video.videoWidth;
//           const videoHeight = video.videoHeight;

//           // Set canvas size
//           canvasRef.current.width = videoWidth;
//           canvasRef.current.height = videoHeight;

//           // Detect objects
//           const predictions = await net.detect(video);

//           // Draw predictions using utility function
//           const ctx = canvasRef.current.getContext("2d");
//           renderPrediction(predictions, ctx);
//         }

//         requestAnimationFrame(detect); // Loop for continuous detection
//       };

//       detect();
//     };

//     runObjectDetection();
//   }, []);

//   const captureScreenshot = () => {
//     const imageSrc = webcamRef.current.getScreenshot();
//     setCapturedImage(imageSrc);
//   };

//   return (
//     <div className="mt-8 flex flex-col items-center">
//       <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Object Detection</h1>

//       {isLoading ? (
//         <p className="text-gray-600 text-lg mb-4">Loading model, please wait...</p>
//       ) : (
//         <div className="relative">
//           <Webcam
//             ref={webcamRef}
//             audio={false}
//             width={640}
//             height={480}
//             screenshotFormat="image/jpeg"
//             videoConstraints={videoConstraints}
//             className="rounded-md border shadow-md"
//           />
//           <canvas
//             ref={canvasRef}
//             className="absolute top-0 left-0 rounded-md"
//           />
//         </div>
//       )}

//       <button
//         onClick={captureScreenshot}
//         className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//       >
//         Capture Screenshot
//       </button>

//       {capturedImage && (
//         <div className="mt-6">
//           <h2 className="text-xl font-semibold text-gray-700 mb-2">Captured Image:</h2>
//           <img
//             src={capturedImage}
//             alt="Captured Screenshot"
//             className="border rounded-md shadow-md"
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default ObjectDetection;
