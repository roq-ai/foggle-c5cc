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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getFeatureFlagById, updateFeatureFlagById } from 'apiSdk/feature-flags';
import { Error } from 'components/error';
import { featureFlagValidationSchema } from 'validationSchema/feature-flags';
import { FeatureFlagInterface } from 'interfaces/feature-flag';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { EnvironmentInterface } from 'interfaces/environment';
import { ProjectInterface } from 'interfaces/project';
import { getEnvironments } from 'apiSdk/environments';
import { getProjects } from 'apiSdk/projects';

function FeatureFlagEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<FeatureFlagInterface>(
    () => (id ? `/feature-flags/${id}` : null),
    () => getFeatureFlagById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: FeatureFlagInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateFeatureFlagById(id, values);
      mutate(updated);
      resetForm();
      router.push('/feature-flags');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<FeatureFlagInterface>({
    initialValues: data,
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
            Edit Feature Flag
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(FeatureFlagEditPage);
