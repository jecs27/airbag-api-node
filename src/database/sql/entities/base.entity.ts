import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export default abstract class BaseEntity {

  @PrimaryGeneratedColumn('uuid')
    uuid?: string;

  @CreateDateColumn({ name: 'created_at' })
    createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
    updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt?: Date;
}
