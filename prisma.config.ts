import path from 'node:path'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: "postgresql://postgres.cgfpiauedwiysxisxeyj:RQe3&4QsM.j5d.W@aws-1-us-east-1.pooler.supabase.com:5432/postgres",
  },
})