import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import BaseEntity from './base.entity';
import UserPG from './users.entity';

@Entity('vehicles')
export default class VehiclePG extends BaseEntity {
    
  @Column({ type: 'varchar', nullable: false, unique: true })
  licensePlate: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  vin: string;

  @Column({ type: 'varchar', nullable: false })
  make: string;

  @Column({ type: 'varchar', nullable: false })
  vehicleType: string;

  @Column({ type: 'uuid', nullable: false })
  userUuid: string;

  @ManyToOne(() => UserPG)
  @JoinColumn({ name: 'userUuid', referencedColumnName: 'uuid' })
  user: UserPG;
}
