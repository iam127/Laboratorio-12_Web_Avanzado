import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const connectionString = "postgresql://postgres.cgfpiauedwiysxisxeyj:RQe3&4QsM.j5d.W@aws-1-us-east-1.pooler.supabase.com:5432/postgres"

declare global {
  var prisma: any
}

const adapter = new PrismaPg({ connectionString })

export const prisma = global.prisma || new (PrismaClient as any)({ adapter })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma