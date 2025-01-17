import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
import { OrganizationalUnit } from '../../organizational_units/entities/organizational_unit.entity';

@Entity('transfers')
export class Transfer {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column()
  type: string;

  @Column()
  vehicle_id: number;

  @Column()
  client_id: number;

  @Column()
  transmitter_id: number;

  @Column()
  project_id: number;

  @Column()
  organizational_unit_id: number;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.transfers)
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'client_id' })
  client: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'transmitter_id' })
  transmitter: User;

  @ManyToOne(() => Project, (project) => project.id)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(
    () => OrganizationalUnit,
    (organizationalUnit) => organizationalUnit.id,
  )
  @JoinColumn({ name: 'organizational_unit_id' })
  organizationalUnit: OrganizationalUnit;
}
