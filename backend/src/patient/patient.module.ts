import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { PatientCleanupService } from './patient-cleanup.service'; // Add this import

@Module({
  controllers: [PatientController],
  providers: [PatientService,PatientCleanupService],
})
export class PatientModule {}
