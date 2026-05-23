// // import { Controller } from '@nestjs/common';

// // @Controller('github')
// // export class GithubController {

// // }


// import { Controller, Get, Query, Headers } from '@nestjs/common';
// import { GithubService } from './github.service';

// @Controller('github')
// export class GithubController {
//   constructor(private readonly githubService: GithubService) {}

//   @Get('repos')
//   async getRepos(
//     @Query('login') login: string,
//     @Query('cursor') cursor: string,
//     @Headers('authorization') auth: string
//   ) {
//     const token = auth?.replace('Bearer ', '');

//     const data = await this.githubService.getUserRepos(
//       login,
//       token,
//       20,
//       cursor || null
//     );

//     const repos = data.user.repositories.nodes;
//     const pageInfo = data.user.repositories.pageInfo;

//     return {
//       repos,
//       nextCursor: pageInfo.endCursor,
//       hasMore: pageInfo.hasNextPage,
//     };
//   }
// }

import {
    Controller,
    Get,
    Query,
    Headers,
    BadRequestException,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { GithubService } from './github.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { buildReposResponse } from '../repos/assemblers/repo.assembler';

interface Repository {
    id: string;
    name: string;
    url: string;
    isPrivate: boolean;
    stargazerCount: number;
    forkCount: number;
    primaryLanguage?: {
        name: string;
        color: string;
    } | null;
    pushedAt: string;
    updatedAt: string;
}

interface PageInfo {
    endCursor: string | null;
    hasNextPage: boolean;
}

interface GithubApiResponse {
    user: {
        repositories: {
            nodes: Repository[];
            pageInfo: PageInfo;
            totalCount: number;
        };
    };
}

@ApiTags('Github')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({
    path: 'github',
    version: '1',
})
export class GithubController {
    constructor(private readonly githubService: GithubService) { }

    @UseGuards(JwtAuthGuard)
    @Get('repos')
    async getRepos(
        @Query('login') login: string,
        @Query('cursor') cursor: string,
        @Headers('authorization') authHeader: string
    ) {
        const token = authHeader.replace('Bearer ', '');
        const data = await this.githubService.getUserRepos(
            login,
            token,
            20,
            cursor || undefined
        ) as GithubApiResponse;

        return buildReposResponse(data);
        //     // Validate inputs
        //     if (!login) {
        //         throw new BadRequestException('Missing "login" query param');
        //     }

        //     if (!authHeader) {
        //         throw new UnauthorizedException('Missing Authorization header');
        //     }

        //     const token = authHeader.replace('Bearer ', '');

        //     try {
        //         const data = await this.githubService.getUserRepos(
        // login,
        // token,
        // 20,
        // cursor || undefined
        //         ) as GithubApiResponse;

        //         const repoConnection = data?.user?.repositories;

        //         if (!repoConnection) {
        //             throw new BadRequestException('Failed to fetch repositories');
        //         }

        //         const { nodes, pageInfo, totalCount } = repoConnection;

        //         // Shape response for frontend
        //         const repos = nodes.map((repo: any) => ({
        //             id: repo.id,
        //             name: repo.name,
        //             url: repo.url,
        //             private: repo.isPrivate,
        //             stars: repo.stargazerCount,
        //             forks: repo.forkCount,
        //             language: repo.primaryLanguage?.name || null,
        //             languageColor: repo.primaryLanguage?.color || null,
        //             pushedAt: repo.pushedAt,
        //             updatedAt: repo.updatedAt,
        //         }));

        //         return {
        //             repos,
        //             nextCursor: pageInfo.endCursor,
        //             hasMore: pageInfo.hasNextPage,
        //             totalCount,
        //         };
        //     } catch (error) {
        //         console.error('GitHub repos error:', error);

        //         throw new BadRequestException(
        //             error?.message || 'Failed to fetch repositories'
        //         );
        //     }
        }
    }