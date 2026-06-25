import axios from "axios";

export async function predictPhotoService(file) {
  const formData = new FormData();
  formData.append("file", file);

  const data = await axios.post('http://localhost:8000/photo/detect', formData, {
    headers: {
      "Content-type": "multipart/form-data",
    },
  });

  return data;
}
