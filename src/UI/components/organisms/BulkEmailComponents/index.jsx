// @flow
import React from 'react';
import BulkEmailForm from '../BulkEmailForm';
import CreateEmailTemplate from '../CreateEmailTemplate';

type BulkEmailComponentsProps = {
  mode: 'email' | 'createTemplate',
  onCancel: () => any,
  isEmailModal?: boolean,
  onNewTemplateClick: () => any,
  variant: 'bulk' | 'email',
  onTemplateSave: () => any
};

const BulkEmailComponents = (props: BulkEmailComponentsProps) => {
  const { mode, isEmailModal, onNewTemplateClick, onCancel, variant, onTemplateSave } = props;
  return (
    <>
      {mode === 'email' ? (
        <BulkEmailForm
          onNewTemplateClick={onNewTemplateClick}
          variant={variant}
          isEmailModal={isEmailModal}
        />
      ) : (
        <CreateEmailTemplate
          isBulkEmailPage={false}
          onCancel={onCancel}
          onTemplateSave={onTemplateSave}
        />
      )}
    </>
  );
};

BulkEmailComponents.defaultProps = {
  mode: 'email',
  isEmailModal: false,
  variant: 'bulk'
};

export default BulkEmailComponents;
