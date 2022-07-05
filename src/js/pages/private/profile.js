import React, { Component, useEffect, useState } from "react";
import Master from "./master";
import Container from "@mui/material/Container";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import PropTypes from "prop-types";

const Profile = (props) => {
  const user = useSelector((state) => state.user);

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Profile</DialogTitle>
      <DialogContent>
        Upload File
        <Button component="label">
          <Avatar sx={{ bgcolor: user.current.colorHex }}>
            {user.current.name.charAt(0).toUpperCase()}
          </Avatar>
          <input type="file" hidden />
        </Button>
        <TextField
          autoFocus
          margin="dense"
          id="email"
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
          label="Name"
          type="text"
          fullWidth
          variant="standard"
          defaultValue={user.current.name}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button onClick={props.onClose}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

Profile.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Profile;
