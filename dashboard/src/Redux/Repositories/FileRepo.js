import { initializeUserRequest } from "../../apiRequest";

export const uploadFile = async (file, bucket) => {
  console.log("File to be uploaded:", file);
  return initializeUserRequest()
    .then(async (request) => {
      const formData = new FormData();
      formData.append("images", file);

      console.log("FormData object:", bucket);
      return request.post(`img/tmp/${bucket}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    })
    .then((res) => {
      console.log("File uploaded successfully:", res.data);
      return res.data;
    })
    .catch((err) => {
      console.error("An error occurred during the file upload:", err);
      throw err;
    });
};
