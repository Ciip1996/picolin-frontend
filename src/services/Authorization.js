// @flow
// import type { UserRole } from 'types/app';

import { AdditionalRecruiterStatus, AdditionalRecruiterType } from 'UI/constants/status';
import { getCurrentUser } from './Authentication';

export const Permissions = {
  FeeAgreements: {
    ModifyGuarantee: 'feeAgreements.modifyGuarantee',
    ModifyPercentage: 'feeAgreements.modifyPercentage'
  }
};

export const canUserEditEntity = (user: any, entity: any): boolean => {
  if (!user || !entity) {
    return false;
  }

  const isAdditionalRecruiter =
    entity.additionalRecruiters &&
    entity.additionalRecruiters.some(
      rcr =>
        rcr.status === AdditionalRecruiterStatus.Approved &&
        rcr.type === AdditionalRecruiterType.Accountable &&
        (rcr.recruiter_id === user.id || rcr.coach?.id === user.id)
    );
  const isNotAssignable = !entity.recruiter && !entity.coach; // For entitities like names, everyone can edit.
  return (
    user.id === entity.recruiter?.id ||
    user.id === entity.coach?.id ||
    isAdditionalRecruiter ||
    isNotAssignable
  );
};

export const doesUserOwnItem = (user: any, item: any): boolean => {
  if (!user || !item) {
    return false;
  }
  return user?.id === item?.user?.id;
};

export const userHasPermission = (permission: string) => {
  const user = getCurrentUser();

  if (!user || !user.permissions || !user.permissions.length) {
    return false;
  }

  return user.permissions.some(permissn => permissn.title === permission);
};

export const userHasRole = (roleId: number) => {
  const user = getCurrentUser();

  if (!user || !user.roleId) {
    return false;
  }
  return user.roleId === roleId;
};
