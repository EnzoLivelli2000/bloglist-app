import React from "react";
import { NavLink } from "react-router-dom";
import LoginPage from "../pages/Login";
import { useDispatch, useSelector } from "react-redux";
import { handleLogout } from "../features/login/loginReducer";

const Navbar = () => {

  const user = useSelector((state) => state.login)
  const dispatch = useDispatch()

  const logoutFunction = () => {
    dispatch(handleLogout());
  }
  return (
    <nav>
      <NavLink to="/users">Users</NavLink>
      {" | "}
      <NavLink to="/blogs">Blogs</NavLink>
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
