// @flow
import React from 'react';
import { useFormContext } from 'react-hook-form';

import TextBox from 'UI/components/atoms/TextBox';
import Text from 'UI/components/atoms/Text';
import type { FeeAgreementMode } from 'types/app';
import { WARRANTY_VALIDATION, PERCENT_VALIDATION } from 'UI/utils/index';

type FeeAgreementValidationInputsProps = {
  mode: Array<FeeAgreementMode>,
  isWithLabel: boolean,
  outPutValue: boolean
};

const FeeAgreementValidationInputs = (props: FeeAgreementValidationInputsProps) => {
  const { mode, isWithLabel, outPutValue } = props;
  const allInputs = mode === 'all';
  const { register, errors } = useFormContext();

  return (
    <>
      {(mode.includes('fee') || allInputs) && (
        <>
          <TextBox
            name="fee_percentage"
            label="Fee %*"
            inputRef={
              outPutValue
                ? register
                : register({
                    required: 'Fee percent is required',
                    ...PERCENT_VALIDATION
                  })
            }
            inputType={outPutValue ? 'text' : 'percentage'}
            error={!!errors.fee_percentage}
            errorText={errors.fee_percentage && errors.fee_percentage.message}
            outPutValue={outPutValue}
          />
        </>
      )}
      {(mode.includes('guarantee') || allInputs) && (
        <TextBox
          name="guarantee_days"
          label="Days under guarantee *"
          inputRef={
            outPutValue
              ? register
              : register({
                  required: 'Guarantee time is required',
                  ...WARRANTY_VALIDATION
                })
          }
          error={!!errors.declined_guarantee_days}
          errorText={errors.guarantee_days && errors.guarantee_days.message}
          inputType={outPutValue ? 'text' : 'number'}
          outPutValue={outPutValue}
        />
      )}
      {(mode.includes('verbiage') || allInputs) && (
        <>
          {isWithLabel && (
            <Text
              outPutValue={outPutValue}
              variant="subtitle1"
              text="Modify the Following Verbiage Change"
              fontSize={16}
            />
          )}
          <TextBox
            inputRef={
              outPutValue
                ? register
                : register({
                    required: 'Verbiage is required'
                  })
            }
            outPutValue={outPutValue}
            name="verbiage_changes"
            label="Verbiage"
            multiline
            error={!!errors.verbiage_changes}
            errorText={errors.verbiage_changes && errors.verbiage_changes.message}
          />
        </>
      )}
    </>
  );
};

FeeAgreementValidationInputs.defaultProps = {
  mode: 'all',
  isWithLabel: false,
  outPutValue: false
};

export default FeeAgreementValidationInputs;
