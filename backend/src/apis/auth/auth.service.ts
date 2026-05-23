import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { InvitationStatus } from '@prisma/client';

@Injectable()
export class AuthService {
  // private githubTokens = new Map<number, string>(); // userId → token
  private githubSessions = new Map<
    string,
    { token: string; login: string }
  >();

  constructor(
    private jwtService: JwtService,
    // private usersService: UsersService
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private prisma: PrismaService,
  ) { }

  async exchangeGithubToken(githubToken: string) {
    const res = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${githubToken}`,
      },
    });

    if (!res.ok) {
      throw new UnauthorizedException('Invalid GitHub token');
    }

    const githubUser = await res.json();

    // Create or get user in DB
    const user = await this.usersService.createUser(
      githubUser.id.toString(),
      githubUser.login,
      githubUser.email,
      githubUser.avatar_url,
      githubToken
    );

    await this.autoAcceptInvitations(
      user.data.id,
      user.data.email,
    );

    const accessToken = this.jwtService.sign({
      userId: user.data.id, // internal UUID only
    });

    return {
      accessToken,
      onboardingCompleted: user.data.onboardingCompleted ?? false,
    };
  }


  private async autoAcceptInvitations(
    userId: string,
    email?: string | null,
  ) {
    if (!email) return;
    const pendingInvitations =
      await this.prisma.workspaceInvitation.findMany({
        where: {
          email,
          status: InvitationStatus.PENDING,
          expiresAt: {
            gt: new Date(),
          },
        },
      });

    for (const invitation of pendingInvitations) {
      const exists =
        await this.prisma.workspaceMember.findFirst({
          where: {
            workspaceId: invitation.workspaceId,
            userId,
          },
        });

      if (!exists) {
        await this.prisma.workspaceMember.create({
          data: {
            workspaceId: invitation.workspaceId,
            userId,
            role: invitation.role,
          },
        });
      }

      await this.prisma.workspaceInvitation.update({
        where: { id: invitation.id },
        data: {
          status: InvitationStatus.ACCEPTED,
          acceptedAt: new Date(),
          userId,
        },
      });
    }
  }
  // getGithubToken(userId: string) {
  //   return this.githubSessions.get(userId)?.token;
  // }

  async getGithubToken(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { githubAccessToken: true },
    });

    return user?.githubAccessToken;
  }

  getGithubLogin(userId: string): string | undefined {
    return this.githubSessions.get(userId)?.login;
  }

  async validateGithubUser(profile: any) {
    const { id, email, name, avatar_url } = profile;

    const user = await this.usersService.createUser(
      id.toString(),   // githubId
      email,
      name,
      avatar_url,
    );

    const accessToken = this.jwtService.sign({
      userId: user.data?.id,   // internal UUID
    });

    return {
      accessToken,
      onboardingCompleted: user.data?.onboardingCompleted,
    };
  }

}
