import React, {
  Component,
  createRef,
  useEffect,
  useRef,
  useState,
} from "react";
import Master from "./master";
import Container from "@mui/material/Container";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  TextField,
} from "@mui/material";
import PropTypes from "prop-types";
import authApi from "../../services/authApi";
import {
  updateUserProfile,
  uploadAvatarUserProfile,
} from "../../slices/authReducer";
import configs from "../../configs/configs";

const Profile = (props) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    dispatch(updateUserProfile(data)).then((response) => {
      let payload = response.payload;
      if (typeof response.error != "undefined") {
        setErrorMessage(payload);
      } else {
        props.onClose();
      }
    });
  };

  const handleUploadFile = (e) => {
    let formData = new FormData();
    formData.append("avatar", e.target.files[0]);
    dispatch(uploadAvatarUserProfile(formData)).then((response) => {
      let payload = response.payload;
      if (typeof response.error != "undefined") {
        setErrorMessage(payload);
      } else {
        setErrorMessage("");
      }
    });
  };

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <DialogTitle>Profile</DialogTitle>
        <DialogContent>
          {errorMessage ? (
            <p style={{ color: "#ff0000" }}>{errorMessage}</p>
          ) : (
            ""
          )}
          Upload File
          <Button component="label">
            {user.current.avatar.length != 0 ? (
              <Avatar src={configs.url + "" + user.current.avatar}></Avatar>
            ) : (
              <Avatar sx={{ bgcolor: user.current.colorHex }}>
                {user.current.name.charAt(0).toUpperCase()}
              </Avatar>
            )}
            <input
              type="file"
              onChange={handleUploadFile}
              name="avatar"
              hidden
            />
          </Button>
          {user.isLoading ? <CircularProgress /> : ""}
          <TextField
            autoFocus
            margin="dense"
            id="email"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            defaultValue={user.current.email}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={user.current.name}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

Profile.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Profile;
