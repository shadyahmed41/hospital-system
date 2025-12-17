import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PatientCleanupService {
  private readonly logger = new Logger(PatientCleanupService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Run daily at 12:00 AM (for testing: EVERY_MINUTE)
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handlePatientCleanup() {
    this.logger.log('Starting patient cleanup job (45-day cutoff)...');
    
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of day
      
      // Calculate cutoff date: today + 45 days
      const cutoffDate = new Date(today);
      cutoffDate.setDate(cutoffDate.getDate() + 45);
      
      // Format dates for comparison (YYYY-MM-DD)
      const todayStr = today.toISOString().split('T')[0];
      const cutoffDateStr = cutoffDate.toISOString().split('T')[0];
      
      this.logger.log(`Today: ${todayStr}`);
      this.logger.log(`Cutoff date (today + 45 days): ${cutoffDateStr}`);
      this.logger.log(`Looking for patients with OutDate < ${cutoffDateStr}`);
      
      // Find patients whose OutDate is BEFORE the cutoff date
      const patientsToDelete = await this.prisma.patient.findMany({
        where: {
          AND: [
            { OutDate: { not: null } },
            { OutDate: { not: '' } },
            { OutDate: { lt: cutoffDateStr } }, // OutDate is BEFORE cutoff date
          ]
        },
        select: {
          id: true,
          name: true,
          OutDate: true,
          _count: {
            select: { visits: true }
          }
        },
        orderBy: {
          OutDate: 'asc' // Sort by OutDate to see oldest first
        }
      });

      this.logger.log(`Found ${patientsToDelete.length} patients with OutDate before ${cutoffDateStr}`);
      
      // Log details about patients to be deleted
      patientsToDelete.forEach(patient => {
        // Add null check before creating Date object
        if (!patient.OutDate) return;
        
        const outDate = new Date(patient.OutDate);
        const daysDiff = Math.floor((today.getTime() - outDate.getTime()) / (1000 * 60 * 60 * 24));
        const status = daysDiff > 45 ? `(OVERDUE by ${daysDiff - 45} days)` : `(within 45-day period)`;
        
        this.logger.log(`- ${patient.name}: OutDate=${patient.OutDate} ${status}, Visits=${patient._count.visits}`);
      });

      // Delete patients whose OutDate is before the cutoff
      let deletedCount = 0;
      let failedCount = 0;
      
      for (const patient of patientsToDelete) {
        try {
          // Add null check (shouldn't happen due to query filter, but safe)
          if (!patient.OutDate) {
            this.logger.warn(`Skipping patient "${patient.name}" with null OutDate`);
            continue;
          }
          
          // Calculate how many days past the out date
          const patientOutDate = new Date(patient.OutDate);
          const daysSinceOutDate = Math.floor((today.getTime() - patientOutDate.getTime()) / (1000 * 60 * 60 * 24));
          
          // First delete all visits for this patient
          const deletedVisits = await this.prisma.visit.deleteMany({
            where: { patientId: patient.id }
          });
          
          this.logger.log(`Deleted ${deletedVisits.count} visits for patient "${patient.name}"`);
          
          // Then delete the patient
          await this.prisma.patient.delete({
            where: { id: patient.id }
          });
          
          deletedCount++;
          this.logger.log(`Deleted patient "${patient.name}" (OutDate: ${patient.OutDate}, ${daysSinceOutDate} days ago)`);
          
        } catch (error) {
          failedCount++;
          this.logger.error(`Failed to delete patient "${patient.name}":`, error.message);
        }
      }

      // Log summary
      const totalProcessed = patientsToDelete.length;
      const successRate = totalProcessed > 0 ? Math.round((deletedCount / totalProcessed) * 100) : 0;
      
      this.logger.log(`Cleanup completed: ${deletedCount} deleted, ${failedCount} failed out of ${totalProcessed} (${successRate}% success)`);
      
      // Optional: Log remaining patients with OutDate
      const remainingPatients = await this.prisma.patient.findMany({
        where: {
          AND: [
            { OutDate: { not: null } },
            { OutDate: { not: '' } },
            { OutDate: { gte: cutoffDateStr } }, // OutDate is ON or AFTER cutoff
          ]
        },
        select: {
          name: true,
          OutDate: true,
        },
        orderBy: {
          OutDate: 'asc'
        },
        take: 10 // Limit for logging
      });
      
      if (remainingPatients.length > 0) {
        this.logger.log(`Patients remaining (OutDate >= ${cutoffDateStr}): ${remainingPatients.length}`);
        remainingPatients.forEach(p => {
          this.logger.log(`- ${p.name}: OutDate=${p.OutDate}`);
        });
      }
      
    } catch (error) {
      this.logger.error('Error in patient cleanup job:', error);
      this.logger.error(error.stack);
    }
  }
  
  // Manual trigger with detailed report
  async runCleanupNow(): Promise<{
    deleted: number;
    failed: number;
    total: number;
    cutoffDate: string;
    details: Array<{
      name: string;
      outDate: string;
      daysSinceOutDate: number;
      status: string;
    }>;
  }> {
    this.logger.log('Running manual patient cleanup...');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate cutoff date: today + 45 days
    const cutoffDate = new Date(today);
    cutoffDate.setDate(cutoffDate.getDate() + 45);
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0];
    
    const patientsToDelete = await this.prisma.patient.findMany({
      where: {
        AND: [
          { OutDate: { not: null } },
          { OutDate: { not: '' } },
          { OutDate: { lt: cutoffDateStr } },
        ]
      },
      select: {
        id: true,
        name: true,
        OutDate: true,
      },
    });

    const details = patientsToDelete.map(patient => {
      // Add null check
      if (!patient.OutDate) {
        return {
          name: patient.name,
          outDate: 'N/A',
          daysSinceOutDate: 0,
          status: 'NO_DATE'
        };
      }
      
      const outDate = new Date(patient.OutDate);
      const daysSinceOutDate = Math.floor((today.getTime() - outDate.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        name: patient.name,
        outDate: patient.OutDate,
        daysSinceOutDate: daysSinceOutDate,
        status: daysSinceOutDate > 45 ? 'OVERDUE' : 'WITHIN_GRACE_PERIOD'
      };
    });

    let deletedCount = 0;
    let failedCount = 0;
    
    for (const patient of patientsToDelete) {
      try {
        // Add null check
        if (!patient.OutDate) {
          this.logger.warn(`Skipping patient "${patient.name}" with null OutDate`);
          continue;
        }
        
        // Delete visits first
        await this.prisma.visit.deleteMany({
          where: { patientId: patient.id }
        });
        
        // Delete patient
        await this.prisma.patient.delete({
          where: { id: patient.id }
        });
        
        deletedCount++;
      } catch (error) {
        failedCount++;
        this.logger.error(`Failed to delete ${patient.name}:`, error.message);
      }
    }
    
    this.logger.log(`Manual cleanup completed: ${deletedCount} deleted, ${failedCount} failed`);
    
    return {
      deleted: deletedCount,
      failed: failedCount,
      total: patientsToDelete.length,
      cutoffDate: cutoffDateStr,
      details: details
    };
  }
  
  // Debug method to see what would be deleted without actually deleting
  async previewCleanup(): Promise<{
    cutoffDate: string;
    patientsToDelete: Array<{
      id: string;
      name: string;
      OutDate: string;
      daysSinceOutDate: number;
      visitsCount: number;
    }>;
    summary: {
      total: number;
      overdue: number; // > 45 days
      withinGrace: number; // <= 45 days
    };
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const cutoffDate = new Date(today);
    cutoffDate.setDate(cutoffDate.getDate() + 45);
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0];
    
    const patients = await this.prisma.patient.findMany({
      where: {
        AND: [
          { OutDate: { not: null } },
          { OutDate: { not: '' } },
          { OutDate: { lt: cutoffDateStr } },
        ]
      },
      select: {
        id: true,
        name: true,
        OutDate: true,
        _count: {
          select: { visits: true }
        }
      },
      orderBy: {
        OutDate: 'asc'
      }
    });
    
    const processedPatients = patients.map(patient => {
      // Add null check
      if (!patient.OutDate) {
        return {
          id: patient.id,
          name: patient.name,
          OutDate: 'N/A',
          daysSinceOutDate: 0,
          visitsCount: patient._count.visits
        };
      }
      
      const outDate = new Date(patient.OutDate);
      const daysSinceOutDate = Math.floor((today.getTime() - outDate.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        id: patient.id,
        name: patient.name,
        OutDate: patient.OutDate,
        daysSinceOutDate: daysSinceOutDate,
        visitsCount: patient._count.visits
      };
    });
    
    const overdueCount = processedPatients.filter(p => p.daysSinceOutDate > 45).length;
    const withinGraceCount = processedPatients.filter(p => p.daysSinceOutDate <= 45).length;
    
    return {
      cutoffDate: cutoffDateStr,
      patientsToDelete: processedPatients,
      summary: {
        total: processedPatients.length,
        overdue: overdueCount,
        withinGrace: withinGraceCount
      }
    };
  }
  
  // Alternative: Type-safe approach with helper functions
  private parseDateSafely(dateString: string | null): Date | null {
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      // Check if date is valid
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  }
  
  private calculateDaysDifference(fromDate: Date, toDate: Date): number {
    const timeDiff = Math.abs(toDate.getTime() - fromDate.getTime());
    return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  }
  
  // Simplified version using helper functions
  async handlePatientCleanupSimple() {
    this.logger.log('Starting simplified patient cleanup...');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const cutoffDate = new Date(today);
    cutoffDate.setDate(cutoffDate.getDate() + 45);
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0];
    
    const patientsToDelete = await this.prisma.patient.findMany({
      where: {
        AND: [
          { OutDate: { not: null } },
          { OutDate: { not: '' } },
          { OutDate: { lt: cutoffDateStr } },
        ]
      },
    });
    
    let deletedCount = 0;
    
    for (const patient of patientsToDelete) {
      // Use helper function for safe date parsing
      const outDate = this.parseDateSafely(patient.OutDate);
      
      if (!outDate) {
        this.logger.warn(`Invalid OutDate for patient "${patient.name}": ${patient.OutDate}`);
        continue;
      }
      
      const daysSinceOutDate = this.calculateDaysDifference(outDate, today);
      
      try {
        await this.prisma.visit.deleteMany({
          where: { patientId: patient.id }
        });
        
        await this.prisma.patient.delete({
          where: { id: patient.id }
        });
        
        deletedCount++;
        this.logger.log(`Deleted "${patient.name}" - OutDate: ${patient.OutDate} (${daysSinceOutDate} days ago)`);
        
      } catch (error) {
        this.logger.error(`Failed to delete "${patient.name}":`, error.message);
      }
    }
    
    this.logger.log(`Simplified cleanup completed: ${deletedCount}/${patientsToDelete.length} deleted`);
  }
}