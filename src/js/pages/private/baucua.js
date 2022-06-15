import React, { Component, useEffect, useState } from "react";
import Master from "./master";
import Container from "@mui/material/Container";
import { useDispatch, useSelector } from "react-redux";
import { baucua } from "../../slices/baucuaReducer";
import { styled } from "@mui/material/styles";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Input,
  Slide,
  TextField,
  Tooltip,
  tooltipClasses,
  Typography,
} from "@mui/material";
import pusherClient from "../../configs/pusherClient";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

const Baucua = () => {
  const dispatch = useDispatch();
  const [dataBet, setDataBet] = useState([]);
  const [dataTemp, setDataTemp] = useState();
  const [priceBet, setPriceBet] = useState(0);
  const [openBet, setOpenBet] = useState(false);
  const [openMessage, setOpenMessage] = useState(false);
  const [message, setMessage] = useState();
  const items = useSelector((state) => state.baucua);
  const [dataRandom, setDataRandom] = useState();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(baucua());
  }, []);

  const RenderStartButton = () => {
    if (user.current.email == "quang.chau@monimedia.com") {
      return (
        <div>
          <Grid className="start-button" xs={12}>
            <Button onClick={handleRandom} variant="contained">
              Start
            </Button>
          </Grid>
        </div>
      );
    }
  };

  const RenderResults = () => {
    let data = [];
    if (dataRandom) {
      data = dataRandom;
    } else {
      data = items?.baucua.slice(0, 3);
    }

    let dataResults = data.map((element, index) => (
      <Grid item xs={4} key={index}>
        <img
          className="result-item"
          src={element.image}
          alt={element.name}
        ></img>
      </Grid>
    ));

    return dataResults;
  };

  const RenderDataBet = (itemId) => {
    let filterData = dataBet.filter((item) => parseInt(item.itemId) === itemId);
    let dataBets = filterData.map((item, index) => (
      <div
        key={index}
        className="icon-image-item"
        style={{ left: item.x, top: item.y }}
      >
        <HtmlTooltip
          title={
            <React.Fragment>
              <Typography color="inherit">{item.username}</Typography>
              <em>Bet: {item.priceBet}</em>
            </React.Fragment>
          }
        >
          <Avatar
            className="avatar-header"
            sx={{ bgcolor: "#FFA07A", width: 28, height: 28 }}
          >
            {user.current.name.charAt(0).toUpperCase()}
          </Avatar>
        </HtmlTooltip>
      </div>
    ));

    return dataBets;
  };

  const getKeyBetByItemAndUserId = (itemId) => {
    let userId = user.current.id;
    let key = "";
    for (let index = 0; index < dataBet.length; ++index) {
      const item = dataBet[index];
      if (item.itemId == itemId && item.userId == userId) {
        key = index;

        return index;
      }
    }

    if (key) {
      return key;
    }

    return undefined;
  };

  const handleRandom = () => {
    setInterval(() => {
      const sample = items?.baucua
        .map((x) => ({ x, r: Math.random() }))
        .sort((a, b) => a.r - b.r)
        .map((a) => a.x)
        .slice(0, 3);

      setDataRandom(sample);

      pusherClient.subscribe("votes");
    }, 300);
  };

  const handleCloseOpenBet = () => {
    setOpenBet(false);
  };

  const handleCloseOpenMessage = () => {
    setOpenMessage(false);
  };

  const handleOpenModal = (e, itemId) => {
    setOpenBet(true);
    e.preventDefault();

    let x = e.clientX;
    let y = e.clientY;
    const elem = e.target;
    const rect = elem.getBoundingClientRect();

    let xPosition = x - rect.left;
    let yPosition = y - rect.top;

    x = xPosition + "px";
    y = yPosition + "px";

    let key = getKeyBetByItemAndUserId(itemId);
    if (typeof key != "undefined") {
      //case edit
      let data = dataBet[key];
      setPriceBet(data.priceBet);
    } else {
      setPriceBet(0);
    }

    const dataTemp = {
      itemId: itemId,
      x: x,
      y: y,
      userId: user.current.id,
      username: user.current.name,
    };

    setDataTemp(dataTemp);
  };

  const handleBet = (e) => {
    if (priceBet <= 0) {
      setOpenMessage(true);
      setMessage("Number should be greater than 0.");

      return;
    }

    let key = getKeyBetByItemAndUserId(dataTemp.itemId);
    if (typeof key != "undefined") {
      //case edit
      dataBet[key].priceBet = priceBet;
      dataBet[key].x = dataTemp.x;
      dataBet[key].y = dataTemp.y;
      setDataBet(dataBet);
    } else {
      //case new
      const dataBetAppend = [
        {
          itemId: dataTemp.itemId,
          x: dataTemp.x,
          y: dataTemp.y,
          userId: user.current.id,
          username: user.current.name,
          priceBet: priceBet,
        },
      ];

      setDataBet((dataBet) => [...dataBet, ...dataBetAppend]);
    }

    setDataTemp({});
    setOpenBet(false);
    setPriceBet(0);
  };

  const handleChange = (e) => {
    setPriceBet(e.target.value);
  };

  return (
    <Master>
      <Grid container spacing={2}>
        <Grid item={true} xs={8}>
          <h2 className="header-content">Game</h2>
          <Grid className="items" container xs={12}>
            {items?.baucua.map((element, index) => (
              <Grid
                className="grid-image-content"
                item={true}
                xs={4}
                key={index}
                onClick={(event) => handleOpenModal(event, element.id)}
              >
                <img
                  className="image-item"
                  id={"image-item-" + element.id}
                  src={element.image}
                  alt={element.name}
                ></img>
                {RenderDataBet(element.id)}
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item={true} xs={4} className="right-content">
          <h2 className="header-content">Results</h2>
          <Grid className="results" container xs={12}>
            <RenderResults></RenderResults>
          </Grid>
          <RenderStartButton></RenderStartButton>
        </Grid>

        {/* popup message */}
        <Dialog
          open={openMessage}
          TransitionComponent={Transition}
          onClose={handleCloseOpenMessage}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Message"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseOpenMessage}>OK</Button>
          </DialogActions>
        </Dialog>

        {/* popup bet */}
        <Dialog open={openBet} onClose={handleCloseOpenBet}>
          <DialogTitle>Bet</DialogTitle>
          <DialogContent>
            <TextField
              id="number"
              type="number"
              onChange={handleChange}
              value={priceBet}
            />
          </DialogContent>
          <DialogActions>
            <Button type="submit" onClick={handleBet}>
              Bet
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Master>
  );
};

export default Baucua;
