import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { VisitService } from './visit.service';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('visit')
export class VisitController {
  constructor(private readonly visitService: VisitService) {}
  //  @Roles(Role.ADMIN, Role.USER)
  //  @Get()
  // async getAllVisits() {
  //   return this.visitService.getAllVisits();
  // }
  @Roles(Role.ADMIN, Role.USER)
  @Post()
  async createVisit(@Body() createVisitDto: CreateVisitDto) {
    return this.visitService.createVisit(createVisitDto);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  async updateVisit(@Param('id') id: string, @Body() body: Partial<CreateVisitDto>) {
    return this.visitService.updateVisit(id, body);
  }
  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteVisit(@Param('id') id: string) {
    return this.visitService.deleteVisit(id);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get('patient/:patientId')
  async getVisitsByPatient(@Param('patientId') patientId: string) {
    return this.visitService.getVisitsByPatient(patientId);
}

@Get()
findAll(
  @Query('page') page: string,
  @Query('limit') limit: string,
  @Query('result') result?: string,
  @Query('patientName') patientName?: string,
  @Query('patient') patient?: string,
  @Query('department') department?: string
) {
  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 20;
  
  return this.visitService.findAll(pageNumber, limitNumber, {
    result,
    patientName,
    patient,
    department
  });
}

}
