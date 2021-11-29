// @flow
import React, { useState } from 'react';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import CircularProgress from '@material-ui/core/CircularProgress';

import API from 'services/API';
import FileSelectorButton from 'UI/components/molecules/FileSelectorButton';
import { getErrorData } from 'UI/utils';
import FileChip from 'UI/components/molecules/FileChip';
import FileItem from 'UI/components/molecules/FileItem';

import InputContainer from 'UI/components/atoms/InputContainer';
import {
  showAlert as showAlertAction,
  confirm as confirmAction
} from 'actions/app';
import { colors, EmptyFiles, UploadFile } from 'UI/res';

import EmptyPlaceholder from 'UI/components/templates/EmptyPlaceholder';
import ActionButton from 'UI/components/atoms/ActionButton';
import Tooltip from '@material-ui/core/Tooltip';

import { styles } from './styles';

type Attachment = {
  id?: number,
  name?: string,
  hasError?: boolean,
  message?: string,
  isLoading: boolean
};

type FileUploaderProps = {
  files?: Attachment[],
  maxNumberOfFiles: number,
  fileNameField: string,
  endpoint: string,
  mode?: 'chips' | 'list',
  alwaysReplace?: boolean,
  onAttachmentsChanged: any,
  showAlert: any => void,
  showConfirm: any => void,
  loading: boolean
};

const FileUploader = (props: FileUploaderProps) => {
  const {
    files: previousFiles,
    maxNumberOfFiles = 3,
    fileNameField,
    endpoint,
    mode,
    alwaysReplace,
    onAttachmentsChanged,
    showAlert,
    showConfirm,
    loading
  } = props;

  const [attachments, setAttachments] = useState<Attachment[]>(
    previousFiles || []
  );

  const handleFileUpload = e => {
    const filesWithoutError = attachments.filter(
      (att: Attachment) => !att.hasError
    ).length;
    if (filesWithoutError >= maxNumberOfFiles && !alwaysReplace) {
      e.target.value = '';
      showAlert({
        severity: 'warning',
        title: 'Attachments',
        body: `Only ${maxNumberOfFiles} files are allowed`
      });
      return;
    }

    const { files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      const filesWithSameName = attachments.filter(
        att => att[fileNameField] === file.name
      ).length;
      if (filesWithSameName > 0) {
        e.target.value = '';
        showAlert({
          severity: 'warning',
          title: 'Attachments',
          body: `You've already selected ${file.name}`
        });
        return;
      }
      uploadFile(file);
      e.target.value = '';
    }
  };

  const uploadFile = async file => {
    const data = new FormData();
    data.append('file', file);

    const fileInfo = { [fileNameField]: file.name, isLoading: true };
    const newAttachments = alwaysReplace
      ? [fileInfo]
      : [...attachments, fileInfo];
    setAttachments(newAttachments);

    try {
      const uploadResponse = await API.post(endpoint, data);
      processUploadResponse(
        newAttachments,
        uploadResponse.data
          ? uploadResponse.data
          : { ...fileInfo, hasError: true }
      );
    } catch (err) {
      processUploadResponse(newAttachments, {
        ...fileInfo,
        title: getErrorData(err)?.title || 'Error en conexión',
        autoHideDuration: 800000,
        body: getErrorData(err)?.message || 'Contacte a soporte técnico',
        hasError: true
      });
    }
  };

  const processUploadResponse = (
    attachmnts: Attachment[],
    newFile: Attachment
  ) => {
    const updatedAttachments = updateAttachmentLoadingStatus(
      attachmnts,
      fileNameField,
      newFile,
      false
    );

    if (!newFile.hasError) {
      onAttachmentsChanged &&
        onAttachmentsChanged(getAttachmentsWithoutErrors(updatedAttachments));
    }
  };

  const handleDeleteAttachment = async (attachment: Attachment) => {
    if (!attachment) {
      return;
    }

    if (!attachment.id && attachment.hasError) {
      deleteFileWithError(attachment[fileNameField]);
      return;
    }

    showConfirm({
      severity: 'warning',
      title: 'Please confirm',
      message: `Are you sure you want to delete '${attachment[fileNameField]}'?`,
      onConfirm: async ok => {
        try {
          ok && (await deleteRemoteFile(attachment));
        } catch (err) {
          showAlert({
            severity: 'error',
            title: getErrorData(err)?.title || 'Error en conexión',
            autoHideDuration: 800000,
            body: getErrorData(err)?.message || 'Contacte a soporte técnico'
          });
        }
      }
    });
  };

  const deleteFileWithError = fileName => {
    const newAttachments = attachments.filter(
      item => item[fileNameField] !== fileName
    );
    setAttachments(newAttachments);
  };

  const deleteRemoteFile = async (file: Attachment) => {
    updateAttachmentLoadingStatus(attachments, 'id', file, true);

    const response = await API.delete(`${endpoint}/${file.id ? file.id : ''}`);
    if (response.status === 200) {
      showAlert({
        severity: 'success',
        title: 'Attachments',
        body: 'The file was deleted successfully'
      });

      const newAttachments = attachments.filter(item => item.id !== file.id);
      setAttachments(newAttachments);
      onAttachmentsChanged &&
        onAttachmentsChanged(getAttachmentsWithoutErrors(newAttachments));
    }
  };

  const updateAttachmentLoadingStatus = (
    attachmnts: Attachment[],
    fieldName: string,
    attachment: Attachment,
    isLoading: boolean
  ) => {
    const atts = attachmnts.map((att: Attachment) => {
      if (att[fieldName] !== attachment[fieldName]) {
        return att;
      }

      return { ...attachment, isLoading };
    });

    setAttachments(atts);

    return atts;
  };

  const getAttachmentsWithoutErrors = (attachmnts: Attachment[]) =>
    attachmnts.filter(att => !att.hasError);

  return mode === 'chips' ? (
    <Box display="flex" flexWrap="wrap" maxWidth={1360} width="100%">
      <InputContainer>
        <FileSelectorButton onFileChange={handleFileUpload}>
          <ActionButton component="span" text="Upload File" iconPosition="left">
            <UploadFile fill={colors.white} />
          </ActionButton>
        </FileSelectorButton>
      </InputContainer>
      {attachments.length > 0 &&
        attachments.map((attachment: Attachment) => {
          return (
            <InputContainer key={attachment[fileNameField]}>
              <FileChip
                file={attachment}
                fileName={attachment[fileNameField]}
                loading={!!attachment.isLoading}
                error={!!attachment.hasError}
                message={attachment.message}
                onFileDelete={handleDeleteAttachment}
              />
            </InputContainer>
          );
        })}
    </Box>
  ) : (
    <>
      {loading ? (
        <div style={styles.emptyStateContainer}>
          <EmptyPlaceholder
            title="Loading content."
            subtitle="Please hang on."
          />
          <CircularProgress />
        </div>
      ) : (
        <>
          {attachments.length === 0 ? (
            <EmptyPlaceholder
              title="No files uploaded yet"
              subtitle="To upload a file, click on the button below me."
            >
              <EmptyFiles width="20vh" style={styles.spacing} />
              <FileSelectorButton onFileChange={handleFileUpload}>
                <ActionButton
                  component="span"
                  text="Upload File"
                  iconPosition="left"
                >
                  <UploadFile fill={colors.white} />
                </ActionButton>
              </FileSelectorButton>
            </EmptyPlaceholder>
          ) : (
            <Box style={styles.fileListContainer}>
              {attachments.length > 0 &&
                attachments.map(attachment => {
                  return (
                    <FileItem
                      key={attachment[fileNameField]}
                      file={attachment}
                      fileName={attachment[fileNameField]}
                      loading={!!attachment.isLoading}
                      error={!!attachment.hasError}
                      message={attachment.message}
                      onFileDelete={handleDeleteAttachment}
                    />
                  );
                })}
              <div style={styles.floatingButtonContainer}>
                <FileSelectorButton onFileChange={handleFileUpload}>
                  <Tooltip title="UPLOAD FILES" placement="left">
                    <Fab
                      size="medium"
                      component="span"
                      color="primary"
                      variant="round"
                      aria-label="add"
                    >
                      <UploadFile />
                    </Fab>
                  </Tooltip>
                </FileSelectorButton>
              </div>
            </Box>
          )}
        </>
      )}
    </>
  );
};

FileUploader.defaultProps = {
  mode: 'chips',
  files: [],
  alwaysReplace: false
};

const mapDispatchToProps = dispatch => {
  return {
    showAlert: alert => dispatch(showAlertAction(alert)),
    showConfirm: confirmation => dispatch(confirmAction(confirmation))
  };
};

const FileUploaderConnected = connect(null, mapDispatchToProps)(FileUploader);

export default FileUploaderConnected;
