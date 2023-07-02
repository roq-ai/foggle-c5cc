import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createFeatureFlag } from 'apiSdk/feature-flags';
import { Error } from 'components/error';
import { featureFlagValidationSchema } from 'validationSchema/feature-flags';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { EnvironmentInterface } from 'interfaces/environment';
import { ProjectInterface } from 'interfaces/project';
import { getEnvironments } from 'apiSdk/environments';
import { getProjects } from 'apiSdk/projects';
import { FeatureFlagInterface } from 'interfaces/feature-flag';

function FeatureFlagCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: FeatureFlagInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createFeatureFlag(values);
      resetForm();
      router.push('/feature-flags');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<FeatureFlagInterface>({
    initialValues: {
      name: '',
      environment_id: (router.query.environment_id as string) ?? null,
      project_id: (router.query.project_id as string) ?? null,
    },
    validationSchema: featureFlagValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Feature Flag
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
            {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<EnvironmentInterface>
            formik={formik}
            name={'environment_id'}
            label={'Select Environment'}
            placeholder={'Select Environment'}
            fetcher={getEnvironments}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <AsyncSelect<ProjectInterface>
            formik={formik}
            name={'project_id'}
            label={'Select Project'}
            placeholder={'Select Project'}
            fetcher={getProjects}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'feature_flag',
    operation: AccessOperationEnum.CREATE,
  }),
)(FeatureFlagCreatePage);
