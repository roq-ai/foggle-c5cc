import { EnvironmentInterface } from 'interfaces/environment';
import { FeatureFlagInterface } from 'interfaces/feature-flag';
import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface ProjectInterface {
  id?: string;
  name: string;
  company_id?: string;
  created_at?: any;
  updated_at?: any;
  environment?: EnvironmentInterface[];
  feature_flag?: FeatureFlagInterface[];
  company?: CompanyInterface;
  _count?: {
    environment?: number;
    feature_flag?: number;
  };
}

export interface ProjectGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  company_id?: string;
}
