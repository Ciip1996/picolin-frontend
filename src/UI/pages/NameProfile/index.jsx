// @flow
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

/** Material Assets and Components */
import Drawer from '@material-ui/core/Drawer';

/** Atoms, Components and Styles */
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import TabsView from 'UI/components/templates/TabsView';
import ActivityNotes from 'UI/components/organisms/ActivityNotes';
import FileUploader from 'UI/components/molecules/FileUploader';
import CandidateSheet from 'UI/components/organisms/CandidateSheet';
import NameEdit from 'UI/components/organisms/NameEdit';
import ProfileView from 'UI/components/templates/ProfileView';
import ProfilePageLayout from 'UI/components/templates/ProfilePageLayout';

import API from 'services/API';
import { Endpoints } from 'UI/constants/endpoints';

import ActivityNoteForm from 'UI/components/organisms/ActivityNoteForm';
import { phoneFormatter } from 'UI/utils';
import { AttachmentsIcon, NotesIcon, ActivityLogIcon, colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import { PageTitles, drawerAnchor } from 'UI/constants/defaults';

const NameProfile = props => {
  const { match } = props;

  useEffect(() => {
    document.title = PageTitles.NameProfile;
  });

  const [selectedTab, setSelectedTab] = useState(0);
  const nameId = match.params.id;
  const [files, setFiles] = useState([]);
  const [activities, setActivities] = useState([]);
  const [notes, setNotes] = useState([]);
  const [profile, setProfile] = useState({});
  const [bluesheet, setBluesheet] = useState(null);

  const [uiState, setUiState] = useState({
    isBluesheetOpen: false,
    isBluesheetReadOnly: true,
    isEditOpen: false,
    isNoteOpen: false,
    isReassignOpen: false,
    noteType: 'activity',
    selectedNote: null,
    isLoading: true
  });

  useEffect(() => {
    async function getProfile(id) {
      setUiState(prevState => ({ ...prevState, isLoading: true }));
      try {
        const response = await API.get(`${Endpoints.Names}/${id}`);
        if (response.data) {
          const { blueSheets } = response.data;
          blueSheets && blueSheets.length && setBluesheet(blueSheets[0]);
          setFiles(response.data.files);
          setActivities(response.data.activityLogs);
          setNotes(response.data.notes);
          setProfile(response.data);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
      setUiState(prevState => ({ ...prevState, isLoading: false }));
    }

    getProfile(nameId);
  }, [nameId]);

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
    setUiState(prevState => ({ ...prevState, isBluesheetOpen: false }));
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

  const handleReassignClick = () => {
    setUiState(prevState => ({ ...prevState, isReassignOpen: true }));
  };

  const {
    id,
    personalInformation,
    specialty,
    subspecialty,
    nameStatus,
    position,
    email,
    current_company,
    sourceType
  } = profile;

  const hasLoaded = !!id;

  const tabsProp = [
    {
      label: 'Activity Log',
      icon: <ActivityLogIcon fill={selectedTab === 0 ? colors.success : colors.iconInactive} />,
      view: (
        <ActivityNotes
          loading={!hasLoaded}
          items={activities}
          type="activity"
          endpoint={`${Endpoints.Names}/${nameId}/${Endpoints.Activities}`}
          onItemsChange={handleActiviesNotesChange}
          onNewClick={handleNewNoteClick}
          onEditClick={handleEditNoteClick}
        />
      )
    },
    {
      label: 'Notes',
      icon: <NotesIcon fill={selectedTab === 1 ? colors.success : colors.iconInactive} />,
      view: (
        <ActivityNotes
          loading={!hasLoaded}
          items={notes}
          type="note"
          endpoint={`${Endpoints.Names}/${nameId}/${Endpoints.Notes}`}
          onItemsChange={handleActiviesNotesChange}
          onNewClick={handleNewNoteClick}
          onEditClick={handleEditNoteClick}
        />
      )
    },
    {
      label: 'Attachments',
      icon: <AttachmentsIcon fill={selectedTab === 2 ? colors.success : colors.iconInactive} />,
      view: (
        <FileUploader
          isLoading={!hasLoaded}
          maxNumberOfFiles={5}
          files={files}
          endpoint={`${Endpoints.Names}/${nameId}/${Endpoints.Files}`}
          fileNameField="file_name"
          mode="list"
          onAttachmentsChanged={handleAttachmentsChanged}
        />
      )
    }
  ];

  const infoLabels = [
    { title: 'Title', description: profile?.title },
    {
      title: 'Industry: Specialty',
      description: specialty ? `${specialty?.industry?.title}: ${specialty?.title}` : null
    },
    { title: 'Functional Title', description: position?.title },
    { title: 'Current company', description: current_company },
    { title: 'Subspecialty', description: subspecialty?.title },
    { title: 'Status', description: nameStatus?.title },
    { title: 'Phone', description: phoneFormatter(personalInformation?.contact?.phone) },
    { title: 'Ext', description: personalInformation?.contact?.ext },

    { title: 'Other Phone', description: phoneFormatter(personalInformation?.contact?.mobile) },
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

  return (
    <ContentPageLayout>
      <ProfilePageLayout
        isLoading={uiState.isLoading}
        title="Name"
        profileView={
          <ProfileView
            name={profile?.personalInformation?.full_name}
            infoLabels={infoLabels}
            sheet={bluesheet}
            type="name"
            profile={profile}
            onDatasheetClick={handleDatasheetClick}
            onEditClick={handleEditClick}
            onReassignClick={handleReassignClick}
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
            nameId={nameId}
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
          <NameEdit
            name={profile}
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
            endpoint={`${Endpoints.Names}/${nameId}`}
            onNoteCompleted={handleNoteCompleted}
            onNoteClosed={handleNoteClosed}
            selectedItem={uiState.selectedNote}
          />
        </div>
      </Drawer>
    </ContentPageLayout>
  );
};
export default withRouter(NameProfile);
