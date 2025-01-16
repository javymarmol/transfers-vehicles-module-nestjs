import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity('organizational_units')
export class OrganizationalUnit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Project, (project) => project.organizational_units)
  project: Project;

  @CreateDateColumn()
  created_at: Date;

  @ManyToMany(() => User, (user) => user.organizational_units)
  @JoinTable()
  users: User[];
}
