// @flow
import React, { useEffect, useState } from 'react';
import CardActionArea from '@material-ui/core/CardActionArea';
import Card from '@material-ui/core/Card';

import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';

import Text from 'UI/components/atoms/Text';
import { SuccessIcon, CloseIcon, colors } from 'UI/res';

import CustomIconButton from 'UI/components/atoms/CustomIconButton';
import { useStyles, useProgressStyles, styles } from './styles';

type FileChipProps = {
  loading: boolean,
  error?: boolean,
  file: any,
  fileName: string,
  style?: Object,
  message: string,
  onFileDelete?: (file: any) => any
};

const FileChip = (props: FileChipProps) => {
  const { loading, error, message, file, fileName, style, onFileDelete, ...rest } = props;
  const classes = useStyles();
  const circularProgressClasses = useProgressStyles();
  const [status, setStatus] = useState('loading');

  const handleDeleteClick = () => {
    onFileDelete && onFileDelete(file);
  };

  const design = {
    loading: {
      style: styles.loading,
      adornment: (
        <CustomIconButton style={styles.button} disabled tooltipText="Loading">
          <CircularProgress classes={circularProgressClasses} size={24} thickness={4} />
        </CustomIconButton>
      )
    },
    success: {
      style: styles.success,
      adornment: (
        <CustomIconButton style={styles.button} disabled tooltipText="Success">
          <SuccessIcon fill={colors.white} />
        </CustomIconButton>
      )
    },
    finished: {
      style: styles.finished,
      adornment: (
        <CustomIconButton style={styles.button} tooltipText="Delete" onClick={handleDeleteClick}>
          <CloseIcon fill={colors.grey} />
        </CustomIconButton>
      )
    },
    error: {
      style: styles.error,
      adornment: (
        <CustomIconButton style={styles.button} tooltipText="Delete" onClick={handleDeleteClick}>
          <CloseIcon fill={colors.error} />
        </CustomIconButton>
      )
    }
  };

  useEffect(() => {
    if (status !== 'finished') {
      if (loading) setStatus('loading');
      else setStatus('success');
    }
  }, [status, loading]);

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
      <Card
        classes={classes}
        elevation={0}
        style={error ? design.error.style : design[status].style}
      >
        <CardActionArea style={styles.cardAction} href={file?.url} {...rest}>
          <Text variant="body1" text={fileName} cropped />
        </CardActionArea>
        {error ? design.error.adornment : design[status].adornment}
        {error && (
          <Text variant="body1" text={message} fontSize={12} customStyle={styles.errorLabel} />
        )}
      </Card>
    </Fade>
  );
};

FileChip.defaultProps = {
  error: false,
  style: {},
  onFileDelete: undefined,
  message: ''
};

export default FileChip;
