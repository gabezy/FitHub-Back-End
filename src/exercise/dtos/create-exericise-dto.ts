import { IsNumber, IsString } from 'class-validator';
export class CreateExerciseDto {
  @IsString()
  exercise_name: string;

  @IsNumber()
  weight: number;

  @IsNumber()
  reps: number;

  @IsNumber()
  sets: number;

  @IsString()
  workout_id: string;

  notes?: string;
}
