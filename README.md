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


## Cómo consumir la API

Para utilizar esta API, sigue estos pasos:

1. Registro de usuario:
   - Método: POST
   - Ruta: `/users`
   - Body:
     ```json
     {
       "name": "prueba",
       "email": "email@email.com",
       "phone": "5555555555"
     }
     ```
   - Respuesta exitosa:
     ```json
     {
       "status": 201,
       "message": "User created",
       "data": {
         "user": {
           "uuid": "generated-uuid",
           "name": "prueba",
           "email": "email@email.com",
           "phone": "5555555555"
         }
       }
     }
     ```

2. Iniciar sesión:
   - Método: POST
   - Ruta: `/users/sign-in`
   - Body:
     ```json
     {
       "email": "email@email.com"
     }
     ```
   - Respuesta exitosa:
     ```json
     {
       "status": 200,
       "message": "Sign in successful, code sent to email",
       "data": {}
     }
     ```

3. Completar login:
   - Método: POST
   - Ruta: `/login`
   - Body:
     ```json
     {
       "email": "email@email.com",
       "code": "código-recibido-por-email"
     }
     ```
   - Respuesta exitosa:
     ```json
     {
       "status": 200,
       "message": "Login successful",
       "data": {
         "user": {
           "uuid": "user-uuid",
           "email": "email@email.com"
         },
         "token": "jwt-token"
       }
     }
     ```

4. Obtener datos del usuario:
   - Método: GET
   - Ruta: `/users`
   - Headers:
     ```
     Authorization: Bearer jwt-token
     ```
   - Respuesta exitosa:
     ```json
     {
       "status": 200,
       "message": "User data",
       "data": {
         "user": {
           "uuid": "user-uuid",
           "name": "prueba",
           "email": "jesuscalderon2708@gmail.com",
           "phone": "5555555555"
         }
       }
     }
     ```

Asegúrate de incluir el token JWT en el header `Authorization` para las rutas protegidas después de iniciar sesión.

Para los endpoint de vehiculos es necesario el uso de jwt para tomar el uso del usuario


5. Crear vehículo:
   - Método: POST
   - Ruta: `/vehicles`
   - Headers:
     ```
     Authorization: Bearer jwt-token
     ```
   - Body:
     ```json
     {
       "licensePlate": "ASD-416-A",
       "vin": "1M8GDM9A_KP042788",
       "make": "NISSAN",
       "vehicleType": "SENTRA"
     }
     ```
   - Respuesta exitosa:
     ```json
     {
       "status": 201,
       "message": "Vehicle created",
       "data": {
         "vehicle": {
           "uuid": "vehicle-uuid",
           "licensePlate": "ASD-416-A",
           "vin": "1M8GDM9A_KP042788",
           "make": "NISSAN",
           "vehicleType": "SENTRA",
           "userUuid": "user-uuid"
         }
       }
     }
     ```

6. Obtener vehículos del usuario:
   - Método: GET
   - Ruta: `/vehicles`
   - Headers:
     ```
     Authorization: Bearer jwt-token
     ```
   - Respuesta exitosa:
     ```json
     {
       "status": 200,
       "message": "User vehicles",
       "data": {
         "vehicles": [
           {
             "uuid": "vehicle-uuid-1",
             "licensePlate": "ASD-416-A",
             "vin": "1M8GDM9A_KP042788",
             "make": "NISSAN",
             "vehicleType": "SENTRA"
           },
           {
             "uuid": "vehicle-uuid-2",
             "licensePlate": "XYZ-789-B",
             "vin": "2N9GDM9B_LP042789",
             "make": "TOYOTA",
             "vehicleType": "COROLLA"
           }
         ]
       }
     }
     ```

7. Obtener un vehículo específico:
   - Método: GET
   - Ruta: `/vehicles/:uuid`
   - Headers:
     ```
     Authorization: Bearer jwt-token
     ```
   - Respuesta exitosa:
     ```json
     {
       "status": 200,
       "message": "Vehicle data",
       "data": {
         "vehicle": {
           "uuid": "vehicle-uuid",
           "licensePlate": "ASD-416-A",
           "vin": "1M8GDM9A_KP042788",
           "make": "NISSAN",
           "vehicleType": "SENTRA",
           "userUuid": "user-uuid"
         }
       }
     }
     ```

8. Actualizar un vehículo:
   - Método: PUT
   - Ruta: `/vehicles/:uuid`
   - Headers:
     ```
     Authorization: Bearer jwt-token
     ```
   - Body:
     ```json
     {
       "licensePlate": "ASD-416-B",
       "vin": "1M8GDM9A_KP042788",
       "make": "NISSAN",
       "vehicleType": "ALTIMA"
     }
     ```
   - Respuesta exitosa:
     ```json
     {
       "status": 200,
       "message": "Vehicle updated",
       "data": {
         "vehicle": {
           "uuid": "vehicle-uuid",
           "licensePlate": "ASD-416-B",
           "vin": "1M8GDM9A_KP042788",
           "make": "NISSAN",
           "vehicleType": "ALTIMA",
           "userUuid": "user-uuid"
         }
       }
     }
     ```

9. Eliminar un vehículo:
   - Método: DELETE
   - Ruta: `/vehicles/:uuid`
   - Headers:
     ```
     Authorization: Bearer jwt-token
     ```
   - Respuesta exitosa:
     ```json
     {
       "status": 200,
       "message": "Vehicle deleted",
       "data": {}
     }
     ```

Recuerda que para todas las operaciones relacionadas con vehículos, es necesario incluir el token JWT en el header `Authorization` para autenticar al usuario y asociar los vehículos con el usuario correcto.



