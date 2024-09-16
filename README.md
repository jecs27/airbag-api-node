# Airbag Project

Este proyecto es una aplicación backend que gestiona usuarios y vehículos, utilizando una base de datos MongoDB para el almacenamiento de datos y una base de datos Postgresql para guardar una replica cada día.

## Características principales

- Gestión de usuarios
- Gestión de vehículos
- Conexión a base de datos MongoDB
- Autenticación de usuarios

## Requisitos previos

- Node.js (versión recomendada: 14.x o superior)
- MongoDB (local o remoto)

## Configuración

1. Clona el repositorio:
   ```
   git clone git@github.com:jecs27/airbag-api-node.git
   cd airbag-project
   ```

2. Instala las dependencias:
   ```
   npm ci --legacy-peer-deps
   ```

3. Crea un archivo `.env` en la raíz del proyecto basándote en el archivo `.env.example` y configura las variables de entorno necesarias:
   ```
   PORT=3000
   MONGODB_URI="tu_uri_de_mongodb"
   USER_EMAIL="tu_email"
   USER_PASSWORD="tu_contraseña"
   SECRET_KEY="tu_clave_secreta"
   SECRET_VALUE="tu_valor_secreto"
   ...
   ```

## Configuración de correo electrónico

Este proyecto utiliza Gmail para enviar correos electrónicos. Para configurar el envío de correos, sigue estos pasos:

1. Asegúrate de tener una cuenta de Gmail.

2. Habilita el acceso de aplicaciones menos seguras o, preferiblemente, configura una contraseña de aplicación:
   - Ve a tu cuenta de Google > Seguridad
   - En "Acceso a Google", selecciona "Contraseñas de aplicaciones"
   - Genera una nueva contraseña de aplicación para este proyecto

3. Añade las siguientes variables de entorno a tu archivo `.env`:
   ```
   EMAIL_USER=tu_correo@gmail.com
   EMAIL_PASS=tu_contraseña_de_aplicación
   ```

4. En el código, utiliza Nodemailer para enviar correos. Puedes basarte en la documentación oficial de Nodemailer para más detalles:
   [https://nodemailer.com/usage/using-gmail/](https://nodemailer.com/usage/using-gmail/)

Nota: Es importante usar contraseñas de aplicación en lugar de habilitar el acceso de aplicaciones menos seguras, ya que es más seguro y evita problemas de autenticación.


## Ejecución

Para iniciar el servidor podemos usar PM2 o nodemon, la opción mas sencilla es usando PM2

```
npm run start
```

## Pruebas

```
npm run test
```

## Docker

```
docker build -t airbag-api-node .
docker run -p 3000:3000 airbag-api-node
```

## Docker Compose

```
docker-compose up -d
```

## TypeORM Migrations

Para ejecutar las migraciones de TypeORM, sigue estos pasos:

1. Asegúrate de que la base de datos PostgreSQL esté configurada y accesible.

2. Ejecuta el siguiente comando para correr las migraciones:

   ```
   npm run typeorm migration:run
   ```

   Este comando aplicará todas las migraciones pendientes a la base de datos.

3. Si necesitas crear una nueva migración, puedes usar:

   ```
   npm run typeorm migration:generate
   ```

   Esto generará un nuevo archivo de migración en la carpeta `src/database/sql/migrations`.

4. Después de crear una nueva migración, asegúrate de ejecutar nuevamente el comando `migration:run` para aplicar los cambios.



