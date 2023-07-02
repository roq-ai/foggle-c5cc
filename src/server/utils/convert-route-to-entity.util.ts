const mapping: Record<string, string> = {
  companies: 'company',
  environments: 'environment',
  'feature-flags': 'feature_flag',
  projects: 'project',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
