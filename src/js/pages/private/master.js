import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import React, { Component } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, withNavigation } from "react-router-dom";
import { logout } from "../../slices/authReducer";
import { withRouter } from "../../components/withRouter";
import { styled } from "@mui/material/styles";
import { purple } from "@mui/material/colors";
import { Avatar, AvatarGroup } from "@mui/material";

class Master extends Component {
  handleLogout = () => {
    this.props.logout();
    this.props.navigate("/login");
  };

  render() {
    const ColorButton = styled(Button)(({ theme }) => ({
      color: theme.palette.getContrastText("#C38D9E"),
      backgroundColor: "#C38D9E",
      "&:hover": {
        backgroundColor: "#C38D9E",
      },
    }));

    const firstWordUpper = this.props.user.current.name;

    return (
      <div className="container">
        <header className="header-admin">
          <div className="left-header">
            <AvatarGroup spacing={-6} className="avatar-group-header">
              <Avatar
                className="avatar-header"
                sx={{ bgcolor: "#FFA07A", width: 46, height: 46 }}
              >
                {firstWordUpper.charAt(0).toUpperCase()}
              </Avatar>{" "}
              <span className="email">{this.props.user.current.email}</span>
            </AvatarGroup>
          </div>
          <div className="right-header">
            <ColorButton variant="outlined" onClick={this.handleLogout}>
              Logout
            </ColorButton>
          </div>
        </header>
        <div className="container content-admin">{this.props.children}</div>
        <footer></footer>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    user: state.user,
  };
}

//withRouter to use get navigate.
export default withRouter(connect(mapStateToProps, { logout })(Master));
