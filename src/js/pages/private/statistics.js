import React, { Component, useEffect, useMemo, useState } from "react";
import Master from "./master";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Pie, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getFilters, getStatistics } from "../../slices/baucuaReducer";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const Statistics = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [dataChart, setDataChart] = useState();
  const [keyChart, setKeyChart] = useState();
  const [dataBets, setDataBets] = useState();
  const [dataUsers, setDataUsers] = useState();
  const [dataItem, setDataItem] = useState();
  const [filters, setFilters] = useState({
    userId: user.current.id,
    itemId: 0,
  });

  useEffect(() => {
    dispatch(getFilters()).then((res) => {
      setDataUsers(res.payload.users);
      setDataItem(res.payload.items);
    });
  }, []);

  useEffect(() => {
    let dataRequest = {
      user_id: filters.userId,
      item_id: filters.itemId,
    };
    dispatch(getStatistics(dataRequest)).then((res) => {
      setDataBets(res.payload.bets);
      setDataChart(Object.values(res.payload.items));
      setKeyChart(Object.keys(res.payload.items));
    });
  }, [filters]);

  const handleChangeUsers = (event) => {
    setFilters((filters) => {
      let newFilters = Object.assign({}, filters);
      newFilters.userId = event.target.value;

      return newFilters;
    });
  };

  const handleChangeItems = (event) => {
    setFilters((filters) => {
      let newFilters = Object.assign({}, filters);
      newFilters.itemId = event.target.value;

      return newFilters;
    });
  };

  const data = {
    labels: keyChart,
    datasets: [
      {
        label: "Rainfall",
        backgroundColor: [
          "#B21F00",
          "#C9DE00",
          "#2FDE00",
          "#00A6B4",
          "#6800B4",
        ],
        hoverBackgroundColor: [
          "#501800",
          "#4B5000",
          "#175000",
          "#003350",
          "#35014F",
        ],
        data: dataChart,
      },
    ],
  };

  return (
    <Master>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <h1 className="header-content">Statistics</h1>
        </Grid>
        <Grid item xs={12} sm={5} md={5} lg={5} className={"header-statistic"}>
          <h1 className="header-latest-bets">The item number has appeared</h1>
          <Pie
            data={data}
            height="200px"
            width="200px"
            options={{
              plugins: {
                legend: {
                  display: true,
                  position: "bottom",
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={7} md={7} lg={7} className={"header-statistic"}>
          <h1 className="header-latest-bets">Bets</h1>
          <Grid container xs={12} spacing={3}>
            <Grid item xs={6} sm={3} md={3} lg={3}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Users</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={filters.userId}
                  label="Users"
                  onChange={handleChangeUsers}
                >
                  {dataUsers?.map((element, index) => (
                    <MenuItem value={element.id}>{element.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={3} md={3} lg={3}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Items</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={filters.itemId ?? 0}
                  label="Items"
                  onChange={handleChangeItems}
                >
                  <MenuItem value={0}>Select All</MenuItem>
                  {dataItem?.map((element, index) => (
                    <MenuItem value={element.id}>{element.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table
              sx={{ width: "100%" }}
              size="small"
              className="bet-results"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "20%", whiteSpace: "nowrap" }}>
                    <strong>Game</strong>
                  </TableCell>
                  <TableCell style={{ width: "20%", whiteSpace: "nowrap" }}>
                    <strong>Item</strong>
                  </TableCell>
                  <TableCell style={{ width: "20%", whiteSpace: "nowrap" }}>
                    <strong>Money bet</strong>
                  </TableCell>
                  <TableCell style={{ width: "40%", whiteSpace: "nowrap" }}>
                    <strong>Time</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataBets?.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell>{row.game_id}</TableCell>
                    <TableCell>{row.baucua.name}</TableCell>
                    <TableCell>{row.money_bet}</TableCell>
                    <TableCell>{row.created_at}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Master>
  );
};

export default Statistics;
