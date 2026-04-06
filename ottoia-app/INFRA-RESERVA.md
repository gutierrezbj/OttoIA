# OttoIA - Reserva de Infraestructura SRS

Fecha: 6 Abril 2026
Protocolo: Checklist Kickoff SRS - Fase 3

---

## Asignacion de Puertos

| Puerto | Servicio | Container | Bind |
|--------|----------|-----------|------|
| 3130 | Frontend (React/Vite/Nginx) | ottoia-frontend | 127.0.0.1:3130:80 |
| 4130 | API (Express) | ottoia-api | 127.0.0.1:4130:5000 |
| 6130 | MongoDB 7 | ottoia-mongo | 127.0.0.1:6130:27017 |
| 6131 | Redis 7 | ottoia-redis | 127.0.0.1:6131:6379 |

**Offset: +130**
**Total containers: 4**
**Siguiente offset libre: +140**

---

## Dominio

- Produccion: ottoia.systemrapid.io
- DNS: Registro A en Hostinger -> 72.62.41.234
- SSL: Let's Encrypt via certbot
- Nginx vhost: / -> :3130, /api/ -> :4130

---

## Rutas en Servidores

| Servidor | IP | Tailscale | Ruta |
|----------|-----|-----------|------|
| PROD | 72.62.41.234 | 100.71.174.77 | /opt/apps/ottoia/ |
| STAGING | 187.77.71.102 | 100.110.52.22 | /opt/apps/ottoia/ |

---

## SA99 InfraService (cuando se haga deploy)

```javascript
// PROD
db.servers.updateOne(
  { _id: "vps-prod" },
  { $set: {
    "projects.OttoIA": {
      containers: ["ottoia-frontend", "ottoia-api", "ottoia-mongo", "ottoia-redis"],
      domain: "ottoia.systemrapid.io"
    }
  }}
);

// STAGING
db.servers.updateOne(
  { _id: "vps-staging" },
  { $set: {
    "projects.OttoIA": {
      containers: ["ottoia-frontend", "ottoia-api", "ottoia-mongo", "ottoia-redis"],
      domain: ""
    }
  }}
);
```
