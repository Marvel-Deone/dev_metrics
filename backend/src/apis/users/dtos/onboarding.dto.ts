import { IsString } from 'class-validator';

export class CompleteOnboardingDto {
  @IsString()
  goal: string;
}