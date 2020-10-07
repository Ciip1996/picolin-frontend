// @flow

import React from 'react';
import DigPopover from 'UI/components/organisms/DigPopover';
import InventoryPopover from 'UI/components/organisms/InventoryPopover';
import { nestTernary } from 'UI/utils';
import { EntityType } from 'UI/constants/entityTypes';
import './styles.css';

type PopUpContentProps = {
  isDigActive?: boolean,
  entityType?: string,
  info: any
};

const getIndustryHierarchy = (item: any) =>
  `${item.industry}: ${item.specialty}${item.subspecialty ? ` / ${item.subspecialty}` : ''}`;

const PopUpContent = (props: PopUpContentProps) => {
  const { isDigActive, entityType, info } = props;
  const specificInfo =
    entityType === EntityType.Candidate
      ? {
          title: info.full_name,
          subtitle: info.title,
          subtitle2: getIndustryHierarchy(info),
          type: entityType
        }
      : nestTernary(
          entityType === EntityType.Company,
          {
            title: info.name,
            subtitle: getIndustryHierarchy(info),
            subtitle2: '',
            type: entityType
          },
          {
            title: info.title,
            subtitle: getIndustryHierarchy(info),
            subtitle2: info.company_name,
            type: entityType
          }
        );

  return (
    <div>
      {isDigActive ? (
        <DigPopover
          acron={info.initials || ''}
          titleName={info.full_name}
          recruiterEmail={info.email || ''}
          recruiterExtension={info.ext || ''}
          coach={info.coach || ''}
          backgroundColor={info.color}
        />
      ) : (
        <InventoryPopover
          id={info.id}
          title={specificInfo.title}
          subtitle={specificInfo.subtitle}
          subtitle2={specificInfo.subtitle2}
          entityType={entityType || ''}
          recruiterName={info.recruiter || ''}
          recruiterEmail={info.recruiter_email || ''}
          hotItemLabel={info.type || ''}
          status={info.type_class || ''}
          acron={info.initials || ''}
          emailLink={info.recruiter_email || ''}
        />
      )}
    </div>
  );
};

PopUpContent.defaultProps = {
  isDigActive: true,
  entityType: ''
};

export default PopUpContent;
