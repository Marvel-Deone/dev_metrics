import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { WorkspacePolicyService } from './policies/workspace-policy.service';
import { InvitationsService } from './invitations/invitations.service';
import { InvitationsController } from './invitations/invitations.controller';
import { MailModule } from '../mail/mail.module';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [MailModule],
  providers: [
    WorkspacesService,
    WorkspacePolicyService,
    InvitationsService,
    MailService,
  ],
  controllers: [WorkspacesController, InvitationsController]
})
export class WorkspacesModule { }
