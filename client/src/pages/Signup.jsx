import { Link } from "react-router-dom";
const Signup = () => {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-5 leading-tight ">
        Sign Up
      </h1>
      <form action="" className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Username"
          name="username"
          className="border p-2 rounded-lg"
          id="username"
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          className="border p-2 rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          className="border p-2 rounded-lg"
        />
        <button className="border p-2 rounded-lg bg-slate-600 text-white hover:opacity-95 hover:shadow-lg disabled:opacity-80 font-semibold">
          SIGN UP
        </button>
        <button className="border p-2 rounded-lg bg-red-700 text-white hover:opacity-95 hover:shadow-lg disabled:opacity-80 font-semibold">
          CONTINUE WITH GOOGLE
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>
          Have an account?
          <Link
            to="/sign-in"
            className="text-blue-500 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
