import React, { useRef, useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000"); // Adjust the URL if needed

const LiveStream = () => {
  const videoRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Listen for incoming comments
    socket.on("new_comment", (newComment) => {
      setComments((prevComments) => [...prevComments, newComment]);
    });

    return () => {
      socket.off("new_comment");
    };
  }, []);

  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const arrayBuffer = reader.result;
            socket.emit("video_chunk", arrayBuffer);
          };
          reader.readAsArrayBuffer(event.data);
        }
      };

      mediaRecorder.start(1000); // Send data every second
      setStreaming(true);
    } catch (error) {
      console.error("Error starting stream:", error);
    }
  };

  const stopStream = () => {
    setStreaming(false);
    socket.emit("disconnect"); // Disconnect the WebSocket connection
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    videoRef.current.srcObject = null;
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      const newComment = {
        id: Date.now(),
        text: comment,
        sender: "You", // You can replace this with actual user identification if available
      };
      setComments((prevComments) => [...prevComments, newComment]); // Add comment locally
      socket.emit("new_comment", newComment); // Send to server
      setComment(""); // Clear input field
    }
  };

  return (
    <div className="flex">
      <div className="w-1/2 p-4">
        <h3 className="text-xl font-bold mb-4">Camera Stream</h3>
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-auto border-2 border-black mb-4"
        ></video>
        <div>
          {streaming ? (
            <button
              onClick={stopStream}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Stop Stream
            </button>
          ) : (
            <button
              onClick={startStream}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Start Stream
            </button>
          )}
        </div>
      </div>
      <div className="w-1/2 p-4">
        <h3 className="text-xl font-bold mb-4">Comments</h3>
        <div className="h-64 overflow-y-auto border p-2 mb-4">
          {comments.map((c) => (
            <div key={c.id} className="mb-2">
              <strong>{c.sender}: </strong>
              {c.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleCommentSubmit} className="flex">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comment"
            className="flex-grow border p-2 mr-2"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default LiveStream;
