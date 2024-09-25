import React, { useRef, useState } from 'react';
import io from "socket.io-client";

function Room() {
    const videoRef = useRef(null);
    const socketRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [isStreaming, setIsStreaming] = useState(false);
  
    const startStream = async () => {
      // Request webcam access
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        
        // Set the video source to the webcam stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
  
        // Initialize Socket.io connection
        socketRef.current = io("http://localhost:4000");
  
        // Create a MediaRecorder to capture video data
        mediaRecorderRef.current = new MediaRecorder(stream);
  
        // When video data is available, send it to the server
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0 && socketRef.current) {
            socketRef.current.emit("video_chunk", event.data);
          }
        };
  
        // Start recording and set the streaming state to true
        mediaRecorderRef.current.start(100); // Record in chunks of 100ms
        setIsStreaming(true);
      } catch (error) {
        console.error("Error accessing webcam: ", error);
      }
    };
  
    const stopStream = async () => {
      // Stop recording and disconnect the socket
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      setIsStreaming(false);
    };
  
    return (
      <div className="App">
        <h1>Webcam Stream</h1>
        <video ref={videoRef} autoPlay playsInline style={{ display: 'none' ? isStreaming : !isStreaming}} />
        <div>
          <button onClick={startStream} disabled={isStreaming}>
            Start Streaming
          </button>
          <button onClick={stopStream} disabled={!isStreaming}>
            Stop Streaming
          </button>
        </div>
      </div>
    );
}

export default Room;