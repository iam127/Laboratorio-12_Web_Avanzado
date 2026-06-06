import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = "postgresql://postgres.cgfpiauedwiysxisxeyj:RQe3&4QsM.j5d.W@aws-1-us-east-1.pooler.supabase.com:5432/postgres"

declare global {
  var prisma: any
}

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString })
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrismaClient } = require('@prisma/client/default')
  return new PrismaClient({ adapter })
}

export const prisma = global.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') global.prisma = prisma