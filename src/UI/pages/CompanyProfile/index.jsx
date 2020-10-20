// @flow
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import queryString from 'query-string';

import { showAlert as showAlertAction, confirm as confirmAction } from 'actions/app';

/** Material Assets and Components */
import Drawer from '@material-ui/core/Drawer';
import Modal from '@material-ui/core/Modal';

import type { InfoLabel, EntityProfile } from 'types/app';

import {
  compensationFormatter,
  phoneFormatter,
  phoneNumberFormatter,
  getErrorMessage,
  getFeatureFlags
} from 'UI/utils';

/** Atoms, Components and Styles */
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import TabsView from 'UI/components/templates/TabsView';
import ActivityNotes from 'UI/components/organisms/ActivityNotes';
import FileUploader from 'UI/components/molecules/FileUploader';
import ProfileView from 'UI/components/templates/ProfileView';
import ActivityNoteForm from 'UI/components/organisms/ActivityNoteForm';
import CompanyEdit from 'UI/components/organisms/CompanyEdit';
import ProfileTabList from 'UI/components/organisms/ProfileTabList';
import HiringAuthorityDrawer from 'UI/components/organisms/HiringAuthorityDrawer';
import ReassignRecruiterForm from 'UI/components/organisms/ReassignRecruiter';
import RecruiterBar from 'UI/components/organisms/RecruiterBar';
import FeeAgreementDrawer from 'UI/components/organisms/FeeAgreementDrawer';
import FeeAgreementPreviewModal from 'UI/components/molecules/FeeAgreementPreviewModal';

import ProfilePageLayout from 'UI/components/templates/ProfilePageLayout';

import API from 'services/API';
import { Endpoints } from 'UI/constants/endpoints';
import { CompanyStatus } from 'UI/constants/status';

import { DateFormats, PageTitles, DefaultProfile, drawerAnchor } from 'UI/constants/defaults';

import {
  AttachmentsIcon,
  NotesIcon,
  ActivityLogIcon,
  HiringIcon,
  JobOrdersIcon,
  EmptyJobOrders,
  EmptyFeeAgreement,
  FeeAgreementTempIcon,
  colors
} from 'UI/components/molecules/ProductCard/node_modules/UI/res';

import { EntityRoutes } from 'routes/constants';
import { EntityType, entityTypes } from 'UI/constants/entityTypes';

import { FeatureFlags } from 'UI/constants/featureFlags';

const featureFlags = getFeatureFlags();

type CompanyProfileProps = {
  match: any,
  showAlert: any => void,
  showConfirm: any => void,
  location: any
};

const CompanyProfile = (props: CompanyProfileProps) => {
  const { match, location, showAlert, showConfirm } = props;
  const history = useHistory();

  useEffect(() => {
    document.title = PageTitles.CompanyProfile;
  });

  const companyId = match.params.id;
  const { tab } = queryString.parse(location.search);

  const [files, setFiles] = useState([]);
  const [activities, setActivities] = useState([]);
  const [notes, setNotes] = useState([]);
  const [hiringAuthorities, setHiringAuthorities] = useState([]);
  const [joborders, setJoborders] = useState([]);
  const [feeAgreements, setFeeAgreements] = useState([]);

  const [profile, setProfile] = useState<EntityProfile>(DefaultProfile);

  const [uiState, setUiState] = useState({
    isLoading: false,
    isEditOpen: false,
    isNoteOpen: false,
    isHAOpen: false,
    isHAEditingOpen: false,
    isReassignOpen: false,
    selectedHA: null,
    noteType: 'activity',
    selectedNote: null,
    isFeeAgreementOpen: false,
    isFeeAgreementPreviewModalOpen: false,
    filePreview: null
  });

  useEffect(() => {
    async function getProfile(id) {
      setUiState(prevState => ({ ...prevState, isLoading: true }));
      try {
        const response = await API.get(`${Endpoints.Companies}/${id}`);
        if (response.data) {
          setFiles(response.data.files);
          setActivities(response.data.activityLogs);
          setNotes(response.data.notes);
          setHiringAuthorities(response.data.hiringAuthorities);
          setFeeAgreements(response?.data?.feeAgreements || [{}]);
          setJoborders(response.data.jobOrders);
          setProfile(response.data);
        }
      } catch (err) {
        showAlert({
          severity: 'error',
          title: 'Company',
          autoHideDuration: 5000,
          body: getErrorMessage(err)
        });
      }
      setUiState(prevState => ({ ...prevState, isLoading: false }));
    }

    getProfile(companyId);
  }, [companyId, showAlert]);

  const handleAttachmentsChanged = attachments => {
    setFiles(attachments);
  };

  const handleChange = (event, newValue = 0) => {
    setSelectedTab(newValue);
  };

  const toggleDrawer = (drawer: string, open) => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setUiState(prevState => ({ ...prevState, [drawer]: open }));
  };

  const handleEditClick = () => {
    setUiState(prevState => ({ ...prevState, isEditOpen: true }));
  };

  const handleEditCompleted = updatedProfile => {
    setUiState(prevState => ({ ...prevState, isEditOpen: false }));
    setProfile(updatedProfile);
  };

  const handleEditClosed = () => {
    uiState.isEditOpen && setUiState(prevState => ({ ...prevState, isEditOpen: false }));
  };

  const handleNoteCompleted = (type: string, item: any, wasEditing: boolean) => {
    setUiState(prevState => ({ ...prevState, isNoteOpen: false, selectedNote: null }));
    if (type === 'activity') {
      setActivities(wasEditing ? updateItemCallback(item) : addItemCallback(item));
    } else {
      setNotes(wasEditing ? updateItemCallback(item) : addItemCallback(item));
    }
  };

  const addItemCallback = item => prevState => [item, ...prevState];
  const updateItemCallback = item => prevState =>
    prevState.map(currentItem => (currentItem.id !== item.id ? currentItem : item));

  const handleNoteClosed = () => {
    setUiState(prevState => ({ ...prevState, isNoteOpen: false, selectedNote: null }));
  };

  const handleActiviesNotesChange = (type: string, items: any[]) => {
    if (type === 'activity') {
      setActivities(items);
    } else {
      setNotes(items);
    }
  };

  const handleNewNoteClick = (type: string) => {
    setUiState(prevState => ({ ...prevState, noteType: type, isNoteOpen: true }));
  };

  const handleEditNoteClick = (type: string, item: any) => {
    setUiState(prevState => ({
      ...prevState,
      noteType: type,
      isNoteOpen: true,
      selectedNote: item
    }));
  };

  const handleNewHAClick = () => {
    setUiState(prevState => ({
      ...prevState,
      selectedHA: {
        specialty_id: profile?.specialty?.id,
        specialty: profile?.specialty,
        subspecialty_id: profile?.subspecialty?.id,
        subspecialty: profile?.subspecialty,
        id: null
      },
      isHAOpen: true,
      isHAEditingOpen: false
    }));
  };

  const handleEditHAClick = (item: any) => {
    setUiState(prevState => ({
      ...prevState,
      selectedHA: item,
      isHAOpen: true,
      isHAEditingOpen: true
    }));
  };

  const handleDeleteHAClick = (item: any) => {
    showConfirm({
      severity: 'warning',
      title: 'Please confirm',
      message: `Are you sure you want to delete this Hiring Authority?`,
      onConfirm: async ok => {
        if (!ok) {
          return;
        }
        try {
          const response = await API.delete(
            `${Endpoints.Companies}/${companyId}/${Endpoints.HiringAuthorities}/${item.id}`
          );
          if (response.status === 200) {
            setHiringAuthorities(hiringAuthorities.filter(each => each.id !== item.id));
            showAlert({
              severity: 'success',
              title: 'Awesome',
              body: 'The Hiring Authority was removed from this Company'
            });
          }
        } catch (error) {
          showAlert({
            severity: 'error',
            title: 'Error',
            body: getErrorMessage(error)
          });
        }
      }
    });
  };

  const handleHiringAuthorityCompleted = newHiringAuthority => {
    if (uiState.isHAEditingOpen) {
      setHiringAuthorities(prevState =>
        prevState.map(each => (each.id !== uiState.selectedHA?.id ? each : newHiringAuthority))
      );
    } else {
      setHiringAuthorities([...hiringAuthorities, newHiringAuthority]);
    }
    setUiState(prevState => ({ ...prevState, isHAOpen: false, selectedHA: null }));
  };

  const handleHiringAuthorityClosed = () => {
    setUiState(prevState => ({ ...prevState, isHAOpen: false, selectedHA: null }));
  };

  const handleNewJOClick = () => {
    history.push(`${EntityRoutes.JobOrderCreate}?companyId=${companyId}`);
  };

  const handleJOClick = (item: any) => {
    history.push(`${EntityRoutes.JobOrders}/profile/${item.id}`);
  };

  const handleEditJOClick = (item: any) => {
    history.push(`${EntityRoutes.JobOrders}/profile/${item.id}`);
  };

  const handleReassignClick = () => {
    setUiState(prevState => ({ ...prevState, isReassignOpen: true }));
  };

  const handleReassignCompleted = mainRecruiter => {
    setUiState(prevState => ({ ...prevState, isReassignOpen: false }));

    setProfile(prevState => ({
      ...prevState,
      recruiter: mainRecruiter || recruiter
    }));
  };

  const handleReassignClosed = () => {
    uiState.isReassignOpen && setUiState(prevState => ({ ...prevState, isReassignOpen: false }));
  };

  const handleFAClick = () => {
    if (feeAgreements.length > 0) {
      setUiState(prevState => ({ ...prevState, isFeeAgreementOpen: true }));
    } else {
      showAlert({
        severity: 'warning',
        title: 'Create Fee Agreement',
        autoHideDuration: 5000,
        body: 'You need at least one Hiring Authority in this company to create a Fee Agreement.'
      });
    }
  };

  const handleFAClose = () => {
    setUiState(prevState => ({ ...prevState, isFeeAgreementOpen: false }));
  };

  const { id, specialty, subspecialty, recruiter } = profile;

  const handleFACompleted = newFeeAgreement => {
    setFeeAgreements([...feeAgreements, newFeeAgreement]);
    setUiState(prevState => ({ ...prevState, isFeeAgreementOpen: false }));
  };

  const closeFeeAgreementPreviewModal = () => {
    setUiState(prevState => ({
      ...prevState,
      isFeeAgreementPreviewModalOpen: false
    }));
  };

  const openFeeAgreementFile = FA => {
    setUiState(prevState => ({
      ...prevState,
      isFeeAgreementPreviewModalOpen: true,
      filePreview: FA.pdf_url
    }));
    // FA.pdf_url && window.open(FA.pdf_url, '_blank'); // TODO: display the pdf on the pdf viewer
  };

  const hasLoaded = !!id;

  const faInfoLabelsResolver = (item: any): InfoLabel[] => {
    return [
      {
        title: 'Status',
        description: item?.feeAgreementStatus?.group?.title || 'Unavailable',
        color: item?.feeAgreementStatus?.group?.style_class_name || colors.inactive
      },
      {
        title: 'Fee %',
        description: item?.fee_percentage
      },
      { title: 'Days Under Guarranty', description: item?.guarantee_days },
      {
        title: 'Hiring Authority',
        description: item?.hiringAuthority?.full_name
      },
      {
        title: 'Date Signed',
        description: item.signed_date
          ? moment(item?.signed_date).format(DateFormats.SimpleDate)
          : 'N/A'
      },
      {
        title: 'Validated by',
        description: item?.production_director_validator
      }
    ];
  };

  const haInfoLabelsResolver = (item: any): InfoLabel[] => [
    {
      title: 'Full Name',
      description: item?.full_name
    },
    { title: 'Title', description: item?.title },
    { title: 'Phone', description: phoneNumberFormatter(item?.work_phone) },
    { title: 'Email', description: item?.work_email },
    {
      title: 'Other Phone',
      description: item?.personal_phone && phoneNumberFormatter(item.personal_phone)
    },
    { title: 'Other Email', description: item?.personal_email }
  ];

  const joInfoLabelsResolver = (item: any): InfoLabel[] => [
    { title: 'Title', description: item?.title },
    {
      title: 'Industry: Specialty',
      description: `${item.specialty?.title}${
        item.subspecialty ? `: ${item.subspecialty?.title}` : ''
      }`
    },
    {
      title: 'Hiring Authority',
      description: item?.hiringAuthorities?.length > 0 ? item.hiringAuthorities[0].full_name : ''
    },
    { title: 'Funcional Title', description: item?.position?.title },
    {
      title: 'Compensation Range',
      description:
        item?.whiteSheet &&
        compensationFormatter(
          item.whiteSheet.maximum_compensation,
          item.whiteSheet.good_compensation,
          item.whiteSheet.minimum_compensation
        )
    },
    {
      title: 'Location',
      description: `${item.address?.city.title}, ${item.address?.city.state.slug}`
    }
  ];

  const tabsProp = [
    {
      id: 'joborders',
      label: 'Job Orders.',
      icon: <JobOrdersIcon />,
      view: (
        <ProfileTabList
          loading={!hasLoaded}
          items={joborders}
          cardDefinition={{
            showAvatar: true,
            infoLabelsResolver: joInfoLabelsResolver
          }}
          addButtonText="ADD JOB ORDER"
          emptyPlaceholderTitle="No Job Orders to show"
          emptyPlaceholderSubtitle="To add a Job Order, click on the button below me."
          emptyStateImage={EmptyJobOrders}
          onNewClick={handleNewJOClick}
          onItemClick={handleJOClick}
          onEditClick={handleEditJOClick}
        />
      )
    },
    {
      id: 'feeagreements',
      label: 'Fee Agreement',
      visible: featureFlags.includes(FeatureFlags.FeeAgreement),
      icon: <FeeAgreementTempIcon />,
      view: (
        <ProfileTabList
          loading={!hasLoaded}
          items={feeAgreements}
          cardDefinition={{
            showAvatar: false,
            infoLabelsResolver: faInfoLabelsResolver
          }}
          addButtonText="CREATE ONE"
          emptyPlaceholderTitle="No fee agreement uploaded yet "
          emptyPlaceholderSubtitle="To upload one, click on the button below me."
          emptyStateImage={EmptyFeeAgreement}
          onNewClick={handleFAClick}
          onItemClick={openFeeAgreementFile}
        />
      )
    },
    {
      id: 'ha',
      label: 'Hiring A.',
      icon: <HiringIcon />,
      view: (
        <ProfileTabList
          loading={!hasLoaded}
          items={hiringAuthorities}
          cardDefinition={{
            showAvatar: false,
            infoLabelsResolver: haInfoLabelsResolver
          }}
          addButtonText="HIRING AUTHORITY"
          emptyPlaceholderTitle="No Hiring Authorities to show"
          emptyPlaceholderSubtitle="To assign a Hiring Authority, click on the button below me."
          onDeleteClick={handleDeleteHAClick}
          onNewClick={handleNewHAClick}
          onItemClick={handleEditHAClick}
          onEditClick={handleEditHAClick}
        />
      )
    },
    {
      id: 'activities',
      label: 'Activity Log',
      icon: <ActivityLogIcon />,
      view: (
        <ActivityNotes
          loading={!hasLoaded}
          items={activities}
          type="activity"
          endpoint={`${Endpoints.Companies}/${companyId}/${Endpoints.Activities}`}
          onItemsChange={handleActiviesNotesChange}
          onNewClick={handleNewNoteClick}
          onEditClick={handleEditNoteClick}
          onItemClick={handleEditNoteClick}
        />
      )
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: <NotesIcon />,
      view: (
        <ActivityNotes
          loading={!hasLoaded}
          items={notes}
          type="note"
          endpoint={`${Endpoints.Companies}/${companyId}/${Endpoints.Notes}`}
          onItemsChange={handleActiviesNotesChange}
          onNewClick={handleNewNoteClick}
          onEditClick={handleEditNoteClick}
          onItemClick={handleEditNoteClick}
        />
      )
    },
    {
      id: 'files',
      label: 'Attachments',
      icon: <AttachmentsIcon />,
      view: (
        <FileUploader
          loading={!hasLoaded}
          maxNumberOfFiles={1}
          files={files}
          endpoint={`${Endpoints.Companies}/${companyId}/${Endpoints.Files}`}
          fileNameField="file_name"
          mode="list"
          alwaysReplace
          onAttachmentsChanged={handleAttachmentsChanged}
        />
      )
    }
  ];

  const infoLabels = [
    {
      title: 'Industry: Specialty',
      description: specialty ? `${specialty?.industry?.title}: ${specialty?.title}` : null
    },
    { title: 'Subspecialty', description: subspecialty?.title },
    { title: 'Website', description: profile?.website },
    { title: 'Phone', description: phoneFormatter(profile?.contact?.phone) },
    { title: 'Ext', description: profile?.contact?.ext },
    { title: 'Email', description: profile?.email, cropped: true },
    { title: 'State', description: profile?.address?.city?.state?.title },
    { title: 'City', description: profile?.address?.city?.title },
    { title: 'Zip Code', description: profile?.address?.zip },
    { title: 'Address', description: profile?.address?.address }
  ];

  const initialTab = tabsProp.findIndex(each => each.id === tab);
  const [selectedTab, setSelectedTab] = useState(initialTab > -1 ? initialTab : 0);

  return (
    <>
      <ContentPageLayout>
        <ProfilePageLayout
          isLoading={uiState.isLoading}
          title="Company"
          profileView={
            <ProfileView
              name={profile?.name || ''}
              profile={profile}
              infoLabels={infoLabels}
              sheet={{
                companyType: profile.signed
                  ? { ...CompanyStatus.signed }
                  : { ...CompanyStatus.unsigned }
              }}
              type="company"
              onEditClick={handleEditClick}
              onReassignClick={handleReassignClick}
            />
          }
          recruiterBar={
            <RecruiterBar
              item={profile}
              entityType={entityTypes.find(each => each.id === EntityType.Company)}
              isLoading={uiState.isLoading}
              onAssignClick={handleReassignClick}
            />
          }
          tabsView={
            hasLoaded && (
              <TabsView selectedTab={selectedTab} onChangeTabIndex={handleChange} tabs={tabsProp} />
            )
          }
        />
      </ContentPageLayout>
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isNoteOpen}
        onClose={toggleDrawer('isNoteOpen', false)}
      >
        <div role="presentation">
          <ActivityNoteForm
            type={uiState.noteType}
            endpoint={`${Endpoints.Companies}/${companyId}`}
            onNoteCompleted={handleNoteCompleted}
            onNoteClosed={handleNoteClosed}
            selectedItem={uiState.selectedNote}
          />
        </div>
      </Drawer>
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isEditOpen}
        onClose={toggleDrawer('isEditOpen', false)}
      >
        <div role="presentation">
          <CompanyEdit
            company={profile}
            onEditCompleted={handleEditCompleted}
            onEditClosed={handleEditClosed}
          />
        </div>
      </Drawer>
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isHAOpen}
        onClose={toggleDrawer('isHAOpen', false)}
      >
        <div role="presentation">
          <HiringAuthorityDrawer
            type={EntityType.Company}
            isEditing={uiState.isHAEditingOpen}
            companyId={companyId}
            hiringAuthority={uiState.selectedHA}
            endpoint={
              uiState.isHAEditingOpen
                ? `${Endpoints.Companies}/${companyId}/${Endpoints.HiringAuthorities}/${uiState
                    ?.selectedHA?.id || ''}`
                : `${Endpoints.Companies}/${companyId}/${Endpoints.HiringAuthorities}`
            }
            onHACompleted={handleHiringAuthorityCompleted}
            onHAClosed={handleHiringAuthorityClosed}
          />
        </div>
      </Drawer>
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isReassignOpen}
        onClose={toggleDrawer('isReassignOpen', false)}
      >
        <div role="presentation">
          <ReassignRecruiterForm
            baseEndpoint={`${Endpoints.Companies}`}
            item={profile}
            entityType={entityTypes.find(each => each.id === EntityType.Company)}
            onReassignCompleted={handleReassignCompleted}
            onReassignClosed={handleReassignClosed}
          />
        </div>
      </Drawer>
      {featureFlags.includes(FeatureFlags.FeeAgreement) && (
        <Drawer
          anchor={drawerAnchor}
          open={uiState.isFeeAgreementOpen}
          onClose={toggleDrawer('isFeeAgreementOpen', false)}
        >
          <div role="presentation">
            <FeeAgreementDrawer
              onFAClosed={handleFAClose}
              hiringAuthorities={hiringAuthorities}
              onFACompleted={handleFACompleted}
              endpoint={`${Endpoints.Companies}/${companyId}/${Endpoints.FeeAgreement}`}
              company={profile}
            />
          </div>
        </Drawer>
      )}
      <Modal
        open={uiState.isFeeAgreementPreviewModalOpen}
        onClose={closeFeeAgreementPreviewModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <FeeAgreementPreviewModal
          handleAlert={showAlert}
          url={uiState?.filePreview || ''}
          closeModal={closeFeeAgreementPreviewModal}
        />
      </Modal>
    </>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    showAlert: alert => dispatch(showAlertAction(alert)),
    showConfirm: confirmation => dispatch(confirmAction(confirmation))
  };
};

export default connect(null, mapDispatchToProps)(CompanyProfile);
