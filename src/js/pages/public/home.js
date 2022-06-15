import React, { Component } from "react";
import Master from "./master";
import Container from "@mui/material/Container";

class Home extends Component {
  render() {
    return (
      <Master>
        <Container component="main" maxWidth="xs"></Container>
      </Master>
    );
  }
}

export default Home;
