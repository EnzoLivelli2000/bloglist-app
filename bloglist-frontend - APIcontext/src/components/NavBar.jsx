import React from "react";
import LoginPage from "../pages/Login";
import { NavLink } from "react-router-dom";
import { useNotification } from "../features/notification/notificationContext";
import { handleLogout, useUser, useUserDispatch } from "../features/login/loginContext";

const Navbar = () => {
  const { dispatch: dispatchNotification } = useNotification();
  const loginDispatch = useUserDispatch();

  const user = useUser()

  const logoutFunction = async () => {
    await handleLogout(dispatchNotification, loginDispatch)
  }

  console.log("user: ", user)
  return (
    <nav>
      <NavLink
        to="/users"
        style={({ isActive }) => ({ color: isActive ? 'blue' : 'black' })}
      >
        Users
      </NavLink>
      {" | "}
      <NavLink
        to="/blogs"
        style={({ isActive }) => ({ color: isActive ? 'blue' : 'black' })}
      >
        Blogs
      </NavLink>
      {" | "}
      {user ? user.name : "No user logged"}
      {"  "}
      {user ? <button onClick={() => logoutFunction()}>Logged Out</button> : null}
      <h1>My App</h1>
      <LoginPage />
    </nav>
  );
};

export default Navbar;
