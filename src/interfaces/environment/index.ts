import { FeatureFlagInterface } from 'interfaces/feature-flag';
import { ProjectInterface } from 'interfaces/project';
import { GetQueryInterface } from 'interfaces';

export interface EnvironmentInterface {
  id?: string;
  name: string;
  project_id?: string;
  created_at?: any;
  updated_at?: any;
  feature_flag?: FeatureFlagInterface[];
  project?: ProjectInterface;
  _count?: {
    feature_flag?: number;
  };
}

export interface EnvironmentGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  project_id?: string;
}
