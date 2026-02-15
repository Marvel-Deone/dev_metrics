import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    private githubTokens = new Map<number, string>(); // userId → token
    constructor(private jwtService: JwtService) { }

    async exchangeGithubToken(githubToken: string) {
        // Verify GitHub token
        const res = await fetch('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${githubToken}`,
            },
        });

        if (!res.ok) {
            throw new UnauthorizedException('Invalid GitHub token');
        }

        const githubUser = await res.json();

        // 🔐 store token server-side
        this.githubTokens.set(githubUser.id, githubToken);

        // Issue YOUR JWT
        const payload = {
            sub: githubUser.id,
            login: githubUser.login,
        };

        return {
            accessToken: this.jwtService.sign(payload),
            user: {
                id: githubUser.id,
                login: githubUser.login,
                avatarUrl: githubUser.avatar_url,
            },
        };
    }

    getGithubToken(userId: number) {
        return this.githubTokens.get(userId);
    }
}
