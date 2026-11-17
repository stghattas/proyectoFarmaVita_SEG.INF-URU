import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const ldap = require('ldapjs');

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validarUsuarioLdap(username: string, pass: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const client = ldap.createClient({
        url: process.env.LDAP_URL || 'ldap://farma_ldap:389'
      });

      client.on('error', (err: any) => {
        reject(new InternalServerErrorException('Fallo al contactar el directorio LDAP'));
      });

      const bindDN = `cn=${username},ou=almacen,dc=farmaceutica,dc=local`;

      client.bind(bindDN, pass, (err: any) => {
        client.unbind();

        if (err) {
          if (err.name === 'InvalidCredentialsError' || err.name === 'NoSuchObjectError') {
            return reject(new UnauthorizedException('Usuario o contraseña incorrectos'));
          }
          return reject(new InternalServerErrorException('Error interno de validación'));
        }

        const payload = { sub: username, role: 'ROLE_WAREHOUSE' };
        resolve({
          access_token: this.jwtService.sign(payload),
          role: payload.role
        });
      });
    });
  }
}