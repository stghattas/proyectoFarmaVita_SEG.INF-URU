import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { InventarioService } from './inventario.service.js';
import { JwtAuthGuard } from '../auth/jwt.guard.js';

@Controller('inventario')
@UseGuards(JwtAuthGuard)
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  @Get()
  obtenerTodos() {
    return this.inventarioService.obtenerInventario();
  }

  @Post()
  agregar(@Body() body: any) {
    return this.inventarioService.agregarMedicamento(body);
  }
}