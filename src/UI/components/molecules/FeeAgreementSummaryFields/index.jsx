// @flow
import React from 'react';
import moment from 'moment';
import TextBox from 'UI/components/atoms/TextBox';
import Text from 'UI/components/molecules/ProductCard/node_modules/UI/components/atoms/Text';
import UserComments from 'UI/components/molecules/UserComments';
import { globalStyles } from 'GlobalStyles';
import { DateFormats } from 'UI/constants/defaults';
import Divider from '@material-ui/core/Divider';
import type { FeeAgreementMode } from 'types/app';
import { styles } from './style';
import FeeAgreementValidationInputs from '../FeeAgreementValidationInputs';

type FeeAgreementSummaryFieldsProps = {
  feeAgreement: Object,
  mode: Array<FeeAgreementMode>
};

const FeeAgreementSummaryFields = (props: FeeAgreementSummaryFieldsProps) => {
  const { feeAgreement, mode } = props;
  const {
    company: { name: companyName },
    hiringAuthority: { full_name: hiringAuthorityName },
    creator: {
      initials: recruiterInitials,
      personalInformation: { full_name: recruiterName }
    },
    cc_email,
    created_at,
    notes
  } = feeAgreement || {};

  return (
    <>
      {mode.length !== 3 && <Divider />}
      <div style={globalStyles.feeDrawerslabel}>
        <Text variant="subtitle1" text="Fee Agreement Summary" fontSize={16} />
      </div>
      <FeeAgreementValidationInputs outPutValue mode={mode} />

      <>
        <TextBox outPutValue name="company" defaultValue={companyName} label="Company Namaaaae *" />
        <div style={styles.inputSpacing}>
          <TextBox
            outPutValue
            name="hiring"
            defaultValue={hiringAuthorityName}
            label="Hiring Authority *"
          />
        </div>
        <TextBox outPutValue name="email" defaultValue={cc_email} label="CC Email" />
        {notes && (
          <>
            <hr style={styles.hr} />
            <div style={globalStyles.feeDrawerslabel}>
              <Text variant="subtitle1" text="Recruiter's Note(s)" fontSize={16} />
            </div>
            <UserComments
              avatarInitials={recruiterInitials}
              author={recruiterName}
              date={moment(created_at).format(DateFormats.DetailDate)}
              note={notes}
            />
          </>
        )}
      </>
    </>
  );
};

export default FeeAgreementSummaryFields;
