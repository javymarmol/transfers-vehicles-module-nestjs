import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
  ) {}
  create(data: CreateProjectDto) {
    const project = this.projectsRepository.create(data);
    return this.projectsRepository.save(project);
  }

  findAll() {
    return this.projectsRepository.find();
  }

  async findOne(id: number) {
    const project = await this.projectsRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const project = await this.findOne(id);
    this.projectsRepository.merge(project, updateProjectDto);
    return this.projectsRepository.save(project);
  }

  async remove(id: number) {
    const project = await this.findOne(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return await this.projectsRepository.delete(id);
  }
}
