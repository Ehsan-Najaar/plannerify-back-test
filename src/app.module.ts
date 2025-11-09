import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Users & Auth
import { AuthModule } from './auth/auth.module';
import { PasswordRecovery } from './auth/auth.passwordRecovery.entity';
import { EmailCode } from './users/emailCode.entity';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';

// Tasks
import { Task } from './tasks/task.entity';
import { TaskModule } from './tasks/task.module';

// Goals & Ideas
import { Goal } from './goals/entities/goal.entity';
import { Goals } from './goals/goals';
import { GoalsModule } from './goals/goals.module';
import { Idea } from './ideas/entities/idea.entity';
import { IdeasModule } from './ideas/ideas.module';

// Plans
import { Plan, PlanSettings } from './plans/plan.entity';
import { PlanModule } from './plans/plan.module';

// Subscriptions & Surveys & Reports
import { Report } from './reports/entities/report.entity';
import { ReportsModule } from './reports/reports.module';
import { Subscription } from './subscriptions/entities/subscription.entity';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { Survey } from './surveys/entities/survey.entity';
import { SurveysModule } from './surveys/surveys.module';

// Languages & Contents
import { ContentsModule } from './contents/contents.module';
import { Content } from './contents/entities/content.entity';
import { Language } from './languages/entities/language.entity';
import { LanguagesModule } from './languages/languages.module';

// Overview & Payments
import { OverviewModule } from './overview/overview.module';
import { Payments } from './paypal/entities/paypal.entity';
import { PaypalModule } from './paypal/paypal.module';

// Social & About & Terms
import { AboutModule } from './about/about.module';
import { AboutContent } from './about/entities/about.entity';
import { Social } from './social/entities/social.entity';
import { SocialModule } from './social/social.module';
import { TermsContent } from './terms/entities/terms.entity';
import { TemrsModule } from './terms/terms.module';

// Reminder
import { ReminderModule } from './reminder/reminder.module';

// Schedule Modules
import { Schedule } from 'src/schedule/schedule.entity';
import { ScheduleModule } from './schedule/schedule.module';

// Settings Modules
import { Settings } from 'src/setting/settings.entity';
import { SettingsModule } from 'src/setting/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD + '',
      database: process.env.DB_DATABASE,
      entities: [
        User,
        EmailCode,
        PasswordRecovery,
        Task,
        Goal,
        Idea,
        Plan,
        PlanSettings,
        Survey,
        Report,
        Language,
        Content,
        Subscription,
        Payments,
        Social,
        AboutContent,
        TermsContent,
        Schedule,
        Settings,
      ],
      synchronize: true,
    }),
    NestScheduleModule.forRoot(), // ماژول scheduling اصلی
    UsersModule,
    AuthModule,
    TaskModule,
    GoalsModule,
    IdeasModule,
    PlanModule,
    SubscriptionsModule,
    SurveysModule,
    ReportsModule,
    LanguagesModule,
    ContentsModule,
    OverviewModule,
    PaypalModule,
    SocialModule,
    AboutModule,
    TemrsModule,
    ReminderModule,
    ScheduleModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService, Goals],
})
export class AppModule {}
