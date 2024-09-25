import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "./firebase";

const download = async (file) => {
  //file reference
  const fileReference = ref(
    storage,
    file
    // "https://firebasestorage.googleapis.com/v0/b/reactchatapp-cf545.appspot.com/o/images%2FThu%20Sep%2019%202024%2011%3A11%3A04%20GMT%2B0700%20(Western%20Indonesia%20Time)_Flow%20Approval%20WF%201.png?alt=media&token=8782355a-8c03-463a-ab66-dbb1f9d30f07"
  );
  getDownloadURL(fileReference)
    .then((downloadURL) => {
      const xhr = new XMLHttpRequest();
      xhr.responseType = "blob";
      xhr.onload = (event) => {
        const blob = xhr.response;

        // create link element to trigger download process
        const link = document.createElement("a");
        const url = window.URL.createObjectURL(blob);

        link.href = url;
        link.download = "new_file.png";
        document.body.appendChild(link);

        link.click();

        // cleanup DOM and URL  object
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      };
      xhr.open("GET", downloadURL);
      xhr.send();
    })
    .catch((error) => {
      switch (error.code) {
        case "storage/object-not-found":
          console.log("File doesn't exist");
          // File doesn't exist
          break;
        case "storage/unauthorized":
          console.log("User doesn't have permission to access the object");
          // User doesn't have permission to access the object
          break;
        case "storage/canceled":
          console.log("User canceled the upload");
          // User canceled the upload
          break;
        // ...
        case "storage/unknown":
          console.log("Unknown error occurred, inspect the server response");
          // Unknown error occurred, inspect the server response
          break;
        default:
          console.log("Error during downloading file: ", error);
      }
    });
};

export default download;
