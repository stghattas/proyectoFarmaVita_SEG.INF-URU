import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioService } from './inventario.service.js';
import { InventarioController } from './inventario.controller.js';
import { Medicamento } from './medicamento.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Medicamento])],
  providers: [InventarioService],
  controllers: [InventarioController]
})
export class InventarioModule {}