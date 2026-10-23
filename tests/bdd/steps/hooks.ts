import { epic, feature, severity } from 'allure-js-commons';
import { EPIC } from '@app/data/report-labels';
import { Before } from './fixtures';

const SEVERITY_TAG = '@severity:';

// scenarios get Allure labels from their feature: the feature title and an optional @severity tag
Before(async ({ $bddContext }) => {
  const [, featureTitle] = $bddContext.testInfo.titlePath;
  const severityTag = $bddContext.tags.find((tag) => tag.startsWith(SEVERITY_TAG));
  await epic(EPIC.UI);
  await feature(featureTitle);
  await severity(severityTag ? severityTag.slice(SEVERITY_TAG.length) : 'normal');
});
