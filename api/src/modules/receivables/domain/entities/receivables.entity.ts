import { Assignor } from '@modules/assignors/domain/entities/assignors.entity';
import { BaseEntity } from 'src/shared/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('receivables')
export class Receivable extends BaseEntity {
  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  value: number;

  @Column({
    type: 'date',
  })
  emissionDate: Date;

  @Column({ name: 'assignor_id', type: 'integer' })
  assignorId: number;

  @ManyToOne(() => Assignor, (assignor) => assignor.receivables, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'assignor_id' })
  assignor: Assignor;
}
