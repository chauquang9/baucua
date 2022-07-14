import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import React, { Component } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  Link,
  Navigate,
  NavLink,
  useNavigate,
  withNavigation,
} from "react-router-dom";
import { logout } from "../../slices/authReducer";
import { withRouter } from "../../components/withRouter";
import { styled } from "@mui/material/styles";
import { purple } from "@mui/material/colors";
import {
  Avatar,
  AvatarGroup,
  createSvgIcon,
  Grid,
  Icon,
  SvgIcon,
  Tooltip,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Profile from "./profile";
import ChangePassword from "./changePassword";
import configs from "../../configs/configs";
import { isMobile } from "react-device-detect";
import { ReactComponent as HomeIcon } from "../../../asserts/svg/home_black.svg";
import { ReactComponent as StatisticIcon } from "../../../asserts/svg/view_column.svg";

class Master extends Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      open: Boolean(null),
      openProfile: Boolean(null),
      openChangePassword: Boolean(null),
      prevScrollpos: window.pageYOffset,
      visible: true,
    };
  }

  // Adds an event listener when the component is mount.
  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  // Remove the event listener when the component is unmount.
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  // Hide or show the menu.
  handleScroll = () => {
    const { prevScrollpos } = this.state;

    const currentScrollPos = window.pageYOffset;
    const visible = prevScrollpos > currentScrollPos;

    this.setState({
      prevScrollpos: currentScrollPos,
      visible,
    });
  };

  handleLogout = () => {
    this.props.logout();
    this.props.navigate("/login");
  };

  handleClick = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
      open: Boolean(1),
      openProfile: Boolean(null),
      openChangePassword: Boolean(null),
    });
  };

  handleClose = (e) => {
    e.preventDefault();
    if (e.key !== "Tab") {
      this.setState({
        anchorEl: null,
        open: Boolean(null),
      });
    } else {
      e.stopPropagation();
    }
  };

  handleOpenProfile = () => {
    this.setState({
      openProfile: Boolean(1),
      open: Boolean(1),
    });
  };

  handleCloseProfile = () => {
    this.setState({
      openProfile: Boolean(null),
    });
  };

  handleOpenChangePassword = () => {
    this.setState({
      openChangePassword: Boolean(1),
      open: Boolean(1),
    });
  };

  handleCloseChangePassword = (e) => {
    e.preventDefault();
    this.setState({
      openChangePassword: Boolean(null),
    });
  };

  render() {
    const firstWordUpper = this.props.user.current.name ?? "";

    return (
      <div className="container">
        <header className="header-admin">
          <div className="left-header">
            {!isMobile ? (
              <ul className="main-menu">
                <li>
                  <NavLink
                    className={(navData) =>
                      navData.isActive ? "active" : "link"
                    }
                    to="/baucua"
                  >
                    Game
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={(navData) =>
                      navData.isActive ? "active" : "link"
                    }
                    to="/statistics"
                  >
                    Statistics
                  </NavLink>
                </li>
              </ul>
            ) : (
              ""
            )}
          </div>
          <div className="right-header">
            <div className="money-header">
              Money: <strong>{this.props.user.current.price}</strong>
            </div>
            <div className="profile-header">
              <Tooltip title="Settings">
                <IconButton
                  onClick={this.handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={this.state.open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={this.state.open ? "true" : undefined}
                >
                  {this.props.user.current.avatar.length != 0 ? (
                    <Avatar
                      src={configs.url + "" + this.props.user.current.avatar}
                    ></Avatar>
                  ) : (
                    <Avatar
                      sx={{
                        bgcolor: this.props.user.current.colorHex,
                        width: 46,
                        height: 46,
                      }}
                    >
                      {firstWordUpper.charAt(0).toUpperCase()}
                    </Avatar>
                  )}
                </IconButton>
              </Tooltip>
            </div>

            <Menu
              anchorEl={this.state.anchorEl}
              id="account-menu"
              open={this.state.open}
              onClose={this.handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem>
                <Button color="info" onClick={this.handleOpenProfile}>
                  {this.props.user.current.avatar.length != 0 ? (
                    <Avatar
                      src={configs.url + "" + this.props.user.current.avatar}
                    ></Avatar>
                  ) : (
                    <Avatar
                      sx={{
                        bgcolor: this.props.user.current.colorHex,
                        width: 46,
                        height: 46,
                      }}
                    >
                      {firstWordUpper.charAt(0).toUpperCase()}
                    </Avatar>
                  )}
                  Profile
                </Button>
              </MenuItem>
              <MenuItem>
                <Button color="info" onClick={this.handleOpenChangePassword}>
                  Change password
                </Button>
              </MenuItem>
              <Divider />
              <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
            </Menu>

            {/* popup */}
            <Profile
              open={this.state.openProfile}
              onClose={this.handleCloseProfile}
            ></Profile>

            <ChangePassword
              open={this.state.openChangePassword}
              onClose={this.handleCloseChangePassword}
            ></ChangePassword>
          </div>
        </header>
        <div className="container content-admin">{this.props.children}</div>
        {isMobile ? (
          <Grid
            className={
              "mobile-menu" +
              (!this.state.visible ? " hidden-mobile-menu" : " ")
            }
            xs={12}
            container
          >
            <ul>
              <li>
                <NavLink
                  className={(navData) =>
                    navData.isActive ? "active" : "link"
                  }
                  to="/baucua"
                >
                  <SvgIcon
                    className="icon"
                    component={HomeIcon}
                    inheritViewBox
                  />
                  <span className="caption">Game</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={(navData) =>
                    navData.isActive ? "active" : "link"
                  }
                  to="/statistics"
                >
                  <SvgIcon
                    className="icon"
                    component={StatisticIcon}
                    inheritViewBox
                  />
                  <span className="caption">Statistics</span>
                </NavLink>
              </li>
            </ul>
          </Grid>
        ) : (
          ""
        )}

        <footer></footer>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    user: state.user ?? {},
  };
}

//withRouter to use get navigate.
export default withRouter(connect(mapStateToProps, { logout })(Master));
