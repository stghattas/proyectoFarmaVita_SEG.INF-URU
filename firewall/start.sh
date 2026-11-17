#!/bin/sh
echo "🛡️  Iniciando Firewall Perimetral (nftables)..."

# Asegurar que el reenvío de IP esté activo
sysctl -w net.ipv4.ip_forward=1 > /dev/null 2>&1

# Aplicar reglas. Si 'flush ruleset' falla, no detenemos el script.
nft -f /etc/nftables.conf || echo "⚠️ Advertencia al aplicar reglas (puede ser normal en primer inicio)"

echo "✅ Firewall activo. Reglas cargadas:"
nft list ruleset

# Mantener el contenedor vivo indefinidamente
echo "🔄 Firewall en espera..."
tail -f /dev/null