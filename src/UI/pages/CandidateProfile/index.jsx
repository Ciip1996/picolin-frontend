// @flow
import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';

/** Material Assets and Components */
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

/** Atoms, Components and Styles */
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import TabsView from 'UI/components/templates/TabsView';
import ActivityNotes from 'UI/components/organisms/ActivityNotes';
import FileUploader from 'UI/components/molecules/FileUploader';
import CandidateSheet from 'UI/components/organisms/CandidateSheet';
import CandidateEdit from 'UI/components/organisms/CandidateEdit';
import ProfileView from 'UI/components/templates/ProfileView';
import RecruiterBar from 'UI/components/organisms/RecruiterBar';
import ProfilePageLayout from 'UI/components/templates/ProfilePageLayout';
import ProfileTabList from 'UI/components/organisms/ProfileTabList';
import ActivityNoteForm from 'UI/components/organisms/ActivityNoteForm';
import ReassignRecruiterForm from 'UI/components/organisms/ReassignRecruiter';
import LinkEntitiesForm from 'UI/components/organisms/LinkEntitiesForm';
import OperatingProfile from 'UI/components/organisms/OperatingProfile';

import API from 'services/API';
import { useAccountability } from 'hooks/accountability';
import { getCurrentUser } from 'services/Authentication';
import { Endpoints } from 'UI/constants/endpoints';
import { EntityType, entityTypes } from 'UI/constants/entityTypes';
import { PageTitles, DefaultProfile, drawerAnchor } from 'UI/constants/defaults';
import type { InfoLabel, TabCardDefinition, EntityProfile } from 'types/app';
import { phoneNumberFormatter, compensationFormatter, getErrorMessage } from 'UI/utils';
import { showAlert as showAlertAction, confirm as confirmAction } from 'actions/app';
import { EntityRoutes } from 'routes/constants';
import {
  AttachmentsIcon,
  NotesIcon,
  ActivityLogIcon,
  JobOrdersIcon,
  EmptyJobOrders,
  Operating10Icon
} from 'UI/res';

const CandidateProfile = props => {
  const { match, location, showAlert, showConfirm } = props;
  const history = useHistory();

  useEffect(() => {
    document.title = PageTitles.CandidateProfile;
  });
  const currentUser = getCurrentUser();

  const candidateId = match.params.id;
  const { tab } = queryString.parse(location.search);
  const [files, setFiles] = useState([]);
  const [activities, setActivities] = useState([]);
  const [notes, setNotes] = useState([]);
  const [profile, setProfile] = useState<EntityProfile>(DefaultProfile);
  const [bluesheet, setBluesheet] = useState(null);
  const [jobOrders, setJobOrders] = useState([]);

  const [uiState, setUiState] = useState({
    isBluesheetOpen: false,
    isBluesheetReadOnly: true,
    isEditOpen: false,
    isNoteOpen: false,
    isReassignOpen: false,
    isJOOpen: false,
    noteType: 'activity',
    selectedNote: null,
    isLoading: true,
    shouldRefreshMetrics: false
  });

  useEffect(() => {
    async function getProfile(id) {
      setUiState(prevState => ({ ...prevState, isLoading: true }));
      try {
        const response = await API.get(`${Endpoints.Candidates}/${id}`);
        if (response.data) {
          const { blueSheets } = response.data;
          blueSheets && blueSheets.length && setBluesheet(blueSheets[0]);
          setFiles(response.data.files);
          setActivities(response.data.activityLogs);
          setNotes(response.data.notes);
          setProfile(response.data);
          setJobOrders(response.data.jobOrders);
        }
      } catch (err) {
        showAlert({
          severity: 'error',
          title: 'Candidate',
          autoHideDuration: 5000,
          body: getErrorMessage(err)
        });
      }
      setUiState(prevState => ({ ...prevState, isLoading: false }));
    }

    getProfile(candidateId);
  }, [candidateId, showAlert]);

  const handleAttachmentsChanged = attachments => {
    setFiles(attachments);
  };

  const handleChange = (event, newValue = 0) => {
    setSelectedTab(newValue);
  };

  const toggleDrawer = (drawer, open) => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setUiState(prevState => ({ ...prevState, [drawer]: open }));
  };

  const handleBluesheetCompleted = bs => {
    setUiState(prevState => ({
      ...prevState,
      isBluesheetOpen: false,
      shouldRefreshMetrics: bs.candidateType.id !== bluesheet?.candidateType?.id
    }));
    setBluesheet(bs);
  };

  const handleBluesheetClosed = () => {
    uiState.isBluesheetOpen && setUiState(prevState => ({ ...prevState, isBluesheetOpen: false }));
  };

  const handleDatasheetClick = (readOnly: boolean) => {
    setUiState(prevState => ({
      ...prevState,
      isBluesheetReadOnly: readOnly,
      isBluesheetOpen: true
    }));
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

  const handleNewJOClick = () => {
    setUiState(prevState => ({ ...prevState, isJOOpen: true }));
  };

  const handleJOClick = (item: any) => {
    history.push(`${EntityRoutes.JobOrders}/profile/${item.id}`);
  };

  const handleJOCompleted = (item: any) => {
    setJobOrders(prevState => [...prevState, item]);
    setUiState(prevState => ({ ...prevState, isJOOpen: false }));
  };

  const handleJOClosed = () => {
    uiState.isJOOpen && setUiState(prevState => ({ ...prevState, isJOOpen: false }));
  };

  const handleDeleteJOClick = (item: any) => {
    showConfirm({
      severity: 'warning',
      title: 'Please confirm',
      message: `Are you sure you want to remove this Job Order from the Candidate?`,
      onConfirm: async ok => {
        if (!ok) {
          return;
        }

        try {
          const response = await API.delete(
            `${Endpoints.Candidates}/${candidateId}/remove-job-order/${item.id}`
          );

          if (response.status === 200) {
            showAlert({
              severity: 'success',
              title: 'Awesome',
              body: `The Job Order was removed from this Candidate successfully`
            });
            setJobOrders(prevState => prevState.filter(each => each.id !== item.id));
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

  const entityType = entityTypes.find(each => each.id === EntityType.Candidate);
  const accountability = useAccountability(currentUser, profile, entityType);
  const {
    id,
    personalInformation,
    title,
    specialty,
    subspecialty,
    position,
    email,
    current_company,
    sourceType,
    recruiter
  } = profile;

  const hasLoaded = !!id;

  const infoLabelsResolver = (item: any): InfoLabel[] => [
    { title: 'Title', description: item?.title },
    {
      title: 'Industry: Specialty',
      description: `${item.specialty?.title}${
        item.subspecialty ? `: ${item.subspecialty?.title}` : ''
      }`
    },
    {
      title: 'Company',
      description: item?.company?.name
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

  const cardDefinition: TabCardDefinition = {
    showAvatar: true,
    infoLabelsResolver
  };

  const tabsProp = [
    {
      id: 'joborders',
      label: 'Job Orders.',
      icon: <JobOrdersIcon />,
      view: (
        <ProfileTabList
          loading={!hasLoaded}
          items={jobOrders}
          addButtonText="MATCH JOB ORDER"
          emptyPlaceholderTitle="No Job Orders to show"
          emptyPlaceholderSubtitle="To match this candidate, click on the button below me."
          emptyStateImage={EmptyJobOrders}
          cardDefinition={cardDefinition}
          onNewClick={handleNewJOClick}
          onItemClick={handleJOClick}
          onDeleteClick={handleDeleteJOClick}
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
          endpoint={`${Endpoints.Candidates}/${candidateId}/${Endpoints.Activities}`}
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
          type={EntityType.Candidate}
          entityId={candidateId}
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
          endpoint={`${Endpoints.Candidates}/${candidateId}/${Endpoints.Notes}`}
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
          isLoading={!hasLoaded}
          maxNumberOfFiles={5}
          files={files}
          endpoint={`${Endpoints.Candidates}/${candidateId}/${Endpoints.Files}`}
          fileNameField="file_name"
          mode="list"
          onAttachmentsChanged={handleAttachmentsChanged}
        />
      )
    }
  ];

  const infoLabels = [
    // this way should be passed to the ProfileView
    { title: 'Title', description: title },
    {
      title: 'Industry: Specialty',
      description: specialty ? `${specialty?.industry?.title}: ${specialty?.title}` : null
    },
    { title: 'Subspecialty', description: subspecialty?.title },
    { title: 'Functional Title', description: position?.title },
    { title: 'Current company', description: current_company },
    { title: 'Phone', description: phoneNumberFormatter(personalInformation?.contact?.phone) },
    { title: 'Ext', description: personalInformation?.contact?.ext },

    {
      title: 'Other Phone',
      description: phoneNumberFormatter(personalInformation?.contact?.mobile)
    },
    { title: 'Email', description: email },
    {
      title: 'Other Email',
      description: personalInformation?.contact?.personal_email
    },
    { title: 'State', description: personalInformation?.address?.city?.state?.title },
    { title: 'City', description: personalInformation?.address?.city?.title },
    { title: 'Zip Code', description: personalInformation?.address?.zip },
    { title: 'Source', description: sourceType?.title }
  ];

  const initialTab = tabsProp.findIndex(each => each.id === tab);
  const [selectedTab, setSelectedTab] = useState(initialTab > -1 ? initialTab : 0);

  return (
    <ContentPageLayout>
      <ProfilePageLayout
        isLoading={uiState.isLoading}
        title="Candidate"
        profileView={
          <ProfileView
            name={personalInformation?.full_name}
            infoLabels={infoLabels}
            profile={profile}
            sheet={bluesheet}
            type="candidate"
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
          <TabsView selectedTab={selectedTab} onChangeTabIndex={handleChange} tabs={tabsProp} />
        }
      />
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isBluesheetOpen}
        onClose={toggleDrawer('isBluesheetOpen', false)}
      >
        <div role="presentation">
          <CandidateSheet
            candidateId={candidateId}
            bluesheet={bluesheet}
            profile={profile}
            isReadOnly={uiState.isBluesheetReadOnly}
            onBluesheetCompleted={handleBluesheetCompleted}
            onBluesheetClosed={handleBluesheetClosed}
          />
        </div>
      </Drawer>
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isEditOpen}
        onClose={toggleDrawer('isEditOpen', false)}
      >
        <div role="presentation">
          <CandidateEdit
            candidate={profile}
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
            endpoint={`${Endpoints.Candidates}/${candidateId}`}
            onNoteCompleted={handleNoteCompleted}
            onNoteClosed={handleNoteClosed}
            selectedItem={uiState.selectedNote}
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
            baseEndpoint={`${Endpoints.Candidates}`}
            item={profile}
            entityType={entityType}
            onReassignCompleted={handleReassignCompleted}
            onReassignClosed={handleReassignClosed}
          />
        </div>
      </Drawer>
      <Drawer
        anchor={drawerAnchor}
        open={uiState.isJOOpen}
        onClose={toggleDrawer('isJOOpen', false)}
      >
        <div role="presentation">
          <LinkEntitiesForm
            title="ASSIGN JOB ORDER"
            placeholder="Search a Job Order by Position, Functional title or Company"
            sourceEntity={entityTypes.find(each => each.id === EntityType.Joborder)}
            idFieldName="jobOrderId"
            additionalSearchColumns={[]}
            saveUrl={`${Endpoints.Candidates}/${candidateId}/assign-job-order`}
            listUrl={`${Endpoints.Search}`}
            onCompleted={handleJOCompleted}
            onClosed={handleJOClosed}
            displayTemplate={option => (
              <Box>
                <b>{option.title}</b>
                <br />
                <Typography variant="body1" component="span">
                  {option.subtitle}
                </Typography>{' '}
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

export default connect(null, mapDispatchToProps)(CandidateProfile);
