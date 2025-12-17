import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateVisitDto {
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsString()
  @IsNotEmpty()
  highBloodPressure: string;

  @IsString()
  @IsNotEmpty()
  lowBloodPressure: string;

  @IsString()
  @IsNotEmpty()
  oxygenLevel: string;

  @IsString()
  @IsNotEmpty()
  temprature: string;

  @IsString()
  @IsNotEmpty()
  heartBeat: string;

  @IsString()
  @IsNotEmpty()
  result: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsString()
  @IsOptional()
  medicineName?: string;

  @IsString()
  @IsOptional()
  medicineDosage?: string;
}
