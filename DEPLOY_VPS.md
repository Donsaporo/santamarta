# Guia de Despliegue en VPS Ubuntu 24.04

Esta guia asume que tienes un VPS con Ubuntu 24.04 y acceso root.
Reemplaza `tudominio.com` con tu dominio real en todos los comandos.

---

## 1. Actualizar el sistema

```bash
apt update && apt upgrade -y
```

## 2. Instalar Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

Verificar:

```bash
node -v
npm -v
```

## 3. Instalar MySQL 8

```bash
apt install -y mysql-server
systemctl start mysql
systemctl enable mysql
```

Asegurar la instalacion:

```bash
mysql_secure_installation
```

Responde a las preguntas:
- VALIDATE PASSWORD: Y (y elige nivel medio o fuerte)
- Cambia la contrasena root: Y (pon una contrasena segura y guardala)
- Eliminar usuarios anonimos: Y
- Deshabilitar login remoto de root: Y
- Eliminar base de datos de prueba: Y
- Recargar privilegios: Y

## 4. Crear la base de datos y usuario

```bash
mysql -u root -p
```

Dentro de MySQL ejecuta (cambia `TU_PASSWORD_SEGURA` por una contrasena real):

```sql
CREATE DATABASE santa_marta CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'santa_marta_user'@'localhost' IDENTIFIED BY 'TU_PASSWORD_SEGURA';
GRANT ALL PRIVILEGES ON santa_marta.* TO 'santa_marta_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 5. Ejecutar el esquema de la base de datos

```bash
mysql -u santa_marta_user -p santa_marta < /ruta/al/proyecto/server/setup.sql
```

NOTA: El archivo `setup.sql` ya tiene `USE santa_marta;` al inicio, asi que esto creara todas las tablas y datos iniciales.

## 6. Instalar Nginx

```bash
apt install -y nginx
systemctl start nginx
systemctl enable nginx
```

## 7. Instalar PM2 (gestor de procesos)

```bash
npm install -g pm2
```

## 8. Instalar Certbot (SSL gratuito)

```bash
apt install -y certbot python3-certbot-nginx
```

## 9. Subir el proyecto al servidor

Desde tu maquina local:

```bash
scp -r ./proyecto root@IP_DEL_SERVIDOR:/var/www/santa-marta
```

O si usas Git:

```bash
cd /var/www
git clone TU_REPO santa-marta
```

## 10. Instalar dependencias

Frontend:

```bash
cd /var/www/santa-marta
npm install
npm run build
```

Backend:

```bash
cd /var/www/santa-marta/server
npm install
```

## 11. Configurar variables de entorno del servidor

```bash
nano /var/www/santa-marta/server/.env
```

Contenido (cambia los valores):

```
DB_HOST=localhost
DB_USER=santa_marta_user
DB_PASSWORD=TU_PASSWORD_SEGURA
DB_NAME=santa_marta
JWT_SECRET=GENERA_UNA_CADENA_ALEATORIA_DE_64_CARACTERES
SETUP_KEY=UNA_CLAVE_TEMPORAL_PARA_CREAR_ADMIN
PORT=3001
```

Para generar un JWT_SECRET aleatorio:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## 12. Crear el usuario administrador

Con el servidor en marcha temporalmente:

```bash
cd /var/www/santa-marta/server
node index.js &
```

Ejecuta este comando (cambia los valores):

```bash
curl -X POST http://localhost:3001/api/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tudominio.com","password":"TuContrasenaSegura","setup_key":"UNA_CLAVE_TEMPORAL_PARA_CREAR_ADMIN"}'
```

Deberia responder con `{"success":true, ...}`.

Detener el proceso temporal:

```bash
kill %1
```

## 13. Iniciar la API con PM2

```bash
cd /var/www/santa-marta/server
pm2 start index.js --name santa-marta-api
pm2 save
pm2 startup
```

El ultimo comando mostrara una linea que debes copiar y ejecutar para que PM2 inicie automaticamente al reiniciar.

## 14. Configurar Nginx

```bash
nano /etc/nginx/sites-available/santa-marta
```

Contenido:

```nginx
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;

    # Frontend (archivos estaticos)
    root /var/www/santa-marta/dist;
    index index.html;

    # Proxy API al backend Node.js
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Proxy imagenes subidas
    location /uploads/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # SPA: todas las rutas al index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache para assets estaticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Tamano maximo de subida (para imagenes del blog)
    client_max_body_size 10M;
}
```

Activar el sitio:

```bash
ln -s /etc/nginx/sites-available/santa-marta /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

## 15. Configurar SSL con Let's Encrypt

Asegurate de que tu dominio apunte al IP del VPS (registro A en DNS).

```bash
certbot --nginx -d tudominio.com -d www.tudominio.com
```

Sigue las instrucciones. Certbot configurara SSL automaticamente y renovara los certificados.

Verificar renovacion automatica:

```bash
certbot renew --dry-run
```

## 16. Configurar Firewall

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
ufw status
```

## 17. Verificar que todo funciona

- Visita `https://tudominio.com` - deberia cargar la pagina
- Visita `https://tudominio.com/admin/login` - deberia cargar el login
- Inicia sesion con las credenciales que creaste en el paso 12

---

## Comandos utiles

### Ver logs de la API

```bash
pm2 logs santa-marta-api
```

### Reiniciar la API

```bash
pm2 restart santa-marta-api
```

### Ver estado de PM2

```bash
pm2 status
```

### Actualizar el sitio (despues de cambios)

```bash
cd /var/www/santa-marta

# Actualizar codigo
git pull  # o scp los archivos nuevos

# Rebuild frontend
npm install
npm run build

# Reinstalar dependencias del servidor si cambiaron
cd server
npm install

# Reiniciar API
pm2 restart santa-marta-api
```

### Acceder a MySQL

```bash
mysql -u santa_marta_user -p santa_marta
```

### Backup de la base de datos

```bash
mysqldump -u santa_marta_user -p santa_marta > backup_$(date +%Y%m%d).sql
```

### Restaurar backup

```bash
mysql -u santa_marta_user -p santa_marta < backup_FECHA.sql
```

---

## Notas importantes

- El `SETUP_KEY` en el `.env` del servidor solo se usa una vez para crear el admin. Despues puedes eliminarlo o cambiarlo.
- Las imagenes subidas se guardan en `server/uploads/`. Asegurate de incluir esta carpeta en tus backups.
- Si cambias la contrasena de MySQL, actualiza tambien el `.env` del servidor y reinicia con `pm2 restart santa-marta-api`.
- Los analytics (visitas) se registran automaticamente cuando alguien navega el sitio.
