import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function predictPhotoService(file) {
  const formData = new FormData();
  formData.append("file", file);

  const data = await axios.post(BASE_URL+'/photo/detect', formData, {
    headers: {
      "Content-type": "multipart/form-data",
    },
  });

  return data;
}
