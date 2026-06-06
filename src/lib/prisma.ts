import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = "postgresql://postgres.cgfpiauedwiysxisxeyj:RQe3&4QsM.j5d.W@aws-1-us-east-1.pooler.supabase.com:5432/postgres"

const adapter = new PrismaPg({ connectionString })

const { PrismaClient } = require('@prisma/client')

declare global {
  var prisma: any
}

export const prisma = global.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma