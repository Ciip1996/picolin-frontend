// @flow
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import MUIDataTable from 'mui-datatables';
import { MuiThemeProvider } from '@material-ui/core/styles';

import API from 'services/API';
import { addFilter } from 'actions/dashboard';
import { nestTernary } from 'UI/utils';
import type { Filters } from 'types/app';
import { getMuiTheme } from './styles';
import Contents from './strings';

type SummaryTableProps = {
  url: string,
  downloadFileName: string,
  onFilterAdd: Filters => any
};

const filtersConfig = {
  Recruiter: { name: 'recruiter', paramName: 'recruiterId' },
  Coach: { name: 'coach', paramName: 'coachId' }
};

const SummaryTable = (props: SummaryTableProps) => {
  const { url, downloadFileName, onFilterAdd } = props;
  const language = localStorage.getItem('language');

  const height = 100;
  const [isLoading, setIsLoading] = useState(true);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [type, setType] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await API.get(url);
        if (response.status === 200 && response.data) {
          setColumns(response.data.columns);
          setRows(response.data.rows);
          if (response.data?.columns.length > 0) {
            setType(response.data.columns[1].label);
          }
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
      setIsLoading(false);
    };
    loadData();
  }, [url]);

  const handleClick = row => {
    const filterConfig = type && filtersConfig[type];
    onFilterAdd &&
      filterConfig &&
      onFilterAdd({ [filterConfig.name]: { paramName: filterConfig.paramName, value: row } });
  };

  const options = {
    filter: false,
    sort: true,
    search: false,
    print: false,
    download: true,
    downloadOptions: {
      filename: `${downloadFileName}.csv`
    },
    viewColumns: true,
    pagination: false,
    responsive: 'scrollFullHeight',
    rowHover: true,
    selectableRowsHeader: false,
    selectableRows: 'none',
    onRowClick: (rowData, rowMeta) => {
      handleClick(rows[rowMeta.rowIndex]);
    }
  };

  return isLoading ? (
    <Box display="flex" alignItems="center" justifyContent="center" style={{ minHeight: height }}>
      <CircularProgress />
    </Box>
  ) : (
    nestTernary(
      rows.length > 0,
      <MuiThemeProvider theme={getMuiTheme()}>
        <MUIDataTable columns={columns} data={rows} options={options} />
      </MuiThemeProvider>,
      <Box p="18px 32px">{Contents[language].data}</Box>
    )
  );
};

const mapDispatchToProps = dispatch => {
  return {
    onFilterAdd: filter => {
      dispatch(addFilter(filter));
    }
  };
};

const SummaryTableConnected = connect(null, mapDispatchToProps)(SummaryTable);

export default SummaryTableConnected;
