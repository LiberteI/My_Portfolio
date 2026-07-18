import { ExperienceRecords } from '../data/experience/experience.data';

export const getExperienceCards = () => ExperienceRecords.map((experience, index) => ({
  id: `${experience.orgName || experience.title}-${index}`,
  ...experience
}));
