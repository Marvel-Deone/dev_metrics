import { forwardRef, HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { GithubService } from '../github/github.service';
import { buildProfileResponse } from './assemblers/user-profile.assembler';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { error, success } from 'src/common/functions/response..util';

@Injectable()
export class UsersService {
    constructor(
        // private readonly authService: AuthService,
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,
        private readonly githubService: GithubService,
        private readonly prisma: PrismaService,
    ) {
        console.log(Reflect.getMetadata('design:paramtypes', UsersService));
    }

    async getProfile(userId: string) {
        // Confirm user exists
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                username: true,
                githubAccessToken: true,
            },
        });


        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        if (!user.githubAccessToken || !user.username) {
            throw new HttpException(
                'GitHub account not connected',
                HttpStatus.BAD_REQUEST,
            );
        }

        const rawProfile = await this.githubService.getUserProfile(
            user.username,
            user.githubAccessToken,
        );

        return buildProfileResponse(rawProfile);
    }

    async createUser(
        githubId: string,
        name: string,
        email?: string | null,
        image?: string,
        githubAccessToken?: string
    ) {
        try {
            const createData: any = {
                githubId,
                username: name,
                avatarUrl: image,
            };

            const updateData: any = {
                username: name,
                avatarUrl: image,
            };

            if (email) {
                createData.email = email;
                updateData.email = email;
            }

            // store token if provided
            if (githubAccessToken) {
                createData.githubAccessToken = githubAccessToken;
                updateData.githubAccessToken = githubAccessToken;
            }

            const user = await this.prisma.user.upsert({
                where: { githubId },
                update: updateData,
                create: createData,
            });

            return success(
                {
                    id: user.id,
                    first_name: user.username,
                    last_name: user.username,
                    email: user.email,
                    profile_image: user.avatarUrl,
                    onboardingCompleted: user.onboardingCompleted,
                },
                'Congratulations',
                `User signed in successfully.`,
            );
        } catch (err) {
            throw new HttpException(
                error(
                    'Signing In Failed',
                    'We encountered an issue. Please try again later.',
                    HttpStatus.INTERNAL_SERVER_ERROR
                ),
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async completeOnboarding(userId: string, goal: string) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                goal,
                onboardingCompleted: true,
            },
        });

        return {
            success: true,
            onboardingCompleted: user.onboardingCompleted,
        };
    }
}
