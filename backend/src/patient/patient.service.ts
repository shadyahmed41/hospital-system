import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PatientService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createPatientDto: CreatePatientDto) {
    
    return await this.prisma.patient.create({
      data: createPatientDto
    });
  }

  // Updated with pagination
async findAll(page: number = 1, limit: number = 20, search?: string, section?: string, condition?: string) {
  const skip = (page - 1) * limit;
  
  // Build where clause for filters
  const where: any = {};
  
  if (search) {
    where.name = {
      contains: search,
      // mode: 'insensitive' // Remove this for count query
    };
  }
  
  if (section) {
    where.section = section;
  }
  
  if (condition) {
    where.MedicalConditions = condition;
  }
  
  // Get total count for pagination info - use simplified where
  const totalWhere: any = {};
  
  if (search) {
    totalWhere.name = {
      contains: search,
      // Don't use mode here for count
    };
  }
  
  if (section) {
    totalWhere.section = section;
  }
  
  if (condition) {
    totalWhere.MedicalConditions = condition;
  }
  
  const total = await this.prisma.patient.count({ where: totalWhere });
  
  // Get paginated data - can use mode in findMany
  const patients = await this.prisma.patient.findMany({
    where: {
      ...where,
      // Add mode only for findMany if your database supports it
      // Note: SQLite doesn't support case-insensitive LIKE by default
      // You may need to handle case-insensitive search differently
    },
    include: {
      _count: {
        select: { visits: true },
      },
      visits: false,
    },
    orderBy: { name: "asc" },
    skip,
    take: limit,
  });
  
  return {
    data: patients,
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

async searchPatients(name: string) {
  const names = name.trim().split(/\s+/).filter(n => n.length > 0);
  
  if (names.length < 3) {
    return [];
  }
  
  const searchResults = await this.prisma.patient.findMany({
    where: {
      OR: [
        ...names.map(namePart => ({
          name: {
            contains: namePart,
          }
        })),
        {
          name: {
            contains: name.trim(),
          }
        }
      ]
    },
    take: 20, // Get more results to filter
    orderBy: { name: 'asc' }
  });

  // Filter for better matches
  const trimmedSearchName = name.trim().toLowerCase();
  const namePartsLower = names.map(n => n.toLowerCase());
  
  const exactMatches = searchResults.filter(patient => {
    const patientName = patient.name.toLowerCase();
    
    // Check for exact match
    if (patientName === trimmedSearchName) {
      return true;
    }
    
    // Check if all name parts are present in the patient name
    const hasAllParts = namePartsLower.every(part => 
      patientName.includes(part)
    );
    
    // Count how many name parts match
    const matchedPartsCount = namePartsLower.filter(part =>
      patientName.includes(part)
    ).length;
    
    // Return only if all or most parts match (at least 2 for 3-part names)
    return hasAllParts || matchedPartsCount >= Math.min(2, names.length);
  });

  return exactMatches.slice(0, 10); // Return top matches
}
  

async findOne(id: string) {
  const patient = await this.prisma.patient.findUnique({
    where: { id },
    include: {
      visits: {
        orderBy: { createdAt: 'desc' }, // newest visits first
      },
    },
  });

  if (!patient) {
    throw new NotFoundException('Patient not found');
  }

  return patient;
}


  async update(id: string, updatePatientDto: UpdatePatientDto) {
  return await this.prisma.patient.update({
    where: { id },
    data: updatePatientDto,
  });
}

  async remove(id: string) {
  // Check if patient exists
  const patient = await this.prisma.patient.findUnique({
    where: { id },
  });

  if (!patient) {
    throw new NotFoundException('Patient not found');
  }

  // Then delete the patient
  return await this.prisma.patient.delete({
    where: { id },
  });
}
}
