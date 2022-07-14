import React, { Component, useEffect, useMemo, useState } from "react";
import Master from "./master";
import { useDispatch, useSelector } from "react-redux";
import { Grid } from "@mui/material";
import { Pie, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const Statistics = () => {
  const dispatch = useDispatch();

  const data = {
    labels: ["January", "February", "March", "April", "May"],
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
        data: [65, 59, 80, 81, 56],
      },
    ],
  };

  useEffect(() => {}, []);

  return (
    <Master>
      <Grid container>
        <Grid item xs={12}>
          <h2 className="header-content">Statistics</h2>
        </Grid>
        <Grid item xs={6}>
          <Pie
            data={data}
            options={{
              plugins: {
                title: {
                  display: true,
                  text: "Percent your bet",
                  position: "top",
                  padding: {
                    top: 30,
                    bottom: 20,
                  },
                  font: {
                    size: 20,
                  },
                },
                legend: {
                  display: true,
                  position: "bottom",
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Pie
            data={data}
            options={{
              plugins: {
                title: {
                  display: true,
                  text: "Percent your bet won",
                  position: "top",
                  padding: {
                    top: 30,
                    bottom: 20,
                  },
                  font: {
                    size: 20,
                  },
                },
                legend: {
                  display: true,
                  position: "bottom",
                },
              },
            }}
          />
        </Grid>
      </Grid>
    </Master>
  );
};

export default Statistics;
