import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medicamento } from './medicamento.entity.js';

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Medicamento)
    private medicamentoRepo: Repository<Medicamento>,
  ) {}

  obtenerInventario() {
    return this.medicamentoRepo.find();
  }

  agregarMedicamento(datos: Partial<Medicamento>) {
    const nuevoMedicamento = this.medicamentoRepo.create(datos);
    return this.medicamentoRepo.save(nuevoMedicamento);
  }
}