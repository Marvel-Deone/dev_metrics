import { Module } from '@nestjs/common';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';
import { GitHubClient } from './github.client';

@Module({
  controllers: [GithubController],
  providers: [GithubService, GitHubClient],
  exports: [GitHubClient, GithubService]
})
export class GithubModule {}
