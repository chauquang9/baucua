import React, {
  Component,
  createRef,
  useEffect,
  useMemo,
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
  IconButton,
  Slide,
  SvgIcon,
  TextField,
  Tooltip,
} from "@mui/material";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { ReactComponent as SuccessIcon } from "../../../asserts/svg/circle-check-solid.svg";
import { ReactComponent as CancelIcon } from "../../../asserts/svg/circle-xmark-solid.svg";
import { ReactComponent as PendingIcon } from "../../../asserts/svg/circle-exclamation-solid.svg";
import requestApi from "../../services/requestApi";
import {
  addRequests,
  changeStatus,
  cleanData,
  getRequests,
} from "../../slices/requestReducer";
import SendIcon from "@mui/icons-material/Send";
import configs from "../../configs/configs";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Requests = (props) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const nagivate = useNavigate();
  const dataRequests = useSelector((state) => state.requests) ?? [];
  const listRequests = dataRequests?.data.requests ?? [];
  const [errorMessage, setErrorMessage] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [reloadRequests, setReloadRequests] = useState(0);
  const [openAddRequest, setOpenAddRequest] = useState(0);
  const [requestMoney, setRequestMoney] = useState(0);
  const [isDisabled, setIsDisabled] = useState(0);
  const [isLoadMore, setIsLoadMore] = useState(0);

  useEffect(() => {
    if (props.open) {
      dispatch(getRequests(1));
      setCurrentPage(1);
      setIsLoadMore(0);
      setReloadRequests(0);
    }
  }, [props.open]);

  useEffect(() => {
    if (reloadRequests) {
      dispatch(getRequests(currentPage));
      setReloadRequests(0);
    }
  }, [reloadRequests]);

  useEffect(() => {
    if (currentPage != 1) {
      dispatch(getRequests(currentPage));
      setIsLoadMore(1);
      setReloadRequests(0);
    }
  }, [currentPage]);

  const dataListRequests = useMemo(() => {
    return listRequests;
  }, [listRequests]);

  const handleCloseAddRequest = () => {
    setOpenAddRequest(0);
  };

  const handleOpenAddRequest = () => {
    setOpenAddRequest(1);
  };

  const handleChange = (e) => {
    setRequestMoney(parseInt(e.target.value));
  };

  const handleAddNewRequest = (e) => {
    setIsDisabled(1);
    dispatch(addRequests(requestMoney)).then((response) => {
      let payload = response.payload;
      if (typeof response.error != "undefined") {
        setErrorMessage(response.error);
      } else {
        dispatch(cleanData());
        setIsDisabled(0);
        setReloadRequests(1);
        setOpenAddRequest(0);
      }
    });
  };

  const handleLoadMoreRequest = () => {
    setCurrentPage(currentPage + 1);
    setIsLoadMore(1);
  };

  const handleChangeRequestStatus = (requestId, status, isSubmit = true) => {
    if (!isSubmit) {
      return false;
    }

    dispatch(
      changeStatus({
        id: requestId,
        status: status,
      })
    ).then((response) => {
      let payload = response.payload;
      if (typeof response.error != "undefined") {
        setErrorMessage(response.error);
      } else {
        dispatch(cleanData());
        setReloadRequests(1);
        setCurrentPage(1);
      }
    });
  };

  const RenderStatus = (id, status) => {
    switch (status) {
      case 1:
        return (
          <Tooltip title="Success">
            <SvgIcon
              className="success-icon"
              component={SuccessIcon}
              onClick={(e) => handleChangeRequestStatus(id, 1, false)}
              inheritViewBox
            />
          </Tooltip>
        );
        break;
      case 2:
        return (
          <Tooltip title="Cancel">
            <SvgIcon
              className="cancel-icon"
              component={CancelIcon}
              onClick={(e) => handleChangeRequestStatus(id, 2, false)}
              inheritViewBox
            />
          </Tooltip>
        );
        break;
      case 0:
        if (user.current.id == 1) {
          return (
            <div>
              <Tooltip title="Success">
                <SvgIcon
                  className="success-icon cursor-pointer"
                  component={SuccessIcon}
                  onClick={(e) => handleChangeRequestStatus(id, 1)}
                  inheritViewBox
                />
              </Tooltip>
              <Tooltip title="Cancel">
                <SvgIcon
                  className="cancel-icon cursor-pointer"
                  component={CancelIcon}
                  onClick={(e) => handleChangeRequestStatus(id, 2)}
                  inheritViewBox
                />
              </Tooltip>
            </div>
          );
        } else {
          return (
            <Tooltip title="Pending">
              <SvgIcon
                className="pending-icon"
                component={PendingIcon}
                inheritViewBox
              />
            </Tooltip>
          );
        }
        break;
      default:
    }
  };

  return (
    <div>
      <Dialog
        fullWidth={"xs"}
        maxWidth={"xs"}
        open={props.open}
        scroll={"paper"}
        onClose={props.onClose}
      >
        <div className={"popup-dialog"}>
          <SvgIcon
            className="close-popup"
            component={CancelIcon}
            onClick={props.onClose}
            inheritViewBox
          />
        </div>
        <div className="header-dialog">
          <h2 className="title-dialog">Requests</h2>
          <Button
            onClick={handleOpenAddRequest}
            className="add-new-button"
            variant="contained"
          >
            New
          </Button>
        </div>
        <div className="content-dialog">
          {dataRequests.isLoading === 1 && isLoadMore === 0 ? (
            <div className="circle-loading">
              <CircularProgress />
            </div>
          ) : (
            <div>
              {dataListRequests.length > 0 ? (
                dataListRequests?.map((row) => (
                  <div className="request-item">
                    <div className="request-information">
                      <span className="full-name">
                        {row.user.avatar ? (
                          <Avatar
                            className="avatar-header"
                            src={configs.url + "" + row.user.avatar}
                            sx={{ width: 28, height: 28 }}
                          ></Avatar>
                        ) : (
                          <Avatar
                            className="avatar-header"
                            sx={{
                              bgcolor: row.user.colorHex,
                              width: 28,
                              height: 28,
                            }}
                          >
                            {row.user.username.charAt(0).toUpperCase()}
                          </Avatar>
                        )}
                        {row.user.name}
                      </span>
                      <div className="sub-information">
                        <span className="money">{row.money}</span> -{" "}
                        <span className="money">{row.created_at}</span>
                      </div>
                    </div>
                    <div className="request-action">
                      {RenderStatus(row.id, row.status)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="message-no-requests">
                  <strong style={{ textAlign: "center" }}>No requests</strong>
                </div>
              )}
            </div>
          )}
          {dataRequests?.data.is_load_more && (
            <div className="load-more">
              {dataRequests.length != 0 &&
              dataRequests.isLoading === 1 &&
              isLoadMore === 1 ? (
                <CircularProgress />
              ) : (
                <button
                  onClick={handleLoadMoreRequest}
                  className="load-more-btn"
                >
                  Load More
                </button>
              )}
            </div>
          )}
        </div>
      </Dialog>

      <Dialog
        open={openAddRequest}
        onClose={handleCloseAddRequest}
        TransitionComponent={Transition}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Add request"}</DialogTitle>
        <form onSubmit={handleAddNewRequest}>
          <DialogContent>
            {errorMessage ? (
              <p style={{ color: "#ff0000" }}>{errorMessage}</p>
            ) : (
              ""
            )}
            <TextField
              id="number"
              type="number"
              onChange={handleChange}
              value={requestMoney.toString()}
            />
          </DialogContent>
          <DialogActions>
            <Button
              disabled={isDisabled == 1 ? "disabled" : ""}
              onClick={handleAddNewRequest}
              variant="contained"
            >
              Send
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

Requests.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Requests;
