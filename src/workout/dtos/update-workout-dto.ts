import { IsString } from "class-validator";

export class UpdateWorkoutDto {
  @IsString()
  workout_name: string;
}
