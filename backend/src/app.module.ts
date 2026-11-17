import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module.js';
import { InventarioModule } from './inventory/inventario.module.js';
import { Medicamento } from './inventory/medicamento.entity.js';

@Module({
  imports: [
    // Conexión a la base de datos aislada en la red_datos
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'farma_db', // Nombre del contenedor en docker-compose
      port: 5432,
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'farma_segura_2026',
      database: process.env.POSTGRES_DB || 'farmaceutica_db',
      entities: [Medicamento],
      synchronize: true, // Sincroniza la estructura automáticamente (solo en dev)
    }),
    AuthModule,
    InventarioModule,
  ],
})
export class AppModule {}