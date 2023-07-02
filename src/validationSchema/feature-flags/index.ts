import * as yup from 'yup';

export const featureFlagValidationSchema = yup.object().shape({
  name: yup.string().required(),
  environment_id: yup.string().nullable(),
  project_id: yup.string().nullable(),
});
