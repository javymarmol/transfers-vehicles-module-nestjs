import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transfer } from '../../transfers/entities/transfer.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  plate: string;

  @Column()
  service: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Transfer, (transfer) => transfer.vehicle)
  transfers: Transfer[];
}
