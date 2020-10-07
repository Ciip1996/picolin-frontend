// @flow
import React, { useState, useEffect } from 'react';
import Text from 'UI/components/atoms/Text';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import { DownloadIcon, CloseIcon, FullScreenIcon, colors } from 'UI/res';
import CustomIconButton from 'UI/components/atoms/CustomIconButton';
import { getErrorMessage } from 'UI/utils';
import { useStyles } from './styles';

type FeeAgreementPreviewModalProps = {
  closeModal: any => any,
  url: string,
  handleAlert: any => any
};

const FeeAgreementPreviewModal = (props: FeeAgreementPreviewModalProps) => {
  const { closeModal, url, handleAlert } = props;
  const classes = useStyles();
  const [fileURL, setFileURL] = useState('');
  // const [blob, setBlob] = useState('');

  useEffect(() => {
    const getFileURl = async () => {
      const proxyurl = 'https://cors-anywhere.herokuapp.com/';
      fetch(proxyurl + url)
        .then(async response => {
          const temp = await response.blob();
          return temp;
        })
        .then(contents => {
          if (contents) {
            // Create a Blob from the PDF Stream
            const blob = new Blob([contents], { type: 'application/pdf' });
            // create an object URL from the Blob
            const URL = window.URL || window.webkitURL;
            const downloadUrl = URL.createObjectURL(blob);
            setFileURL(downloadUrl);
          }
        })
        .catch(error => {
          handleAlert({
            severity: 'error',
            title: 'Fee Agreement File',
            autoHideDuration: 3000,
            body: getErrorMessage(error)
          });
        });
    };
    getFileURl();
  }, [handleAlert, url]);

  return (
    <div className={classes.paper}>
      <div className={classes.topBar}>
        <Text text="Fee Agreement" variant="subtitle1" fontSize={18} />
        <Box display="flex" alignItems="center">
          <Link download component="a" href={url}>
            <CustomIconButton tooltipText="Download">
              <DownloadIcon fill={colors.black} />
            </CustomIconButton>
          </Link>

          <Link target="_blank" rel="noopener" href={fileURL}>
            <CustomIconButton tooltipText="Full Screen">
              <FullScreenIcon size={20} />
            </CustomIconButton>
          </Link>
          <CustomIconButton tooltipText="Close" onClick={closeModal}>
            <CloseIcon fill={colors.black} />
          </CustomIconButton>
        </Box>
      </div>
      <div id="pdfContainer" className={classes.pdfBox}>
        <iframe
          type="application/pdf"
          allowFullScreen
          className={classes.iframeStyle}
          id="inlineFrameExample"
          title="Inline Frame Example"
          width="100%"
          height="100%"
          src={`${fileURL}#toolbar=0&navpanes=0`}
        />
      </div>
    </div>
  );
};

export default FeeAgreementPreviewModal;
