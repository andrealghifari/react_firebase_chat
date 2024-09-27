import { storage } from "./firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const upload = async (file) => {
  const date = new Date();
  let folder;
  switch (file.type) {
    case "image/png":
    case "image/jpg":
    case "image/jpeg":
    case "image/webp":
      folder = "images";
      break;
    default:
      folder = "files";
      break;
  }
  const storageReference = ref(storage, `${folder}/${date}_${file.name}`);
  const uploadTask = uploadBytesResumable(storageReference, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(progress);
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

export default upload;
