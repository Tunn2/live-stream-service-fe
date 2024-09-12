import axios from "axios";

const handleFileUpload = async (file) => {
  try {
    const uniqueFileName = `${Date.now()}-${file.name}`;

    // Upload file to BunnyCDN
    const response = await axios.put(
      `https://live-stream-service.b-cdn.net/${uniqueFileName}`, // URL for BunnyCDN
      file, // Send the file data itself
      {
        headers: {
          AccessKey: "e68740b8-e7b2-4df2-82b616b8ab35-77e2-42d6",
          "Content-Type": "application/octet-stream", // Optional: Set the Content-Type header based on file type
        },
      }
    );

    if (response.status === 200) {
      // Return the publicly accessible URL of the uploaded file
      return `https://live-stream-service.b-cdn.net/${uniqueFileName}`;
    } else {
      console.error("Upload failed:", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return false;
  }
};

export default handleFileUpload;
