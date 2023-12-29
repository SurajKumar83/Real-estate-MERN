import { useSelector } from "react-redux";
const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-serif text-center my-7">Profile</h1>
      <form className="flex flex-col gap-3">
        <img
          src={currentUser.avatar}
          alt="profile"
          className="rounded-full object-cover h-24 w-24 cursor-pointer self-center mt-2 hover:border-2 hover:border-red-300"
        />
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
