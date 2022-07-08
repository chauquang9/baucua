import React, { Component, useEffect, useMemo, useState } from "react";
import Master from "./master";
import Container from "@mui/material/Container";
import { useDispatch, useSelector } from "react-redux";
import {
  baucua,
  gameStatus,
  getBet,
  getTopPlayer,
} from "../../slices/baucuaReducer";
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
import Echo from "../../configs/pusherClient";
import baucuaApi from "../../services/baucuaApi";
import { updateMoney, userProfile } from "../../slices/authReducer";
import table from "../../components/table";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";
import configs from "../../configs/configs";
import { isMobile } from "react-device-detect";
import soundfile from "../../../files/xoso.mp3";

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
  const [shakeImage, setShakeImage] = useState(0);
  const [isDeleteButton, setIsDeleteButton] = useState(0);
  const [openBet, setOpenBet] = useState(false);
  const [openMessage, setOpenMessage] = useState(false);
  const [isPlayingGame, setIsPlayingGame] = useState(0);
  const [topPlayer, setTopPlayer] = useState([]);
  const [message, setMessage] = useState();
  const items = useSelector((state) => state.baucua);
  const [dataRandom, setDataRandom] = useState();
  const user = useSelector((state) => state.user);
  const audioTune = useMemo(() => new Audio(soundfile), [soundfile]);
  const channel = window.Echo.channel("baucua-channel");

  useEffect(() => {
    audioTune.load();
    dispatch(baucua());
    dispatch(userProfile());
    dispatch(gameStatus()).then((res) => {
      let is_playing = res.payload.is_playing ?? 0;
      setIsPlayingGame(is_playing);
    });
    dispatch(getBet()).then((res) => {
      setDataBet(res.payload);
    });
    dispatch(getTopPlayer()).then((res) => {
      setTopPlayer(res.payload);
    });

    channel.listen(".start-game", (data) => {
      setIsPlayingGame(1);
      setShakeImage(1);
      audioTune.play();
    });

    channel.listen(".bet-lists", (data) => {
      setDataBet(data.betLists);
      setTopPlayer(data.topPlayer);
    });
  }, []);

  useEffect(() => {
    let intervalData = "";
    if (isPlayingGame == 1) {
      setShakeImage(1);
      intervalData = setInterval(() => {
        const sample = items?.baucua
          .map((x) => ({ x, r: Math.random() }))
          .sort((a, b) => a.r - b.r)
          .map((a) => a.x)
          .slice(0, 3);

        setDataRandom(sample);
      }, 300);
    }

    if (intervalData) {
      channel.listen(".results-game", (data) => {
        setIsPlayingGame(0);
        clearInterval(intervalData);
        dispatch(userProfile());
        setDataRandom(data.results);
        setShakeImage(0);
        audioTune.pause();
        audioTune.currentTime = 0;
        if (typeof data.congratulationUserIds !== "undefined") {
          let userIds = Object.keys(data.congratulationUserIds);
          if (userIds.indexOf(user.current.id.toString()) != -1) {
            setOpenMessage(true);
            setMessage(
              "You won +" + data.congratulationUserIds[user.current.id] + "."
            );
          }
        }

        setTopPlayer(data.topPlayerGame);
        setDataBet([]);
      });
    }
  }, [isPlayingGame]);

  const RenderResults = () => {
    let data = [];
    if (dataRandom) {
      data = dataRandom;
    } else {
      data = items?.baucua.slice(0, 3);
    }

    let dataResults = data.map((element, index) => (
      <Grid item xs={4} sm={4} md={4} lg={4} key={index}>
        <img
          className={"result-item" + (shakeImage ? " shake" : "")}
          src={configs.url + element.image}
          alt={element.name}
        ></img>
      </Grid>
    ));

    return dataResults;
  };

  const RenderDataBet = (itemId) => {
    let filterData = dataBet
      .filter((item) => parseInt(item.itemId) === itemId)
      .map((item, index) => {
        if (typeof item !== "object") {
          return [];
        }

        let numberX = item.x.split("px")[0];
        let numberY = item.y.split("px")[0];
        if (isMobile) {
          if (numberX > 350) {
            numberX = numberX / 3;
          } else if (numberX > 170) {
            numberX = numberX / 2;
          }

          if (numberY > 380) {
            numberY = numberY / 3;
          } else if (numberY > 180) {
            numberY = numberY / 2;
          }
        }

        return {
          colorHex: item.colorHex,
          itemId: item.itemId,
          priceBet: item.priceBet,
          userId: item.userId,
          username: item.username,
          avatar: item.avatar,
          x: numberX + "px",
          y: numberY + "px",
        };
      });

    let dataBets = filterData.map((item, index) => (
      <div
        key={index}
        className="icon-image-item"
        style={{
          left: item.x,
          top: item.y,
        }}
      >
        <HtmlTooltip
          title={
            <React.Fragment>
              <Typography color="inherit">{item.username}</Typography>
              <em>Bet: {item.priceBet}</em>
            </React.Fragment>
          }
        >
          {item.avatar ? (
            <Avatar
              className="avatar-header"
              src={configs.url + "" + item.avatar}
              sx={{ width: 28, height: 28 }}
            ></Avatar>
          ) : (
            <Avatar
              className="avatar-header"
              sx={{ bgcolor: item.colorHex, width: 28, height: 28 }}
            >
              {item.username.charAt(0).toUpperCase()}
            </Avatar>
          )}
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

  const handleStopRandom = () => {
    baucuaApi.stopButton();
    baucuaApi.resultGame();
  };

  const handleRandom = () => {
    let response = baucuaApi.startButton();
  };

  const handleCloseOpenBet = () => {
    setOpenBet(false);
  };

  const handleCloseOpenMessage = () => {
    setOpenMessage(false);
  };

  const handleOpenModal = (e, itemId) => {
    if (isPlayingGame == 1) {
      setMessage("Game is playing, please wait.");
      setOpenMessage(true);

      return;
    }

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
      setIsDeleteButton(1);
    } else {
      setPriceBet(0);
      setIsDeleteButton(0);
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
    e.preventDefault();
    if (priceBet <= 0) {
      setOpenMessage(true);
      setMessage("Number should be greater than 0.");

      return;
    }

    const dataBetAdd = {
      item_id: dataTemp.itemId,
      x: dataTemp.x,
      y: dataTemp.y,
      userId: user.current.id,
      username: user.current.name,
      money: priceBet,
    };

    let response = baucuaApi
      .addbet(dataBetAdd)
      .then((response) => {
        let data = response.data;
        let newMoney = data.money;
        dispatch(updateMoney({ money: newMoney }));
      })
      .catch(function (error) {
        if (error.response) {
          if (error.response.status == 400) {
            setOpenMessage(true);
            setMessage(error.response.data.message);

            return;
          }
        }
      });

    setDataTemp({});
    setOpenBet(false);
    setPriceBet(0);
  };

  const handleDeleteBet = () => {
    let itemId = dataTemp.itemId;
    let userId = dataTemp.userId;

    baucuaApi
      .deletebet({ item_id: itemId, user_id: userId })
      .then((response) => {
        let money = response.data.money;
        dispatch(updateMoney({ money: money }));
        setOpenBet(false);
      });
  };

  // const handleBet = (e) => {
  //   if (priceBet <= 0) {
  //     setOpenMessage(true);
  //     setMessage("Number should be greater than 0.");

  //     return;
  //   }

  //   let key = getKeyBetByItemAndUserId(dataTemp.itemId);
  //   if (typeof key != "undefined") {
  //     //case edit
  //     dataBet[key].priceBet = priceBet;
  //     dataBet[key].x = dataTemp.x;
  //     dataBet[key].y = dataTemp.y;
  //     setDataBet(dataBet);
  //   } else {
  //     //case new
  //     const dataBetAppend = [
  //       {
  //         itemId: dataTemp.itemId,
  //         x: dataTemp.x,
  //         y: dataTemp.y,
  //         userId: user.current.id,
  //         username: user.current.name,
  //         priceBet: priceBet,
  //       },
  //     ];

  //     setDataBet((dataBet) => [...dataBet, ...dataBetAppend]);
  //   }

  //   setDataTemp({});
  //   setOpenBet(false);
  //   setPriceBet(0);
  // };

  const handleChange = (e) => {
    setPriceBet(parseInt(e.target.value));
  };

  return (
    <Master>
      <Grid container spacing={2}>
        <Grid item={true} xs={12} sm={8} md={8} lg={8}>
          <h2 className="header-content">Game</h2>
          <Grid className="items" container xs={12}>
            {items?.baucua.map((element, index) => (
              <Grid
                className="grid-image-content"
                item={true}
                xs={6}
                sm={6}
                md={4}
                lg={4}
                key={index}
                onClick={(event) => handleOpenModal(event, element.id)}
              >
                <img
                  className="image-item"
                  id={"image-item-" + element.id}
                  src={configs.url + element.image}
                  alt={element.name}
                ></img>
                {RenderDataBet(element.id)}
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid
          item={true}
          xs={12}
          sm={4}
          md={4}
          lg={4}
          className="right-content"
        >
          <h2 className="header-content">Results</h2>
          <Grid className="results" container xs={12}>
            <RenderResults></RenderResults>
            {user.current.email == "quang.chau@monimedia.com" ? (
              <Grid className="group-button" item xs={12}>
                <Button
                  type="button"
                  disabled={isPlayingGame == 1 ? "disabled" : ""}
                  onClick={handleRandom}
                  variant="contained"
                >
                  Start
                </Button>
                <Button
                  type="button"
                  disabled={isPlayingGame == 0 ? "disabled" : ""}
                  onClick={handleStopRandom}
                  variant="contained"
                >
                  Stop
                </Button>
              </Grid>
            ) : (
              ""
            )}
            {table(topPlayer)}
          </Grid>
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
          <form>
            <DialogContent>
              <TextField
                id="number"
                type="number"
                onChange={handleChange}
                value={priceBet.toString()}
              />
            </DialogContent>
            <DialogActions>
              {isDeleteButton ? (
                <Button
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteBet}
                >
                  Delete
                </Button>
              ) : (
                ""
              )}

              <Button type="submit" variant="contained" onClick={handleBet}>
                Bet
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Grid>
    </Master>
  );
};

export default Baucua;
