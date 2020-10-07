// @flow
import React from 'react';
import Box from '@material-ui/core/Box';
import TreeViewBulkTemplates from 'UI/components/organisms/TreeViewBulkTemplates';
import EmptyPlaceholder from 'UI/components/templates/EmptyPlaceholder';
import { EmptyBulkTemplate, TemplateIcon, NewFolderIcon, NewTemplateIcon, colors } from 'UI/res';
import ActionButton from 'UI/components/atoms/ActionButton';
import BulkEmailContentHeader from 'UI/components/molecules/BulkEmailContentHeader';
import { useStyles, styles } from './style';
import './style.css';

const PreviewContent = props => {
  const { isContentSelected, templatesPreview } = props;
  return (
    <>
      {isContentSelected ? (
        <>{templatesPreview}</>
      ) : (
        <EmptyPlaceholder
          title="No Template Selected"
          subtitle="Your Templates will be shown here!"
        >
          <Box style={styles.emptyImage}>
            <EmptyBulkTemplate />
          </Box>
        </EmptyPlaceholder>
      )}
    </>
  );
};

type BulkEmailTemplatesProps = {
  onNewCreationFolder: () => any,
  onNewTemplateClick: () => any,
  isWithOutContent?: boolean,
  templatesPreview?: any,
  isContentSelected?: boolean
};

const BulkEmailTemplates = (props: BulkEmailTemplatesProps) => {
  const {
    onNewCreationFolder,
    isWithOutContent,
    templatesPreview,
    isContentSelected,
    onNewTemplateClick
  } = props;

  const classes = useStyles();

  return (
    <div className={classes.main}>
      <BulkEmailContentHeader
        isTemplateSection
        sectionHeaderTitle="Template Preview"
        placeHolder="Filter by Name"
        isWithActionButton
        text="Edit"
      />

      <Box className={classes.templatesContainer}>
        <Box className={classes.treeViewContainer}>
          <div className={classes.treeViewBox}>
            <Box
              p={isWithOutContent ? 2 : 0}
              alignItems={isWithOutContent ? 'center' : 'flex-start'}
              className={classes.templateBox}
              flexDirection={!isWithOutContent && 'column'}
            >
              {isWithOutContent ? (
                <div>
                  <EmptyPlaceholder
                    title="No Template Selected"
                    subtitle="To create a template, click on the button"
                  >
                    <Box className={classes.emptyImage}>
                      <EmptyBulkTemplate />
                    </Box>
                  </EmptyPlaceholder>
                  <Box className={classes.emptyStateButton}>
                    <ActionButton
                      onClick={onNewTemplateClick}
                      className={classes.ActionButton}
                      text="New Template"
                    />
                  </Box>
                </div>
              ) : (
                <>
                  <div className={classes.templateActions}>
                    <Box className={classes.templateActionContainer} onClick={onNewCreationFolder}>
                      <Box mr={1}>
                        <NewFolderIcon fill={colors.black} size={20} />
                      </Box>
                      New Folder
                    </Box>
                    <Box
                      className={classes.templateActionContainerRight}
                      onClick={onNewTemplateClick}
                    >
                      <Box mr={1}>
                        <NewTemplateIcon size={20} fill={colors.black} />
                      </Box>
                      New Template
                    </Box>
                  </div>
                  <TreeViewBulkTemplates />
                </>
              )}
            </Box>
          </div>
        </Box>
        <Box width="100%" className={classes.templatePreviewContainer} alignItems="flex-start">
          <Box
            p={2}
            alignItems={isContentSelected ? 'flex-start' : 'center'}
            className={classes.templateBox}
          >
            {isWithOutContent ? (
              <Box className={classes.NoContent}>
                <TemplateIcon size={150} />
              </Box>
            ) : (
              <PreviewContent
                isContentSelected={isContentSelected}
                templatesPreview={templatesPreview}
              />
            )}
          </Box>
        </Box>
      </Box>
    </div>
  );
};

BulkEmailTemplates.defaultProps = {
  isWithOutContent: false,
  templatesPreview: {},
  isContentSelected: false
};

export default BulkEmailTemplates;
