import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaModule } from './database/prisma.module';
import {ConfigModule} from "@nestjs/config"
import { UserModule } from './modules/user/user.module';
import { TeachersModule } from './modules/teachers/teachers.module';

@Module({

  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    PrismaModule,
    UserModule,
    TeachersModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
