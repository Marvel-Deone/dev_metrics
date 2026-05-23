import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';

import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

import { WorkspaceResponseDto } from './dto/workspace-response.dto';

import { WorkspacesService } from './workspaces.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { success } from 'src/common/utils/response.util';

@ApiTags('Workspaces')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workspaces')
export class WorkspacesController {
    constructor(
        private readonly workspacesService: WorkspacesService,
    ) { }

    // create workspace
    @Post()
    @ApiOperation({
        summary: 'Create workspace',
    })
    @ApiResponse({
        status: 201,
        type: WorkspaceResponseDto,
    })
    async createWorkspace(
        @CurrentUser() user: any,
        @Body() dto: CreateWorkspaceDto,
    ) {
        const workspace =
            await this.workspacesService.createWorkspace(
                user.userId,
                dto,
            );

        return success(
            workspace,
            'Workspace created successfully',
        );
    }

    // get my workspaces
    @Get()
    @ApiOperation({
        summary: 'Get user workspaces',
    })
    async getMyWorkspaces(
        @CurrentUser() user: any,
    ) {
        const workspaces =
            await this.workspacesService.getMyWorkspaces(
                user.userId,
            );

        return success(workspaces);
    }

    // get single workspace
    @Get(':id')
    @ApiOperation({
        summary: 'Get workspace by ID',
    })
    async getWorkspace(
        @Param('id') workspaceId: string,
        @CurrentUser() user: any,
    ) {
        const workspace =
            await this.workspacesService.getWorkspaceById(
                workspaceId,
                user.userId,
            );

        return success(workspace);
    }

    // update workspace
    @Patch(':id')
    @ApiOperation({
        summary: 'Update workspace',
    })
    async updateWorkspace(
        @Param('id') workspaceId: string,
        @CurrentUser() user: any,
        @Body() dto: UpdateWorkspaceDto,
    ) {
        const workspace =
            await this.workspacesService.updateWorkspace(
                workspaceId,
                user.userId,
                dto,
            );

        return success(
            workspace,
            'Workspace updated successfully',
        );
    }

    //  delete workspace
    @Delete(':id')
    @ApiOperation({
        summary: 'Delete workspace',
    })
    async deleteWorkspace(
        @Param('id') workspaceId: string,
        @CurrentUser() user: any,
    ) {
        await this.workspacesService.deleteWorkspace(
            workspaceId,
            user.userId,
        );

        return success(
            null,
            'Workspace deleted successfully',
        );
    }
}