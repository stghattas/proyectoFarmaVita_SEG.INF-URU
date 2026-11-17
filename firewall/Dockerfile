FROM alpine:latest

# Instalar nftables y herramientas de red
RUN apk add --no-cache nftables iproute2 procps

# Copiar archivos de configuración y el script de inicio
COPY nftables.conf /etc/nftables.conf
COPY start.sh /start.sh

# Dar permisos de ejecución al script
RUN chmod +x /start.sh

# Ejecutar el script de inicio
CMD ["/start.sh"]