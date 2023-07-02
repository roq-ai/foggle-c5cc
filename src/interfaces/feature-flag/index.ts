import { EnvironmentInterface } from 'interfaces/environment';
import { ProjectInterface } from 'interfaces/project';
import { GetQueryInterface } from 'interfaces';

export interface FeatureFlagInterface {
  id?: string;
  name: string;
  environment_id?: string;
  project_id?: string;
  created_at?: any;
  updated_at?: any;

  environment?: EnvironmentInterface;
  project?: ProjectInterface;
  _count?: {};
}

export interface FeatureFlagGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  environment_id?: string;
  project_id?: string;
}
