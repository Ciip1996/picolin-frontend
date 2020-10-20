// @flow
import React, { useState, useEffect } from 'react';
import Chart from 'react-google-charts';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import API from 'services/API';
import { nestTernary } from 'UI/utils';
import { colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';

const columnChartOptions = {
  legend: { position: 'none' },
  chartArea: {
    width: '90%',
    height: '80%'
  },
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
    textStyle: {
      color: colors.darkGrey
    }
  }
};

type ChartProps = {
  url: string,
  columns: any[]
};

const ColumnChart = (props: ChartProps) => {
  const { url, columns } = props;
  const height = 300;
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await API.get(url);
        if (response.status === 200 && response.data) {
          setChartData([columns, ...response.data]);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
      setIsLoading(false);
    };
    loadData();
  }, [url, columns]);

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
        chartType="ColumnChart"
        loader={<div>Loading Chart</div>}
        data={chartData}
        options={columnChartOptions}
      />,
      <>There is no data with the selected filters</>
    )
  );
};

export default ColumnChart;
