import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@Injectable()
export class WorkspaceService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.db.workspace.findMany();
  }

  async findOne(id: string) {
    const workspace = await this.prisma.db.workspace.findUnique({
      where: { id },
    });
    if (!workspace) throw new NotFoundException(`Workspace ${id} not found`);
    return workspace;
  }

  create(dto: CreateWorkspaceDto) {
    return this.prisma.db.workspace.create({ data: dto });
  }

  async update(id: string, dto: UpdateWorkspaceDto) {
    await this.findOne(id);
    return this.prisma.db.workspace.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.db.workspace.delete({ where: { id } });
  }

  findSpaces(id: string) {
    return this.prisma.db.space.findMany({ where: { workspaceId: id } });
  }
}
