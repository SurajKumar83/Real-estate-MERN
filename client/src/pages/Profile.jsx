import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});

  // firebase storage rules
  // allow read;
  // allow write: if
  // request.resource.size<2*1024*1024 &&
  //     request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (efile) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + efile.name; // to make the file name unique we added date as differentor

    const storageRef = ref(storage, fileName); //used to for storage refrence

    const uploadTask = uploadBytesResumable(storageRef, efile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // pice of information from each state change
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-serif text-center my-7">Profile</h1>
      <form className="flex flex-col gap-3">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef} /*This would be reffered on clicking on image icon */
          hidden
          accept="image/*" /*This will allow only to accept the image */
        />
        <img
          onClick={() =>
            fileRef.current.click()
          } /*On clicking image this will click the input file */
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full object-cover h-24 w-24 cursor-pointer self-center mt-2 border-2 hover:border-slate-300 hover:shadow-lg"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image Upload Error(image must be &lt; 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image Successfully Uploaded</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          className="border p-2 rounded-lg"
        />
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          className="border p-2 rounded-lg"
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className="border p-2 rounded-lg"
        />
        <button className="bg-slate-700 text-white rounded-lg p-2 uppercase hover:opacity-95 font-serif disabled:opacity-80 hover:shadow-lg">
          Update
        </button>
      </form>
      <div className="flex justify-between px-3 mt-5">
        <button className="text-red-700 cursor-pointer font-sans font-semibold hover:underline hover:text-red-800">
          Delete account
        </button>
        <button className="text-red-700 cursor-pointer font-sans font-semibold hover:underline hover:text-red-800">
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
