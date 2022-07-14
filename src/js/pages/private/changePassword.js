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
  logout,
  updateUserPassword,
  updateUserProfile,
  uploadAvatarUserProfile,
} from "../../slices/authReducer";
import configs from "../../configs/configs";
import { useNavigate } from "react-router-dom";

const ChangePassword = (props) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const nagivate = useNavigate();
  const [errorMessage, setErrorMessage] = useState();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    dispatch(updateUserPassword(data)).then((response) => {
      let payload = response.payload;
      if (typeof response.error != "undefined") {
        setErrorMessage(payload);
      } else {
        dispatch(logout());
        nagivate("/login");
      }
    });
  };

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <DialogTitle>Change password</DialogTitle>
        <DialogContent>
          {errorMessage ? (
            <p style={{ color: "#ff0000" }}>{errorMessage}</p>
          ) : (
            ""
          )}
          <TextField
            margin="dense"
            id="old_password"
            name="old_password"
            label="Old password"
            type="password"
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            id="new_password"
            name="new_password"
            label="New Password"
            type="password"
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            id="confirmation_new_password"
            name="confirmation_new_password"
            label="Confirm New Password"
            type="password"
            fullWidth
            variant="standard"
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

ChangePassword.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ChangePassword;
