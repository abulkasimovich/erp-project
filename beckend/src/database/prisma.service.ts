import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {PrismaPg} from "@prisma/adapter-pg"
import {Pool} from "pg"

@Injectable()
export class PrismaService
  extends PrismaClient  
  implements OnModuleInit, OnModuleDestroy
{
  constructor(){
    let connectionString = process.env.DATABASE_URL
    let pool = new Pool(connectionString)
    let adapter = new PrismaPg(pool)
    super({adapter, log:["error","warn"]})
  }
  async onModuleInit() {
    await this.$connect();
    Logger.log('✅ Database connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    Logger.log('❌ Database disconnected');
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production!');
    }

    const models = Reflect.ownKeys(this).filter(
      (key) => key[0] !== '_' && key !== 'constructor',
    );

    return Promise.all(
      models.map((modelKey) => {
        const model = this[modelKey as string];
        if (model && typeof model.deleteMany === 'function') {
          return model.deleteMany();
        }
      }),
    );
  }
}
