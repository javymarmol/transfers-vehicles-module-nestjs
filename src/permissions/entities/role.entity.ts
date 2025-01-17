import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from './permission.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  description: string;
  @ManyToMany(() => Permission, (permission) => permission.roles)
  permissions: Permission[];
  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
