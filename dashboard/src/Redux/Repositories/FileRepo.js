import { publicRequest } from "../../apiRequest";


export const uploadFile = async (file) => {
  try {
    const res = await publicRequest.post(`img/upload/`, file, {
          'Content-Type': 'multipart/form-data'
        } );
    console.log(res);
    return res.data
  } catch (err) {
    console.log(err)
  }
};