import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Project } from '../../projects/entities/project.entity';
import { OrganizationalUnit } from '../../organizational_units/entities/organizational_unit.entity';
import { Role } from '../../permissions/entities/role.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password_hash: string;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToMany(() => Project, (project) => project.users)
  @JoinTable()
  projects: Project[];

  @ManyToMany(() => OrganizationalUnit, (unit) => unit.users)
  @JoinTable()
  organizational_units: OrganizationalUnit[];

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;
}
