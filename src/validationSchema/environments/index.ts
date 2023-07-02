import * as yup from 'yup';

export const environmentValidationSchema = yup.object().shape({
  name: yup.string().required(),
  project_id: yup.string().nullable(),
});
