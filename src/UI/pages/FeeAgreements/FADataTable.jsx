// @flow
import React from 'react';
import NumberFormat from 'react-number-format';
import moment from 'moment';

import { FormControl } from '@material-ui/core';
// import { nestTernary } from 'UI/utils';

import ActionButton from 'UI/components/atoms/ActionButton';
import Typography from '@material-ui/core/Typography';
import DataTable from 'UI/components/organisms/DataTable';
import ColorIndicator from 'UI/components/atoms/ColorIndicator';
import AutocompleteSelect, {
  statusStartAdornment
} from 'UI/components/molecules/AutocompleteSelect';
import { Endpoints } from 'UI/constants/endpoints';

import { getUserHighestRole } from 'services/Authorization';
import type { UserRole } from 'types/app';

import { useActionButtonStyles } from './styles';

const Role = {
  Recruiter: 1,
  Coach: 2,
  Operations: 3,
  'Regional Director': 4,
  'Production Director': 5
};

const userRole: UserRole = getUserHighestRole();

const FADataTable = (props: any) => {
  const { handleFilterChange, uiState, filters, validations, selectedTab, ...rest } = props;

  const classes = useActionButtonStyles();

  // hide: signed Date, validated date, validated by , regional director
  const columnItems = [
    { display: true, id: 0, name: 'status' },
    { display: true, id: 1, name: 'company_name' },
    { display: true, id: 2, name: 'id' },
    { display: true, id: 3, name: 'fee_percentage' },
    { display: true, id: 4, name: 'guarantee_days' },
    { display: false, id: 5, name: 'signed_date' },
    { display: false, id: 6, name: 'validate_date' },
    { display: false, id: 7, name: 'production_director_validator' },
    {
      display: userRole.id !== Role['Regional Director'] && selectedTab !== 2,
      id: 8,
      name: 'regional_director_name'
    },
    {
      display: userRole.id !== Role.Coach && userRole.id !== Role.Recruiter,
      id: 9,
      name: 'coach_name'
    },
    { display: userRole.id !== Role.Recruiter, id: 10, name: 'creator_name' },
    { display: selectedTab !== 2, id: 11, name: 'status' },
    { display: true, id: 12, name: 'action' }
  ];

  const handleColumnDisplayClick = newColumnDisplay => {
    const { column, display } = newColumnDisplay;
    const index = columnItems.findIndex(item => item.name === column);
    columnItems[index].display = display;
  };

  const getSortDirections = (orderBy: string, direction: string) =>
    columnItems.map(item => (item.name === orderBy ? direction : 'none'));

  const sortDirection = getSortDirections(uiState?.orderBy, uiState?.direction);

  const RowActionButton = (value, params) => {
    // console.log(params);
    const { current_responsible_role_id, fee_agreement_status_id } = params.rowData[0];

    const RowActionButtonShowCases = {
      // storage an array of Fee agreement status by role
      // for example Recruiter should show the button only if the status id is 6 or 7
      Recruiter: [1],
      Coach: [1],
      Operations: [6],
      'Regional Director': [4],
      'Production Director': [5, 6] // TODO: request team back to get id for this state
    };

    // TODO: validate of why is it breaking

    const getTextButton = (role: string) => {
      if (selectedTab === 0) {
        switch (role) {
          case 'Recruiter':
            return (
              RowActionButtonShowCases[userRole.title].includes(current_responsible_role_id) &&
              'RE-VALIDATE'
            );

          case 'Operations':
            return (
              RowActionButtonShowCases[userRole.title].includes(current_responsible_role_id) &&
              'MODIFY'
            );

          case 'Regional Director':
            return (
              RowActionButtonShowCases[userRole.title].includes(current_responsible_role_id) &&
              'VALIDATE'
            );

          case 'Production Director':
            return (
              RowActionButtonShowCases[userRole.title].includes(current_responsible_role_id) &&
              'VALIDATE'
            );
          default:
            return null;
        }
      } else if (selectedTab === 1) {
        switch (fee_agreement_status_id) {
          case 3:
            return (
              RowActionButtonShowCases[userRole.title].includes(current_responsible_role_id) &&
              'SEND'
            );
          case 8:
            return (
              RowActionButtonShowCases[userRole.title].includes(current_responsible_role_id) &&
              'RE-SEND'
            );
          default:
            return null;
        }
      } else if (selectedTab === 2) {
        return 'VIEW';
      }
      return '';
    };

    const textButton = getTextButton(userRole.title);

    return (
      <ActionButton
        disabled={!textButton}
        className={classes.smallRowActionButton}
        text={textButton || ''}
      />
    );
  };

  const sharedOptions = {
    filter: true,
    sort: true,
    filterType: 'custom'
  };

  const customFilterComponents = [
    <AutocompleteSelect
      name="status"
      selectedValue={filters?.status}
      url={`${Endpoints.FeeAgreement}/${Endpoints.FeeAgreementStatuses}`}
      placeholder="Status"
      onSelect={handleFilterChange}
      renderOption={value => {
        return (
          <>
            {statusStartAdornment(value.style_class_name)}
            <Typography noWrap style={{ marginLeft: '4px' }}>
              {value.title}
            </Typography>
          </>
        );
      }}
      startAdornment={statusStartAdornment(filters?.status?.style_class_name)}
    />,
    <AutocompleteSelect
      name="company_id"
      selectedValue={filters?.company_id}
      placeholder="Company"
      displayKey="name"
      typeahead
      typeaheadParams={{ perPage: 25 }}
      typeaheadLimit={25}
      getOptionLabel={option => `${option?.name} - ${option?.city} - ${option?.specialty_title}`}
      getOptionSelected={(option, value) => option.id === value.id}
      url={Endpoints.Companies}
      onSelect={handleFilterChange}
      groupBy={option => option?.state}
    />,
    <AutocompleteSelect name="id_filter" placeholder="Fee Nº" onSelect={handleFilterChange} />,
    <AutocompleteSelect name="fee_percentage" placeholder="Fee %" onSelect={handleFilterChange} />,
    <AutocompleteSelect
      name="gurantee_days"
      placeholder="Guarantee Days"
      onSelect={handleFilterChange}
    />,
    <AutocompleteSelect
      name="action_button"
      placeholder="to validate"
      onSelect={handleFilterChange}
    />,
    <AutocompleteSelect
      name="validated_by_filter"
      placeholder="Validated by"
      url=""
      selectedValue={filters?.position}
      onSelect={handleFilterChange}
    />,
    <AutocompleteSelect
      name="regional_director_name"
      placeholder="Regional Director"
      onSelect={handleFilterChange}
    />,
    <AutocompleteSelect name="coach_name" placeholder="Coach" onSelect={handleFilterChange} />,
    <AutocompleteSelect
      name="creator_name_filter"
      placeholder="Recruiter"
      url={`${Endpoints.Recruiters}/myTeam`}
      selectedValue={filters?.creator_name_filter}
      displayKey="full_name"
      onSelect={handleFilterChange}
    />
  ];

  const CustomFilterComponent = ({ index }) => {
    return <FormControl>{customFilterComponents[index]}</FormControl>;
  };

  const columns = [
    {
      name: 'status',
      label: 'Status',
      options: {
        ...sharedOptions,
        sortDirection: sortDirection[0],
        display: columnItems[0].display,
        customBodyRender: value => {
          return (
            value && (
              <>
                <ColorIndicator color={value.style_class_name} width={12} height={12} />
                {` ${value.status}`}
              </>
            )
          );
        },
        filterOptions: {
          display: () => <CustomFilterComponent index={0} />
        }
      }
    },
    {
      name: 'company_name',
      label: 'Company',
      options: {
        ...sharedOptions,
        sortDirection: sortDirection[1],
        display: columnItems[1].display,
        filterOptions: {
          display: () => <CustomFilterComponent index={1} />
        }
      }
    },
    {
      name: 'id',
      label: 'Fee Nº',
      options: {
        ...sharedOptions,
        sortDirection: sortDirection[2],
        display: columnItems[2].display,
        filterOptions: {
          display: () => <CustomFilterComponent index={2} />
        }
      }
    },
    {
      name: 'fee_percentage',
      label: 'Fee %',
      options: {
        ...sharedOptions,
        sortDirection: sortDirection[3],
        display: columnItems[3].display,
        customBodyRender: value => {
          return (
            value && (
              <span>
                <NumberFormat
                  suffix="%"
                  displayType="text"
                  thousandSeparator=","
                  decimalSeparator="."
                  value={value}
                />
              </span>
            )
          );
        },
        filterOptions: {
          display: () => <CustomFilterComponent index={3} />
        }
      }
    },
    {
      name: 'guarantee_days',
      label: (
        <>
          Guarantee
          <br />
          Days
        </>
      ),
      options: {
        ...sharedOptions,
        sortDirection: sortDirection[4],
        display: columnItems[4].display,
        filterOptions: {
          display: () => <CustomFilterComponent index={4} />
        }
      }
    },
    {
      name: 'signed_date',
      label: 'Signed Date',
      options: {
        ...sharedOptions,
        sortDirection: sortDirection[5],
        display: columnItems[5].display,
        customBodyRender: value => {
          return <span>{value ? moment(value).format('MM/DD/YYYY') : 'Date not available'}</span>;
        },
        filterOptions: {
          display: () => <CustomFilterComponent index={5} />
        }
      }
    },
    {
      name: 'validate_date',
      label: 'Validated Date',
      options: {
        ...sharedOptions,
        sortDirection: sortDirection[6],
        display: columnItems[6].display,
        customBodyRender: value => {
          return <span>{moment(value).format('MM/DD/YYYY')}</span>;
        }
      }
    },
    {
      name: 'production_director_validator',
      label: 'Validated by',
      options: {
        ...sharedOptions,
        sortDirection: sortDirection[7],
        display: columnItems[7].display,
        filterOptions: {
          display: () => <CustomFilterComponent index={5} />
        }
      }
    },

    {
      name: 'regional_director_name',
      label: 'Regional Director',
      options: {
        ...sharedOptions,
        sortDirection: sortDirection[8],
        display: columnItems[8].display,
        filterOptions: {
          display: () => <CustomFilterComponent index={6} />
        }
      }
    },
    {
      name: 'coach_name',
      label: 'Coach',
      options: {
        ...sharedOptions,
        sortDirection: sortDirection[9],
        display: columnItems[9].display,
        filterOptions: {
          display: () => <CustomFilterComponent index={7} />
        }
      }
    },
    {
      name: 'creator_name',
      label: 'Recruiter',
      options: {
        ...sharedOptions,
        sortDirection: sortDirection[10],
        display: columnItems[10].display,
        filterOptions: {
          display: () => <CustomFilterComponent index={8} />
        }
      }
    },
    {
      name: 'status',
      label: 'Responsible',
      options: {
        ...sharedOptions,
        sortDirection: sortDirection[11],
        display: columnItems[11].display,
        customBodyRender: value => {
          return value && value.current_responsible;
        }
      }
    },
    {
      name: 'Action',
      label: '',
      options: {
        ...sharedOptions,
        sortDirection: sortDirection[12],
        display: columnItems[12].display,
        customBodyRender: RowActionButton,
        filterOptions: {
          display: () => <CustomFilterComponent index={9} />
        }
      }
    }
  ];

  return (
    <DataTable
      columns={columns}
      onColumnDisplayClick={handleColumnDisplayClick}
      selectableRows="none"
      {...rest}
    />
  );
};

export default FADataTable;
