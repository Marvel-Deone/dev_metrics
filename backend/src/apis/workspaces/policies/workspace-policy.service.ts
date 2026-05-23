import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class WorkspacePolicyService {
  ensureAdmin(memberRole: string) {
    if (memberRole !== 'ADMIN') {
      throw new ForbiddenException(
        'Admin access required',
      )
    }
  }

   preventSelfRemoval(
    currentUserId: string,
    targetUserId: string,
  ) {
    if (currentUserId === targetUserId) {
      throw new ForbiddenException(
        'You cannot remove yourself',
      );
    }
  }
}