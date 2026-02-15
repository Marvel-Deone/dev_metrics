import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ReposService } from "./repos.service";

@ApiTags('Repos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({
    path: 'repos',
    version: '1',
})
export class ReposController {
    constructor(private readonly reposService: ReposService) { }

    @UseGuards(JwtAuthGuard)
    @Get(':owner/:repo/profile')
    async getRepoProfile(
        @Req() req: any,
        @Param('owner') owner: string,
        @Param('repo') repo: string,
    ) {
        return this.reposService.getRepoProfile(req.user, owner, repo);
    }
}

