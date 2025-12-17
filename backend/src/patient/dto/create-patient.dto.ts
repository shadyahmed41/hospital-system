import { IsOptional } from "class-validator";
import { IsString, Length } from "class-validator";

export class CreatePatientDto {
    @IsString()
    readonly name: string;

    @IsOptional()
    @IsString()
    @Length(14, 14)
    readonly nationalId: string;

    @IsString()
    readonly section: string;
    
    @IsOptional()
    @IsString()
    readonly MedicalConditions: string;

    @IsOptional()
    @IsString()
    readonly BloodType: string;

    @IsOptional()
    @IsString()
    readonly JoiningDate?: string;

    @IsOptional()
    @IsString()
    readonly OutDate?: string;


}
