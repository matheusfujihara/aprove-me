import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/shared/entity/base.entity';
import { Receivable } from '@modules/receivables/domain/entities/receivables.entity';

@Entity('assignors')
export class Assignor extends BaseEntity {
  @Column({ type: 'varchar' })
  document: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  phone: string;

  @Column({ type: 'varchar' })
  name: string;

  @OneToMany(() => Receivable, (receivable) => receivable.assignor, {
    cascade: true,
  })
  receivables: Receivable[];
}
