// @flow
import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { useHistory } from 'react-router-dom';

/** Material Assets and Components */
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

/** Atoms, Components and Styles */
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import TabsView from 'UI/components/templates/TabsView';

import API from 'services/API';
import { useAccountability } from 'hooks/accountability';
import { getCurrentUser } from 'services/Authentication';
import { Endpoints } from 'UI/constants/endpoints';
import { EntityRoutes } from 'routes/constants';
import { EntityType, entityTypes } from 'UI/constants/entityTypes';

import { PageTitles, DefaultProfile, drawerAnchor } from 'UI/constants/defaults';
import { showAlert as showAlertAction, confirm as confirmAction } from 'actions/app';

import {
  AttachmentsIcon,
  HiringIcon,
  NotesIcon,
  ActivityLogIcon,
  CandidatesIcon,
  EmptyJobOrders,
  Operating10Icon
} from 'UI/res';

import type { InfoLabel, EntityProfile } from 'types/app';

import { compensationFormatter, phoneNumberFormatter, getErrorMessage } from 'UI/utils';
import RecruiterBar from 'UI/components/organisms/RecruiterBar';
import ProfileView from 'UI/components/templates/ProfileView';
import JobOrderSheet from 'UI/components/organisms/JobOrderSheet';
import JobOrderEdit from 'UI/components/organisms/JobOrderEdit';
import ProfileTabList from 'UI/components/organisms/ProfileTabList';
import ActivityNoteForm from 'UI/components/organisms/ActivityNoteForm';
import ActivityNotes from 'UI/components/organisms/ActivityNotes';
import FileUploader from 'UI/components/molecules/FileUploader';
import HiringAuthorityDrawer from 'UI/components/organisms/HiringAuthorityDrawer';
import ProfilePageLayout from 'UI/components/templates/ProfilePageLayout';
import ReassignRecruiterForm from 'UI/components/organisms/ReassignRecruiter';
import LinkEntitiesForm from 'UI/components/organisms/LinkEntitiesForm';
import OperatingProfile from 'UI/components/organisms/OperatingProfile';

type JobOrderProfileProps = {
  match: any,
  showAlert: any => void,
  showConfirm: any => void,
  location: any
};

const JobOrderProfile = (props: JobOrderProfileProps) => {
  const { match, location, showAlert, showConfirm } = props;
  const history = useHistory();

  useEffect(() => {
    document.title = PageTitles.JobOrderProfile;
  });

  const currentUser = getCurrentUser();

  const joborderId = match.params.id;
  const { tab } = queryString.parse(location.search);

  const [files, setFiles] = useState([]);
  const [activities, setActivities] = useState([]);
  const [notes, setNotes] = useState([]);
  const [profile, setProfile] = useState<EntityProfile>(DefaultProfile);
  const [hiringAuthorities, setHiringAuthorities] = useState([]);
  const [candidates, setCandidates] = useState([]);

  const [whitesheet, setWhitesheet] = useState(null);

  const [uiState, setUiState] = useState({
    isWhitesheetOpen: false,
    isWhitesheetReadOnly: true,
    isHAOpen: false,
    isHAEditingOpen: false,
    selectedHA: null,
    isEditOpen: false,
    isNoteOpen: false,
    isReassignOpen: false,
    isCandidateOpen: false,
    noteType: 'activity',
    selectedNote: null,
    isLoading: true,
    shouldRefreshMetrics: false
  });

  useEffect(() => {
    async function getProfile(id) {
      setUiState(prevState => ({ ...prevState, isLoading: true }));
      try {
        const response = await API.get(`${Endpoints.JobOrders}/${id}`);
        if (response.data) {
          const { whiteSheet } = response.data;
          whiteSheet && setWhitesheet(whiteSheet);
          setFiles(response.data.files);
          setActivities(response.data.activityLogs);
          setNotes(response.data.notes);
          setProfile(response.data);
          setHiringAuthorities(response.data.hiringAuthorities);
          setCandidates(response.data.candidates);
        }
      } catch (err) {
        showAlert({
          severity: 'error',
          title: 'Job Order',
          autoHideDuration: 5000,
          body: getErrorMessage(err)
        });
      }
      setUiState(prevState => ({ ...prevState, isLoading: false }));
    }

    getProfile(joborderId);
  }, [joborderId, showAlert]);

  const handleWhitesheetCompleted = newWhitesheet => {
    setUiState(prevState => ({
      ...prevState,
      isWhitesheetOpen: false,
      shouldRefreshMetrics: newWhitesheet?.jobOrderType?.id !== whitesheet?.jobOrderType?.id
    }));
    setWhitesheet(newWhitesheet);
  };

  const handleWhitesheetClosed = () => {
    uiState.isWhitesheetOpen &&
      setUiState(prevState => ({ ...prevState, isWhitesheetOpen: false }));
  };

  const handleDatasheetClick = (readOnly: boolean) => {
    setUiState(prevState => ({
      ...prevState,
      isWhitesheetReadOnly: readOnly,
      isWhitesheetOpen: true
    }));
  };

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
    setUiState(prevState => ({
      ...prevState,
      isNoteOpen: false,
      selectedNote: null,
      shouldRefreshMetrics: true
    }));
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
        id: null,
        specialty_id: company?.specialty?.id,
        specialty: company?.specialty,
        subspecialty_id: company?.subspecialty?.id,
        subspecialty: company?.subspecialty
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

  const handleHiringAuthorityCompleted = newHiringAuthority => {
    if (newHiringAuthority) {
      if (uiState.isHAEditingOpen) {
        setHiringAuthorities(prevState => {
          return prevState.map(each => {
            return each.id !== uiState.selectedHA?.id ? each : newHiringAuthority;
          });
        });
      } else {
        setHiringAuthorities([...hiringAuthorities, newHiringAuthority]);
      }
    } else {
      showAlert({
        severity: 'error',
        title: `Error ${newHiringAuthority.code}`,
        body: getErrorMessage(newHiringAuthority.message)
      });
    }
    setUiState(prevState => ({ ...prevState, isHAOpen: false, selectedHA: null }));
  };

  const handleHiringAuthorityClosed = () => {
    setUiState(prevState => ({ ...prevState, isHAOpen: false, selectedHA: null }));
  };

  const handleReassignClick = () => {
    setUiState(prevState => ({ ...prevState, isReassignOpen: true }));
  };

  const handleReassignCompleted = (mainRecruiter, updatedProfile) => {
    setUiState(prevState => ({ ...prevState, isReassignOpen: false }));
    updatedProfile &&
      setProfile({
        ...profile,
        recruiter: mainRecruiter || recruiter,
        additionalRecruiters: updatedProfile.additionalRecruiters,
        free_game: updatedProfile.free_game
      });
  };

  const handleReassignClosed = () => {
    uiState.isReassignOpen && setUiState(prevState => ({ ...prevState, isReassignOpen: false }));
  };

  const handleNewCandidateClick = () => {
    setUiState(prevState => ({ ...prevState, isCandidateOpen: true }));
  };

  const handleCandidateClick = (item: any) => {
    history.push(`${EntityRoutes.Candidates}/profile/${item.id}`);
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
            `${Endpoints.JobOrders}/${joborderId}/${Endpoints.HiringAuthorities}/${item.id}`
          );
          if (response.status === 204) {
            setHiringAuthorities(hiringAuthorities.filter(each => each.id !== item.id));
            showAlert({
              severity: 'success',
              title: 'Awesome',
              body: 'The Hiring Authority was removed from this Job Order'
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

  const handleDeleteCandidateClick = (item: any) => {
    showConfirm({
      severity: 'warning',
      title: 'Please confirm',
      message: `Are you sure you want to remove this candidate from the job order?`,
      onConfirm: async ok => {
        if (!ok) {
          return;
        }

        try {
          const response = await API.delete(
            `${Endpoints.JobOrders}/${joborderId}/remove-candidate/${item.id}`
          );

          if (response.status === 200) {
            showAlert({
              severity: 'success',
              title: 'Awesome',
              body: `The Candidate was removed from this Job Order successfully`
            });
            setCandidates(prevState => prevState.filter(each => each.id !== item.id));
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

  const handleCandidateCompleted = (item: any) => {
    setCandidates(prevState => [...prevState, item]);
    setUiState(prevState => ({ ...prevState, isCandidateOpen: false }));
  };

  const handleCandidateClosed = () => {
    uiState.isCandidateOpen && setUiState(prevState => ({ ...prevState, isCandidateOpen: false }));
  };

  const handlePendingActivityClick = (item: any) => {
    setUiState(prevState => ({
      ...prevState,
      noteType: 'activity',
      isNoteOpen: true,
      selectedNote: {
        activity_log_type_id: item.activityId,
        activityLogType: {
          id: item.activityId,
          title: item.title
        }
      }
    }));
  };

  const handleMetricsLoaded = useCallback(() => {
    setUiState(prevState => ({
      ...prevState,
      shouldRefreshMetrics: false
    }));
  }, []);

  const entityType = entityTypes.find(each => each.id === EntityType.Joborder);
  const accountability = useAccountability(currentUser, profile, entityType);

  const {
    id,
    title,
    company,
    address,
    source,
    specialty,
    subspecialty,
    position,
    recruiter
  } = profile;

  const hasLoaded = !!id;
  const workEmailHiringAuthority =
    hiringAuthorities && hiringAuthorities.length ? hiringAuthorities[0].work_email : '';

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

  const candidatesInfoLabelsResolver = (item: any): InfoLabel[] => [
    {
      title: 'Full Name',
      description: item.personalInformation?.full_name
    },
    { title: 'Title', description: item.title },
    {
      title: 'Industry: Specialty',
      description: `${item.specialty?.title}${
        item.subspecialty ? `: ${item.subspecialty?.title}` : ''
      }`
    },
    { title: 'Functional title', description: item.position?.title },
    {
      title: 'Location',
      description: `${item.personalInformation?.address?.city.title}, ${item.personalInformation?.address?.city.state.slug}`
    },
    {
      title: 'Compensation Range',
      description:
        item?.blueSheets &&
        item?.blueSheets.length &&
        compensationFormatter(
          item.blueSheets[0].no_brainer_salary,
          item.blueSheets[0].good_salary,
          item.blueSheets[0].minimum_salary
        )
    }
  ];

  const tabsProp = [
    {
      id: 'candidates',
      label: 'Candidates',
      icon: <CandidatesIcon />,
      view: (
        <ProfileTabList
          loading={!hasLoaded}
          items={candidates}
          cardDefinition={{
            showAvatar: true,
            infoLabelsResolver: candidatesInfoLabelsResolver
          }}
          addButtonText="MATCH CANDIDATE"
          isWithLargeContent
          emptyPlaceholderTitle="No Candidates to show"
          emptyPlaceholderSubtitle="To match this Job Order, click on the button below me."
          emptyStateImage={EmptyJobOrders}
          onNewClick={handleNewCandidateClick}
          onItemClick={handleCandidateClick}
          onDeleteClick={handleDeleteCandidateClick}
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
          onNewClick={handleNewHAClick}
          onEditClick={handleEditHAClick}
          onDeleteClick={handleDeleteHAClick}
          onItemClick={handleEditHAClick}
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
          endpoint={`${Endpoints.JobOrders}/${joborderId}/${Endpoints.Activities}`}
          onItemsChange={handleActiviesNotesChange}
          onNewClick={handleNewNoteClick}
          onEditClick={handleEditNoteClick}
          onItemClick={handleEditNoteClick}
        />
      )
    },
    {
      id: 'metrics',
      label: 'Operating at 10',
      icon: <Operating10Icon />,
      view: (
        <OperatingProfile
          type={EntityType.Joborder}
          entityId={joborderId}
          accountability={accountability}
          shouldRefresh={uiState.shouldRefreshMetrics}
          onNewClick={handleNewNoteClick}
          onActivityClick={handlePendingActivityClick}
          onMetricsLoaded={handleMetricsLoaded}
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
          endpoint={`${Endpoints.JobOrders}/${joborderId}/${Endpoints.Notes}`}
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
          maxNumberOfFiles={5}
          files={files}
          endpoint={`${Endpoints.JobOrders}/${joborderId}/${Endpoints.Files}`}
          fileNameField="file_name"
          mode="list"
          onAttachmentsChanged={handleAttachmentsChanged}
        />
      )
    }
  ];

  const infoLabels = [
    { title: 'Title', description: title },
    { title: 'Company', description: company?.name },
    {
      title: 'Industry: Specialty',
      description: specialty ? `${specialty?.industry?.title}: ${specialty?.title}` : null
    },
    { title: 'Subspecialty', description: subspecialty?.title },
    { title: 'Functional Title', description: position?.title },
    { title: 'City', description: address?.city?.title },
    { title: 'State', description: address?.city?.state?.title },
    { title: 'Zip Code', description: address?.zip },
    { title: 'Address', description: address?.address },
    { title: 'Work Email', description: workEmailHiringAuthority, cropped: true },
    { title: 'Job Board URL', description: source, cropped: true }
  ];
  const initialTab = tabsProp.findIndex(each => each.id === tab);
  const [selectedTab, setSelectedTab] = useState(initialTab > -1 ? initialTab : 0);

  return (
    <ContentPageLayout>
      <ProfilePageLayout
        isLoading={uiState.isLoading}
        title="Job Order"
        profileView={
          <ProfileView
            name={title || ''}
            infoLabels={infoLabels}
            profile={profile}
            sheet={whitesheet}
            type="joborder"
            onDatasheetClick={handleDatasheetClick}
            onEditClick={handleEditClick}
            onReassignClick={handleReassignClick}
          />
        }
        recruiterBar={
          <RecruiterBar
            item={profile}
            entityType={entityType}
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
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isWhitesheetOpen}
        onClose={toggleDrawer('isWhitesheetOpen', false)}
      >
        <div role="presentation">
          <JobOrderSheet
            joborderId={joborderId}
            whitesheet={whitesheet}
            profile={profile}
            isReadOnly={uiState.isWhitesheetReadOnly}
            onWhitesheetCompleted={handleWhitesheetCompleted}
            onWhitesheetClosed={handleWhitesheetClosed}
          />
        </div>
      </Drawer>
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isEditOpen}
        onClose={toggleDrawer('isEditOpen', false)}
      >
        <div role="presentation">
          <JobOrderEdit
            joborder={profile}
            onEditCompleted={handleEditCompleted}
            onEditClosed={handleEditClosed}
          />
        </div>
      </Drawer>
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isNoteOpen}
        onClose={toggleDrawer('isNoteOpen', false)}
      >
        <div role="presentation">
          <ActivityNoteForm
            type={uiState.noteType}
            endpoint={`${Endpoints.JobOrders}/${joborderId}`}
            onNoteCompleted={handleNoteCompleted}
            onNoteClosed={handleNoteClosed}
            selectedItem={uiState.selectedNote}
          />
        </div>
      </Drawer>
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isHAOpen}
        onClose={toggleDrawer('isHAOpen', false)}
      >
        <div role="presentation">
          {id && company && (
            <HiringAuthorityDrawer
              type={EntityType.Joborder}
              isEditing={uiState.isHAEditingOpen}
              companyId={company?.id || 0}
              joborderId={joborderId}
              hiringAuthority={uiState.selectedHA}
              endpoint={
                uiState.isHAEditingOpen
                  ? `${Endpoints.Companies}/${company?.id}/${Endpoints.HiringAuthorities}/${uiState
                      ?.selectedHA?.id || ''}`
                  : `${Endpoints.JobOrders}/${id}/${Endpoints.HiringAuthorities}`
              }
              onHACompleted={handleHiringAuthorityCompleted}
              onHAClosed={handleHiringAuthorityClosed}
            />
          )}
        </div>
      </Drawer>
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isReassignOpen}
        onClose={toggleDrawer('isReassignOpen', false)}
      >
        <div role="presentation">
          <ReassignRecruiterForm
            baseEndpoint={`${Endpoints.JobOrders}`}
            item={profile}
            entityType={entityType}
            onReassignCompleted={handleReassignCompleted}
            onReassignClosed={handleReassignClosed}
          />
        </div>
      </Drawer>
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isCandidateOpen}
        onClose={toggleDrawer('isCandidateOpen', false)}
      >
        <div role="presentation">
          <LinkEntitiesForm
            title="MATCH CANDIDATE"
            placeholder="Search a Candidate by Name, Title or Functional Title"
            sourceEntity={entityTypes.find(each => each.id === EntityType.Candidate)}
            idFieldName="candidateId"
            additionalSearchColumns={['pst.title', 'can.email', 'can.title']}
            saveUrl={`${Endpoints.JobOrders}/${joborderId}/assign-candidate`}
            listUrl={`${Endpoints.Search}`}
            onCompleted={handleCandidateCompleted}
            onClosed={handleCandidateClosed}
            displayTemplate={option => (
              <Box>
                <strong>{option.title}</strong>
                <Typography variant="body2" component="span" color="textSecondary">
                  {` ${option.email || ''}`}
                </Typography>
                <br />
                <span>{option.subtitle}</span>
                <br />
                <Typography variant="body2" component="span" color="textSecondary">
                  {option.city}, {option.state}
                </Typography>
              </Box>
            )}
          />
        </div>
      </Drawer>
    </ContentPageLayout>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    showAlert: alert => dispatch(showAlertAction(alert)),
    showConfirm: confirmation => dispatch(confirmAction(confirmation))
  };
};

export default connect(null, mapDispatchToProps)(JobOrderProfile);
