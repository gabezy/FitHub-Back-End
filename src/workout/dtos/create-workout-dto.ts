import { IsString } from 'class-validator';

export class CreateWorkoutDto {
  @IsString()
  workout_name: string;

  @IsString()
  user_id: string;
}
