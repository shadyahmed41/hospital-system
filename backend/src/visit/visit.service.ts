import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVisitDto } from './dto/create-visit.dto';
@Injectable()
export class VisitService {
    constructor(private prisma: PrismaService) {}
   async getAllVisits() {
    return this.prisma.visit.findMany({
      orderBy: { createdAt: 'desc' },
      include: { patient: true }, // include patient details
    });
  }

  async createVisit(data: CreateVisitDto) {
    // Check if patient exists
    const patient = await this.prisma.patient.findUnique({
      where: { id: data.patientId },
    });
    if (!patient) throw new NotFoundException('Patient not found');

    // Create visit
    return this.prisma.visit.create({
      data: {
        patientId: data.patientId,
        reason: data.reason,
        highBloodPressure: data.highBloodPressure,
        lowBloodPressure: data.lowBloodPressure,
        oxygenLevel: data.oxygenLevel,
        temprature: data.temprature,
        heartBeat: data.heartBeat,
        result: data.result,
        note: data.note,
        medicineDosage: data.medicineDosage,
        medicineName: data.medicineName,
      },
      include: { patient: true }, // return patient info along with visit
    });
  }

   // Edit a visit
  async updateVisit(id: string, data: Partial<CreateVisitDto>) {
    const visit = await this.prisma.visit.findUnique({ where: { id } });
    if (!visit) throw new NotFoundException('Visit not found');

    // If patientId is being updated, check it exists
    if (data.patientId) {
      const patient = await this.prisma.patient.findUnique({
        where: { id: data.patientId },
      });
      if (!patient) throw new NotFoundException('Patient not found');
    }

    return this.prisma.visit.update({
      where: { id },
      data,
      include: { patient: true },
    });
  }

  // Delete a visit
  async deleteVisit(id: string) {
    const visit = await this.prisma.visit.findUnique({ where: { id } });
    if (!visit) throw new NotFoundException('Visit not found');

    return this.prisma.visit.delete({ where: { id } });
  }

  async getVisitsByPatient(patientId: string) {
  const patient = await this.prisma.patient.findUnique({
    where: { id: patientId },
  });

  if (!patient) {
    throw new NotFoundException("Patient not found");
  }

  return this.prisma.visit.findMany({
    where: { patientId },
    orderBy: { createdAt: 'desc' },
    include: { patient: true }, // returns patient info for each visit
  });
}

// Update your VisitService findAll method to support pagination and filters
async findAll(page: number = 1, limit: number = 20, filters: any = {}) {
  const skip = (page - 1) * limit;
  
  const where: any = {};
  
  // Result filter
  if (filters.result && filters.result !== 'all visits') {
    where.result = filters.result;
  }
  
  // Patient name search
  if (filters.patientName) {
    where.patient = {
      name: {
        contains: filters.patientName,
      }
    };
  }
  
  // Specific patient filter
  if (filters.patient) {
    where.patient = {
      ...where.patient,
      name: filters.patient
    };
  }
  
  // Department filter
  if (filters.department) {
    where.patient = {
      ...where.patient,
      section: filters.department
    };
  }
  
  // Get total count
  const total = await this.prisma.visit.count({
    where
  });
  
  // Get paginated data
  const visits = await this.prisma.visit.findMany({
    where,
    include: {
      patient: true
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit,
  });
  
  return {
    data: visits,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1
    }
  };
}

}