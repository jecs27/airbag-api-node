import { Entity, Column } from 'typeorm';
import BaseEntity from './base.entity';

@Entity('users')
export default class UserPG extends BaseEntity {

  @Column({ type: 'varchar', name: 'name', nullable: false })
    name: string;

  @Column({ type: 'varchar', nullable: false, unique: true, length: 10 })
    phone: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
    email: string;
}
