// @flow

import { userHasRole } from 'services/Authorization';
import { Roles } from 'UI/constants/roles';
import { AdditionalRecruiterStatus, AdditionalRecruiterType } from 'UI/constants/status';
import { EntityType } from 'UI/constants/entityTypes';

export const AssignableEntities = [EntityType.Candidate, EntityType.Joborder, EntityType.Company];
export const TeamworkEntities = [EntityType.Candidate, EntityType.Joborder];

export const useAccountability = (user: any, item: any, entityType: any) => {
  const { additionalRecruiters = [], free_game: isFreeGame, recruiter } = item;
  const isUserCoach = userHasRole(Roles.Coach);
  const isUserRecruiter = userHasRole(Roles.Recruiter);
  const isItemMine = item?.recruiter?.id === user.id;

  /* Each main recruiter could have an assistant recruiter */
  const assistantRecruiter =
    (recruiter &&
      additionalRecruiters.find(
        rcr =>
          rcr.status === AdditionalRecruiterStatus.Approved &&
          rcr.type === AdditionalRecruiterType.Collaborator &&
          rcr.recruiter_to_collaborate_id === recruiter?.id
      )) ||
    null;

  /* If an item becomes free game, it could have another accountable recruiter */
  const accountableRecruiter =
    additionalRecruiters.find(
      rcr =>
        rcr.status === AdditionalRecruiterStatus.Approved &&
        rcr.type === AdditionalRecruiterType.Accountable
    ) || null;

  /* An accountable recruiter could also have an assistant recruiter */
  const assistantForAccountableRecruiter =
    (accountableRecruiter &&
      additionalRecruiters.find(
        rcr =>
          rcr.status === AdditionalRecruiterStatus.Approved &&
          rcr.type === AdditionalRecruiterType.Collaborator &&
          rcr.recruiter_to_collaborate_id === accountableRecruiter.recruiter_id
      )) ||
    null;
  const isMainCoach = isUserCoach && item?.coach?.id === user.id;
  const isMainRecruiter = isUserRecruiter && recruiter?.id === user.id;
  const isAccountableCoach = isUserCoach && accountableRecruiter?.coach?.id === user.id;
  const isAccountableRecruiter = isUserRecruiter && accountableRecruiter?.recruiter_id === user.id;
  const isMainAssistant = assistantRecruiter?.recruiter_id === user.id;
  const isAccountableAssistant = assistantForAccountableRecruiter?.recruiter_id === user.id;
  const isAssistantRecruiter = isMainAssistant || isAccountableAssistant;

  const isUserRequestingAccountability = isFreeGame && isUserRecruiter && !isMainRecruiter;
  const isTeamworkEntity = TeamworkEntities.includes(entityType.id);
  const isAssignableEntity = AssignableEntities.includes(entityType.id);

  const shouldShowAdditionalRecruiters =
    isTeamworkEntity &&
    !isMainRecruiter &&
    !isAssistantRecruiter &&
    (isFreeGame || isAccountableRecruiter || isAccountableCoach);

  return {
    isUserRequestingAccountability,
    mainRecruiter: user,
    assistantRecruiter,
    accountableRecruiter,
    assistantForAccountableRecruiter,
    isMainCoach,
    isMainRecruiter,
    isAccountableCoach,
    isAccountableRecruiter,
    isMainAssistant,
    isAccountableAssistant,
    isAssistantRecruiter,
    shouldShowAdditionalRecruiters,
    isItemMine,
    isTeamworkEntity,
    isAssignableEntity
  };
};
