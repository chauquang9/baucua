import React, { Component, useEffect } from "react";
import Master from "./master";
import Container from "@mui/material/Container";
import { Link, useNavigate } from "react-router-dom";
import { withRouter } from "../../components/withRouter";
import { connect } from "react-redux";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/login");
  }, []);
};

export default Home;
