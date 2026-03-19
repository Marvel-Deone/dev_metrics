import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PrismaService } from 'src/database/prisma/prisma.service';

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

  // async exchangeGithubToken(githubToken: string) {
  //     const res = await fetch('https://api.github.com/user', {
  //         headers: {
  //             Authorization: `Bearer ${githubToken}`,
  //         },
  //     });

  //     if (!res.ok) {
  //         throw new UnauthorizedException('Invalid GitHub token');
  //     }

  //     const githubUser = await res.json();

  //     // Store token + login
  //     this.githubSessions.set(githubUser.id, {
  //         token: githubToken,
  //         login: githubUser.login,
  //     });

  //     const payload = {
  //         sub: githubUser.id,
  //     };

  //     return {
  //         accessToken: this.jwtService.sign(payload),
  //         user: {
  //             id: githubUser.id,
  //             login: githubUser.login,
  //             avatarUrl: githubUser.avatar_url,
  //         },
  //     };
  // }

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
    console.log('logg:', githubUser);


    // Create or get user in DB
    const user = await this.usersService.createUser(
      githubUser.id.toString(),
      githubUser.login,
      githubUser.email,
      githubUser.avatar_url,
      githubToken
    );

    const accessToken = this.jwtService.sign({
      userId: user.data.id, // internal UUID only
    });

    console.log('fkkuserg:', user);


    return {
      accessToken,
      onboardingCompleted: user.data.onboardingCompleted ?? false,
    };
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
