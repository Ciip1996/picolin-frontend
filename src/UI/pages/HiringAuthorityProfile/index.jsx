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
import { PageTitles, drawerAnchor } from 'UI/constants/defaults';
import { Endpoints } from 'UI/constants/endpoints';

import ActivityNoteForm from 'UI/components/organisms/ActivityNoteForm';
import { phoneFormatter } from 'UI/utils';
import { AttachmentsIcon, NotesIcon, ActivityLogIcon } from 'UI/components/molecules/ProductCard/node_modules/UI/res';

const HiringAuthorityProfile = props => {
  const { match } = props;
  const [selectedTab, setSelectedTab] = useState(0);
  const hiringAuthorityId = match.params.id;
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
        const response = await API.get(`${Endpoints.HiringAuthorities}/${id}`);
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

    getProfile(hiringAuthorityId);
  }, [hiringAuthorityId]);

  useEffect(() => {
    document.title = PageTitles.HiringAuthority;
  });

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
    specialty,
    position,
    company,
    subspecialty,
    work_phone,
    work_email,
    personal_phone,
    personal_email,
    full_name,
    ext,
    other_ext,
    hiringAuthorityStatus
  } = profile;

  const hasLoaded = !!id;

  const tabsProp = [
    {
      label: 'Activity Log',
      icon: <ActivityLogIcon />,
      view: (
        <ActivityNotes
          loading={!hasLoaded}
          items={activities}
          type="activity"
          endpoint={`${Endpoints.HiringAuthorities}/${hiringAuthorityId}/${Endpoints.Activities}`}
          onItemsChange={handleActiviesNotesChange}
          onNewClick={handleNewNoteClick}
          onEditClick={handleEditNoteClick}
        />
      )
    },
    {
      label: 'Notes',
      icon: <NotesIcon />,
      view: (
        <ActivityNotes
          loading={!hasLoaded}
          items={notes}
          type="note"
          endpoint={`${Endpoints.HiringAuthorities}/${hiringAuthorityId}/${Endpoints.Notes}`}
          onItemsChange={handleActiviesNotesChange}
          onNewClick={handleNewNoteClick}
          onEditClick={handleEditNoteClick}
        />
      )
    },
    {
      label: 'Attachments',
      icon: <AttachmentsIcon />,
      view: (
        <FileUploader
          isLoading={!hasLoaded}
          maxNumberOfFiles={5}
          files={files}
          endpoint={`${Endpoints.HiringAuthorities}/${hiringAuthorityId}/${Endpoints.Files}`}
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
      description: specialty ? `${specialty?.title}` : null
    },
    { title: 'Functional Title', description: position?.title },
    { title: 'Current company', description: company?.name },
    { title: 'Subspecialty', description: subspecialty?.title },
    { title: 'Status', description: hiringAuthorityStatus?.title },
    { title: 'Phone', description: phoneFormatter(personal_phone) },
    { title: 'Ext', description: ext },
    { title: 'Other Phone', description: phoneFormatter(work_phone) },
    { title: 'Ext', description: other_ext },
    { title: 'Email', description: personal_email },
    {
      title: 'Other Email',
      description: work_email
    }
  ];

  return (
    <ContentPageLayout>
      <ProfilePageLayout
        isLoading={uiState.isLoading}
        title="Hiring Authority"
        profileView={
          <ProfileView
            name={full_name}
            infoLabels={infoLabels}
            sheet={bluesheet}
            type="hiring authority"
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
            hiringAuthorityId={hiringAuthorityId}
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
            endpoint={`${Endpoints.HiringAuthorities}/${hiringAuthorityId}`}
            onNoteCompleted={handleNoteCompleted}
            onNoteClosed={handleNoteClosed}
            selectedItem={uiState.selectedNote}
          />
        </div>
      </Drawer>
    </ContentPageLayout>
  );
};
export default withRouter(HiringAuthorityProfile);
