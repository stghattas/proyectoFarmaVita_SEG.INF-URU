import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('medicamentos')
export class Medicamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  lote: string;

  @Column('int')
  cantidad: number;

  @Column()
  fechaVencimiento: string;
}