import { storage } from "./firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const upload = async (file) => {
  const date = new Date();
  const storageReference = ref(storage, `images/${date}_${file.name}`);
  const uploadTask = uploadBytesResumable(storageReference, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        reject("Something went wrong!", error.code);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) =>
          resolve(downloadUrl)
        );
      }
    );
  });
};

export default upload