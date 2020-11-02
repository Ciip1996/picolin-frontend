// @flow
import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';

import Text from 'UI/components/atoms/Text';
import { SuccessIcon, DeleteIcon, DownloadIcon, FileIcon, CloseIcon, colors } from 'UI/res';

import CustomIconButton from 'UI/components/atoms/CustomIconButton';
import { useStyles, useProgressStyles, styles } from './styles';
import Contents from './strings';

type FileItemProps = {
  loading: boolean,
  error?: boolean,
  style?: Object,
  file: any,
  fileName: string,
  style?: Object,
  message: string,
  onFileDelete?: (file: any) => any
};

const FileItem = (props: FileItemProps) => {
  const { loading, error, message, file, fileName, style, onFileDelete, ...rest } = props;
  const classes = useStyles();
  const circularProgressClasses = useProgressStyles();
  const [status, setStatus] = useState('loading');
  const language = localStorage.getItem('language');

  const handleDeleteClick = () => {
    onFileDelete && onFileDelete(file);
  };

  const design = {
    loading: {
      style: styles.loading,
      fileIcon: colors.darkGrey,
      adornment: (
        <CustomIconButton disabled tooltipText={Contents[language].txtLoading}>
          <CircularProgress classes={circularProgressClasses} size={24} thickness={4} />
        </CustomIconButton>
      )
    },
    success: {
      style: styles.success,
      fileIcon: colors.active,
      adornment: (
        <CustomIconButton disabled>
          <SuccessIcon fill={colors.active} />
        </CustomIconButton>
      )
    },
    finished: {
      style: styles.finished,
      fileIcon: colors.black,
      adornment: (
        <div>
          <CustomIconButton tooltipText={Contents[language].txtDownload} href={file?.url}>
            <DownloadIcon fill={colors.black} />
          </CustomIconButton>
          <CustomIconButton tooltipText={Contents[language].txtDelete} onClick={handleDeleteClick}>
            <DeleteIcon fill={colors.black} />
          </CustomIconButton>
        </div>
      )
    },
    error: {
      style: styles.error,
      fileIcon: colors.error,
      adornment: (
        <CustomIconButton tooltipText={Contents[language].txtDelete} onClick={handleDeleteClick}>
          <CloseIcon fill={colors.error} />
        </CustomIconButton>
      )
    }
  };

  useEffect(() => {
    if (status !== 'finished') {
      if (loading) setStatus('loading');
      else setStatus('success');
      if (error) setStatus('error');
    }
  }, [status, loading, error]);

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        setStatus('finished');
      }, 1500);
      return () => clearTimeout(timer);
    }
    return () => {};
  }, [status]);

  return (
    <Fade in timeout={1000}>
      <Paper elevation={0} classes={classes} style={design[status].style} {...rest}>
        <CustomIconButton disabled>
          <FileIcon fill={design[status].fileIcon} />
        </CustomIconButton>

        {error ? (
          <Text
            variant="body1"
            text={message}
            customStyle={{ ...styles.fileLabel, color: colors.error }}
            cropped
          />
        ) : (
          <Text variant="body1" text={fileName} customStyle={styles.fileLabel} cropped />
        )}
        {design[status].adornment}
      </Paper>
    </Fade>
  );
};

FileItem.defaultProps = {
  error: false,
  style: {},
  onFileDelete: undefined,
  message: ''
};

export default FileItem;
