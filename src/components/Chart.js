import React from "react";
import { Line } from "react-chartjs-2";
import { STATE_NAMES } from "../constants";

function Chart({
  data,
  state,
  duration,
  attribute,
  borderColor,
  backgroundColor,
  type,
}) {
  const numberFormatter = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 1,
  });

  const abbreviateNumber = (number) => {
    if (Math.abs(number) < 1e3) return numberFormatter.format(number);
    else if (Math.abs(number) >= 1e3 && Math.abs(number) < 1e5)
      return numberFormatter.format(number / 1e3) + "K";
    else if (Math.abs(number) >= 1e5 && Math.abs(number) < 1e7)
      return numberFormatter.format(number / 1e5) + "L";
    else if (Math.abs(number) >= 1e7 && Math.abs(number) < 1e10)
      return numberFormatter.format(number / 1e7) + "Cr";
    else if (Math.abs(number) >= 1e10 && Math.abs(number) < 1e14)
      return numberFormatter.format(number / 1e10) + "K Cr";
    else if (Math.abs(number) >= 1e14)
      return numberFormatter.format(number / 1e14) + "L Cr";
  };

  const buildChartData = () => {
    let chartData = [];
    if (duration === "all") {
      for (let date in data[state].dates) {
        let newDataPoint = {
          x: date,
          y: data[state]["dates"][date][type][attribute],
        };
        chartData.push(newDataPoint);
      }
      return chartData;
    } else {
      const dateDuration =
        new Date().getTime() - 1000 * 60 * 60 * 24 * 30 * duration;
      for (let date in data[state].dates) {
        const dataDate = new Date(
          date.split("-")[0],
          date.split("-")[1],
          date.split("-")[2]
        );
        if (dateDuration - dataDate.getTime() <= 0) {
          let newDataPoint = {
            x: date,
            y: data[state]["dates"][date][type][attribute],
          };
          chartData.push(newDataPoint);
        }
      }
      return chartData;
    }
  };

  // console.log("buildChartData", buildChartData(3));

  const options = {
    legend: {
      display: false,
    },
    elements: {},
    tooltips: {
      mode: "index",
      intersect: false,
    },
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            format: "YY-MM-DD",
            tooltipFormat: "ll",
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            callback: function (value, index, values) {
              return abbreviateNumber(value);
            },
          },
        },
      ],
    },
  };

  return (
    <Line
      data={{
        datasets: [
          {
            label: `confirmed total cases in ${STATE_NAMES[state]}`,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            data: buildChartData(),
          },
        ],
      }}
      options={options}
    />
  );
}

export default Chart;
