import { faker } from '@faker-js/faker'
export const makeMockTenants = (n=10) => Array.from({length:n}).map(()=>({
  tenant_id: faker.string.uuid(),
  slug: faker.helpers.slugify(faker.company.name()).toLowerCase().slice(0,24),
  display_name: faker.company.name(),
  industry: faker.helpers.arrayElement(['Construction','Consulting']),
  region: faker.helpers.arrayElement(['us-east-1','ca-central-1']),
  isolation_tier: faker.helpers.arrayElement(['tier_a_shared','tier_b_dedicated']),
  status: faker.helpers.arrayElement(['STARTING','IN_PROGRESS','HEALTHY','UNHEALTHY','DISABLED']),
  auth_mode: faker.helpers.arrayElement(['PASSWORD','SSO']),
  root_user_email: faker.internet.email(),
  ip_allow_list: [],
  created_at: faker.date.past().toISOString(),
  updated_at: faker.date.recent().toISOString()
}))
