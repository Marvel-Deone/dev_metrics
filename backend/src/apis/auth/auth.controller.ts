import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller({
    path: 'auth',
    version: '1',
})
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('github')
    async githubLogin(@Body('githubToken') githubToken: string) {
        if (!githubToken) {
            throw new BadRequestException('GitHub token missing');
        }

        return this.authService.exchangeGithubToken(githubToken);
    }
}
