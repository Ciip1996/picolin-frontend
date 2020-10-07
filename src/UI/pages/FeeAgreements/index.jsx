// @flow
import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { useHistory } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import Modal from '@material-ui/core/Modal';

import type { Filters, FeeAgreementMode } from 'types/app';
import { showAlert } from 'actions/app';
import { saveFilters, getFilters } from 'services/FiltersStorage';
import API from 'services/API';
import { EntityRoutes } from 'routes/constants';

import { getErrorMessage } from 'UI/utils';
import { Endpoints } from 'UI/constants/endpoints';

import FeeAgreementPreviewModal from 'UI/components/molecules/FeeAgreementPreviewModal';
import FeeAgreementReValidateDrawer from 'UI/components/organisms/FeeAgreementReValidateDrawer';
import FeeAgreementDeclineDrawer from 'UI/components/organisms/FeeAgreementDeclineDrawer';
import FeeAgreementValidationDrawer from 'UI/components/organisms/FeeAgreementValidationDrawer';
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import ListPageLayout from 'UI/components/templates/ListPageLayout';
import TabsView from 'UI/components/templates/TabsView';
// import { getUserHighestRole } from 'services/Authorization';

import { PendingFeeTabIcon, SignedFeeTabIcon, SignaturesIcon } from 'UI/res';
import { drawerAnchor } from 'UI/constants/defaults';
// import { makeStyles } from '@material-ui/core/styles';
// import Modal from '@material-ui/core/Modal';
import HelloSign from 'hellosign-embedded';
import { getMuiTheme } from './styles';
import FADataTable from './FADataTable';

// function rand() {
//   return Math.round(Math.random() * 20) - 10;
// }

// function getModalStyle() {
//   const top = 50 + rand();
//   const left = 50 + rand();

//   return {
//     top: `${top}%`,
//     left: `${left}%`,
//     transform: `translate(-${top}%, -${left}%)`
//   };
// }

// const useStyles = makeStyles(theme => ({
//   paper: {
//     position: 'absolute',
//     width: 400,
//     backgroundColor: theme.palette.background.paper,
//     border: '2px solid #000',
//     boxShadow: theme.shadows[5],
//     padding: theme.spacing(2, 4, 3)
//   }
// }));

type FeeAgreementsListProps = {
  onShowAlert: any => void
};
const FeeAgreementsList = (props: FeeAgreementsListProps) => {
  const { onShowAlert } = props;
  const history = useHistory();

  const savedSearch = getFilters('feeagreements');
  const savedFilters = savedSearch?.filters;
  const savedParams = savedSearch?.params;

  const [filters, setFilters] = useState<Filters>(savedFilters || {});
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>([]);

  const [count, setCount] = useState(0);
  // const [FAPdfPreview, setFAPdfPreview] = useState(undefined);

  // const classes = useStyles();
  // const [modalStyle] = React.useState(getModalStyle);
  // const [open, setOpen] = React.useState(false);

  const [uiState, setUiState] = useState({
    keyword: savedParams?.keyword || '',
    orderBy: savedParams?.orderBy || '',
    direction: savedParams?.direction || '',
    page: savedParams?.page - 1 || 0,
    perPage: savedParams?.perPage || 10,
    isFeeAgreementValidationOpen: false,
    isFeeAgreementReValidationOpen: false,
    openedFeeAgreement: {},
    isFADeclinedOpen: false,
    isFAModifyOpen: false,
    isFeeAgreementPreviewModalOpen: false,
    FAPdfPreview: undefined
  });

  const client = new HelloSign({
    clientId: '3aea3931575b5f746a70001ff959c80f'
  });

  const url =
    'https://app.hellosign.com/editor/embeddedTemplate?token=40279ce15af7e97b6c5dec2a7ef2f23f&root_snapshot_guids%5B0%5D=2203a7d32c52981a40d168c5031bb20a7468ec6e&snapshot_access_guids%5B0%5D=70fb0b8c&guid=ebff59837751225b616acb9ff9fcb36467a74b7e';

  function edit() {
    client.open(url, { skipDomainVerification: true });
  }

  useEffect(() => {
    document.title = 'FortPac | FeeAgreements';
  }, []);

  const handleSearchChange = newKeyword => {
    setUiState(prevState => ({
      ...prevState,
      keyword: newKeyword,
      page: 0
    }));
  };

  const handleFilterChange = (name?: string, value: any) => {
    setFilters({ ...filters, [name]: value });
    setUiState(prevState => ({
      ...prevState,
      page: 0
    }));
  };

  const handleFilterRemove = (filterName: string) => {
    setFilters({ ...filters, [filterName]: null });
  };

  const handleResetFiltersClick = () => {
    setFilters({});
  };

  const handleTabChange = (event, newValue = 0) => {
    setSelectedTab(newValue);
  };

  const closeFeeAgreementPreviewModal = () => {
    setUiState(prevState => ({
      ...prevState,
      isFeeAgreementPreviewModalOpen: false
    }));
  };

  const validateFeeAgreement = async (id, status) => {
    // TODO: change the name of this method
    try {
      const response = await API.get(Endpoints.FeeAgreementById.replace(':id', id));
      if (response?.data) {
        handleToggleDrawerByStatusTitle(status.status, response.data);
      }
    } catch (error) {
      onShowAlert({
        severity: 'error',
        title: `Fee Agreement not validated`,
        body: getErrorMessage(error),
        autoHideDuration: 8000
      });
    }
  };

  const signFA = async (faId: number, internal_status: number) => {
    try {
      const response =
        (await internal_status) === 3 &&
        API.get(Endpoints.FeeAgreementSendReminder.replace(':id', faId));
      console.log(response); // TODO: finish implementation on new Fee Agreement
    } catch (error) {
      onShowAlert({
        severity: 'error',
        title: `Fee Agreement not Re-sent`,
        body: getErrorMessage(error),
        autoHideDuration: 8000
      });
    }
  };

  const handleCellClick = async (colData, cellMeta) => {
    // TODO: let the user know that the data is loading-...
    const { company_id, id, status, fee_agreement_status_id, pdf_url } = data[cellMeta?.rowIndex];
    if (colData?.props?.type !== 'button') {
      history.push(`${EntityRoutes.CompanyProfile.replace(':id', company_id)}?tab=feeagreements`);
    } else {
      selectedTab === 0 && validateFeeAgreement(id, status);
      selectedTab === 1 && signFA(id, fee_agreement_status_id);

      selectedTab === 2 &&
        !!pdf_url &&
        setUiState(prevState => ({
          ...prevState,
          isFeeAgreementPreviewModalOpen: true,
          FAPdfPreview: pdf_url
        }));
    }
  };

  const handleToggleDrawerByStatusTitle = (feeAgreementStatus: string, feeAgreement: Object) => {
    const DrawerByRole = {
      Declined: 'isFeeAgreementReValidationOpen',
      'Pending Validation': 'isFeeAgreementValidationOpen',
      'Pending Modification': 'isFAModifyOpen'
    };
    setUiState(prevState => ({
      ...prevState,
      openedFeeAgreement: feeAgreement,
      [DrawerByRole[feeAgreementStatus]]: true
    }));
  };

  const handleColumnSortClick = newSortDirection => {
    const { orderBy, direction } = newSortDirection;

    setUiState(prevState => ({
      ...prevState,
      orderBy,
      direction,
      page: 0
    }));
  };

  const handlePerPageClick = newPerPage => {
    setUiState(prevState => ({
      ...prevState,
      page: 0,
      perPage: newPerPage
    }));
  };

  const handlePageClick = newPage => {
    setUiState(prevState => ({
      ...prevState,
      page: newPage
    }));
  };

  const handleFAValidation = (validatedFA: Object) => {
    const filtered = data.filter(each => each.id !== validatedFA.id);
    setUiState(prevState => ({ ...prevState, isFeeAgreementValidationOpen: false }));
    setData(filtered);
  };

  const handleFADeclination = () => {
    setUiState(prevState => ({
      ...prevState,
      isFADeclinedOpen: true,
      isFeeAgreementValidationOpen: false
    })); // TODO: update table without need to refresh page
  };

  // const handleFAModification = () => {
  //   setUiState(prevState => ({
  //     ...prevState,
  //     isFADeclinedOpen: true,
  //     isFeeAgreementValidationOpen: false
  //   }));
  // };

  const toggleDrawer = (drawer: string, open: boolean) => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setUiState(prevState => ({ ...prevState, [drawer]: open }));
  };

  useEffect(() => {
    document.title = 'FortPAC | FeeAgreements';
  }, []);

  const mode: Array<FeeAgreementMode> = [];
  if (uiState.openedFeeAgreement) {
    uiState.openedFeeAgreement?.fee_percentage_change_requested && mode.push('fee');
    uiState.openedFeeAgreement?.guarantee_days_change_requested && mode.push('guarantee');
    uiState.openedFeeAgreement?.verbiage_changes_requested && mode.push('verbiage');
  }

  const getData = useCallback(async () => {
    try {
      const { userFilter, status, coach, company_id, creator_name_filter } = filters;

      let feeAgreementStatusId;
      if (selectedTab === 2) {
        feeAgreementStatusId = 3;
      } else if (selectedTab === 1) {
        feeAgreementStatusId = 1;
      }

      const params = {
        userFilter: userFilter && userFilter.id,
        keyword: uiState.keyword,
        orderBy: uiState.orderBy,
        page: uiState.page + 1,
        perPage: uiState.perPage,
        fee_agreement_status_id: feeAgreementStatusId || status?.id,
        coach_id: coach ? coach.id : null,
        company_id: company_id?.id,
        recruiter_id: creator_name_filter?.id
      };
      saveFilters('feeagreements', { filters, params });
      const queryParams = queryString.stringify(params);
      const response = await API.get(`${Endpoints.FeeAgreement}?${queryParams}`);

      // feeAgreementStatusId
      //   ? setData(
      //       response.data.data.filter(each => {
      //         return each.status.id === 2 || each.status.id === 4;
      //       })
      //     )
      setData(response?.data?.data);

      setCount(Number(response?.data?.total));
      setLoading(false);
    } catch (error) {
      onShowAlert({
        severity: 'error',
        title: 'Fee Agreements',
        autoHideDuration: 3000,
        body: getErrorMessage(error)
      });
    }
  }, [
    filters,
    onShowAlert,
    selectedTab,
    uiState.keyword,
    uiState.orderBy,
    uiState.page,
    uiState.perPage
  ]);

  useEffect(() => {
    setLoading(true);
    getData();
  }, [getData, selectedTab]);

  const tableProps = {
    selectedTab,
    uiState,
    filters, // filter filters select depending on tab
    theme: getMuiTheme,
    loading,
    data,
    count,
    page: uiState.page,
    rowsPerPage: uiState.perPage,
    searchText: uiState.keyword,
    handleFilterChange,
    onResetfiltersClick: handleResetFiltersClick,
    onCellClick: handleCellClick,
    onSearchTextChange: handleSearchChange,
    onColumnSortClick: handleColumnSortClick,
    onPerPageClick: handlePerPageClick,
    onPageClick: handlePageClick
  };

  const tabsProp = [
    {
      label: 'PENDING VALIDATIONS',
      icon: <PendingFeeTabIcon />,
      view: <FADataTable {...tableProps} />
    },
    {
      label: 'PENDING SIGNATURES',
      icon: <SignaturesIcon />,
      view: <FADataTable {...tableProps} />
    },
    {
      label: 'SIGNED FEE AGREEMENTS',
      icon: <SignedFeeTabIcon />,
      view: <FADataTable {...tableProps} />
    }
  ];
  const handleFeeAgreementPreviewError = args => {
    onShowAlert(args);
    setUiState(prevState => ({
      ...prevState,
      isFeeAgreementPreviewModalOpen: false,
      FAPdfPreview: undefined
    }));
  };

  // const handleOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  return (
    <ContentPageLayout>
      <ListPageLayout
        loading={loading}
        title="FEE AGREEMENTS"
        selector={null}
        filters={filters}
        onFilterRemove={handleFilterRemove}
        onFiltersReset={handleResetFiltersClick}
      >
        <TabsView
          content="start"
          selectedTab={selectedTab}
          onChangeTabIndex={handleTabChange}
          tabs={tabsProp}
          panelHeight="100%"
          fullHeight
        />
      </ListPageLayout>
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isFeeAgreementValidationOpen}
        onClose={toggleDrawer('isFeeAgreementValidationOpen', false)}
      >
        <div role="presentation">
          <FeeAgreementValidationDrawer
            mode={mode}
            handleClose={toggleDrawer('isFeeAgreementValidationOpen', false)}
            handleDeclination={handleFADeclination}
            feeAgreement={uiState.openedFeeAgreement}
            onResponse={onShowAlert}
            onFeeAgreementValidation={handleFAValidation}
            handleEvent={edit}
          />
        </div>
      </Drawer>
      {/* next is modify */}
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isFAModifyOpen}
        onClose={toggleDrawer('isFAModifyOpen', false)}
      >
        <div role="presentation">
          <FeeAgreementValidationDrawer
            mode={mode}
            handleClose={toggleDrawer('isFAModifyOpen', false)}
            handleDeclination={handleFADeclination}
            feeAgreement={uiState.openedFeeAgreement}
            onResponse={onShowAlert}
            onFeeAgreementValidation={handleFAValidation}
            isValidatingVerbiage
          />
        </div>
      </Drawer>
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isFADeclinedOpen}
        onClose={toggleDrawer('isFADeclinedOpen', false)}
      >
        <div role="presentation">
          <FeeAgreementDeclineDrawer
            feeAgreement={uiState.openedFeeAgreement}
            onResponse={onShowAlert}
            handleClose={toggleDrawer('isFADeclinedOpen', false)}
          />
        </div>
      </Drawer>
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isFeeAgreementReValidationOpen}
        onClose={toggleDrawer('isFeeAgreementReValidationOpen', false)}
      >
        <div role="presentation">
          <FeeAgreementReValidateDrawer
            feeAgreement={uiState.openedFeeAgreement || {}}
            handleFeeAgreementRevalidation={toggleDrawer('isFeeAgreementReValidationOpen', false)}
            onResponse={onShowAlert}
            handleClose={toggleDrawer('isFeeAgreementReValidationOpen', false)}
          />
        </div>
      </Drawer>
      <Modal
        open={uiState.isFeeAgreementPreviewModalOpen && !!uiState.FAPdfPreview}
        onClose={closeFeeAgreementPreviewModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <FeeAgreementPreviewModal
          handleAlert={handleFeeAgreementPreviewError}
          url={uiState.FAPdfPreview || ''}
          closeModal={closeFeeAgreementPreviewModal}
        />
      </Modal>
    </ContentPageLayout>
  );
};
const mapDispatchToProps = dispatch => {
  return {
    onShowAlert: alert => dispatch(showAlert(alert))
  };
};

export default connect(null, mapDispatchToProps)(FeeAgreementsList);
