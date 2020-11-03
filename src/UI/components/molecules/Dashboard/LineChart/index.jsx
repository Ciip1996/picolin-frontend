// @flow
import React, { useState, useEffect } from 'react';
import Chart from 'react-google-charts';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import API from 'services/API';
import { nestTernary } from 'UI/utils';
import { colors } from 'UI/res';
import type { ChartProps } from 'types/dashboard';
import { GranularityFormats } from 'UI/constants/defaults';
import Contents from './strings';

const lineChartOptions = (horizontalTicks, dateFormat) => ({
  legend: { position: 'top' },
  pointSize: 10,
  vAxis: {
    baselineColor: colors.lightgrey,
    gridlines: {
      color: colors.lightgrey
    },
    textStyle: {
      color: colors.darkGrey
    }
  },
  hAxis: {
    ticks: horizontalTicks,
    baselineColor: colors.lightgrey,
    gridlines: {
      color: colors.lightgrey
    },
    textStyle: {
      color: colors.darkGrey
    },
    format: dateFormat,
    viewWindowMode: 'pretty'
  },
  chartArea: {
    width: '90%',
    height: '75%'
  }
});

const LineChart = (props: ChartProps) => {
  const { url } = props;
  const language = localStorage.getItem('language');

  const height = 400;
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [horizontalTicks, setHorizontalTicks] = useState([]);

  const [granularity, setGranularity] = useState('month');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await API.get(url);
        if (response.status === 200 && response.data?.data) {
          const preparedData = response.data.data.map(dataArray => {
            const [date, ...rest] = dataArray;
            return [new Date(date), ...rest];
          });
          const ticks = preparedData.map(series => series[0]);
          setHorizontalTicks(ticks);
          const [granId, grandDesc] = response.data.granularity;
          setGranularity(grandDesc === 'hour' && granId === 1 ? 'hour24' : grandDesc);
          setChartData([response.data.series, ...preparedData]);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
      setIsLoading(false);
    };
    loadData();
  }, [url]);

  return isLoading ? (
    <Box display="flex" alignItems="center" justifyContent="center" style={{ minHeight: height }}>
      <CircularProgress />
    </Box>
  ) : (
    nestTernary(
      chartData.length > 1,
      <Chart
        width="100%"
        height={`${height}px`}
        chartType="LineChart"
        loader={<div>{Contents[language].loader}</div>}
        data={chartData}
        options={lineChartOptions(horizontalTicks, GranularityFormats[granularity])}
      />,
      <>{Contents[language].data}</>
    )
  );
};

export default LineChart;
