import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { Link } from "react-router-dom";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/UserSlice.js";

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showLitingsError, setShowLitingsError] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

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

  const hangleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      // req to the api
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(error.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListing = async () => {
    try {
      setShowLitingsError(false);
      setLoadingList(true);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      setLoadingList(false);
      if (data.success === false) {
        setShowLitingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowLitingsError(true);
      setLoadingList(false);
    }
  };
  const handleListingDelete = async (listingid) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingid}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingid)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto font-serif">
      <h1 className="text-3xl font-serif text-center my-5">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
          src={formData?.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full object-cover h-24 w-24 cursor-pointer self-center mt-2 border-2 hover:border-red-300 hover:shadow-lg"
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
          defaultValue={currentUser.username}
          onChange={hangleChange}
          placeholder="Username"
          className="border p-2 rounded-lg"
        />
        <input
          type="email"
          name="email"
          id="email"
          defaultValue={currentUser.email}
          onChange={hangleChange}
          placeholder="Email"
          className="border p-2 rounded-lg"
        />
        <input
          type="password"
          defaultValue={currentUser.password}
          onChange={hangleChange}
          name="password"
          id="password"
          placeholder="Password"
          className="border p-2 rounded-lg"
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-2 uppercase hover:opacity-95 font-serif disabled:opacity-80 hover:shadow-lg"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-500 text-white rounded-lg p-2 uppercase hover:opacity-95 font-serif disabled:opacity-80 hover:shadow-lg text-center"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between px-3 mt-5">
        <button
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer font-sans font-semibold hover:underline hover:text-red-800"
        >
          Delete account
        </button>
        <button
          onClick={handleSignout}
          className="text-red-700 cursor-pointer font-sans font-semibold hover:underline hover:text-red-800"
        >
          Sign Out
        </button>
      </div>
      {error ? (
        <p className="text-red-700 mt-2 text-center font-serif font-">
          {error + " 🤔"}
        </p>
      ) : updateSuccess ? (
        <p className="text-green-700 mt-2 text-center font-serif font-">
          {"User is Updated Successfully! 🎉"}
        </p>
      ) : (
        ""
      )}
      <button
        disabled={loadingList}
        onClick={handleShowListing}
        className="text-green-700 bg-slate-200 w-full border border-green-300 p-2 mt-2 font-semibold rounded-lg hover:text-white hover:shadow-lg hover:bg-green-500 "
      >
        {loadingList ? "Loading Lists..." : "Your Listings"}
      </button>
      <p>{showLitingsError ? "Error while showing lists" : ""}</p>
      {userListings &&
        userListings.length > 0 &&
        userListings.map((listing) => (
          <div
            key={listing._id}
            className="flex border rounded-lg p-2 justify-between items-center gap-4 mt-3"
          >
            <Link to={`/listings/${listing._id}`}>
              <img
                src={listing.imageUrls[0]}
                alt="listing cover"
                className="h-16 w-16 object-contain"
              />
            </Link>
            <Link
              className="text-slate-700 font-serif font-semibold flex-1 hover:underline truncate "
              to={`/listings/${listing._id}`}
            >
              <p>{listing.name}</p>
            </Link>
            <div className="flex flex-col font-semibold">
              <button
                onClick={() => handleListingDelete(listing._id)}
                className="text-red-700 uppercase hover:underline"
              >
                Delete
              </button>
              <button className="text-green-700 uppercase hover:underline">
                Edit
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Profile;
