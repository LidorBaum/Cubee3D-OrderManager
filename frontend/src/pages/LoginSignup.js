import React, { useContext, useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { SnackbarHandlerContext } from "../contexts/SnackbarHandlerContext";
import { UserContext } from "../contexts/UserContext";
import Tooltip from "@mui/material/Tooltip";
import Select from "react-select";
import { isValidPassword } from "../services/utils.js";
import {
  snackMissingCreds,
  snackInvalidPasswordRegex,
  snackNameUnavailable,
} from "../snackMessages.js";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import userService from "../services/userService";

export const LoginSignup = (props) => {
  const [loginCred, setLogin] = useState({ email: "", password: "" });
  const [signupCred, setSignup] = useState({
    email: "",
    name: "",
    password: "",
  });
  const [isNewUser, setIsNewUser] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const notificationHandler = useContext(SnackbarHandlerContext);
  const { loggedUser, setLoggedUser } = useContext(UserContext);
  let history = useHistory();

  const signupHandleChange = (ev) => {
    ev.persist();
    const field = ev.target.name;
    const value = ev.target.value;
    setSignup((prevSignup) => ({ ...prevSignup, [field]: value }));
    console.log(signupCred);
  };

  const loginHandleChange = (ev) => {
    ev.persist();
    const field = ev.target.name;
    const value = ev.target.value;
    setLogin((prevLogin) => ({ ...prevLogin, [field]: value }));
    console.log(loginCred);
  };

  const doLogin = async (ev) => {
    ev.preventDefault();
    setIsLoading(true);
    const { email, password } = loginCred;
    if (!email || !password) {
      setIsLoading(false);
      return notificationHandler.error(snackMissingCreds);
    }
    const user = await userService.login({
      email: email,
      password: password,
    });

    if (user.error) {
      notificationHandler.error(user.error.message);
      setIsLoading(false);
      return;
    }
    setLoggedUser(user);
    history.push("/park");
  };

  const doSignup = async (ev) => {
    ev.preventDefault();
    setIsLoading(true);
    const { email, name, password } = signupCred;
    if (!email || !password || !name) {
      setIsLoading(false);
      return notificationHandler.error(snackMissingCreds);
    }
    if (!isValidPassword(password)) {
      setIsLoading(false);
      return notificationHandler.error(snackInvalidPasswordRegex);
    }
    const newUser = await userService.signup({
      email,
      name,
      password,
    });
    if (newUser.error) {
      notificationHandler.error(newUser.error.message);
      setIsLoading(false);
      return;
    }
    setLoggedUser(newUser);
    history.push("/park");
  };

  const signInForm = (
    <>
      <form>
        <TextField
          required
          onChange={loginHandleChange}
          id="standard-basic"
          name="email"
          label="Email"
          variant="standard"
        />
        <TextField
          required
          onChange={loginHandleChange}
          id="standard-basic"
          name="password"
          type="password"
          label="Password"
          variant="standard"
        />
        <Button onClick={doLogin} variant="contained">
          Log in
        </Button>
      </form>
      <br />
      <p onClick={() => setIsNewUser(true)}>New here? Sign up </p>
    </>
  );
  const signUpForm = (
    <>
      <form>
        <TextField
          required
          onChange={signupHandleChange}
          name="email"
          id="standard-basic"
          label="Email"
          variant="standard"
        />
        <TextField
          required
          onChange={signupHandleChange}
          name="name"
          id="standard-basic"
          label="Name"
          variant="standard"
        />
        <TextField
          required
          onChange={signupHandleChange}
          name="password"
          id="standard-basic"
          type="password"
          label="Password"
          variant="standard"
        />
        <Button onClick={doSignup} variant="contained">
          Sign Up
        </Button>
      </form>
      <br />
      <p onClick={() => setIsNewUser(false)}>Already registered? Log in </p>
    </>
  );
  return (
    <div className="flex-container">
      <img
        className="side-img"
        src={
          "https://res.cloudinary.com/echoshare/image/upload/v1640101904/MeBagina/src/Activity-Tracker-Pet-Talk_mmmwch.jpg"
        }
      />
      <div className="form-container">
        {isNewUser ? signUpForm : signInForm}
      </div>
    </div>
  );
};
