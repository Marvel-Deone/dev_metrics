import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './apis/auth/auth.module';
import { UsersModule } from './apis/users/users.module';
import { GithubModule } from './apis/github/github.module';
import { ReposModule } from './apis/repos/repos.module';
import { MetricsModule } from './apis/metrics/metrics.module';
import { AnalyticsModule } from './apis/analytics/analytics.module';
import { PrismaModule } from './database/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    GithubModule,
    ReposModule,
    MetricsModule,
    AnalyticsModule,
    PrismaModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule { }
