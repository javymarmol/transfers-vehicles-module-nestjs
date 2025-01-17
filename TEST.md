# **Prueba Backend: Desarrollo de un Módulo de Transferencias de Vehículos**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/6331f875-a7ec-418f-83dd-169a94f1f749/3e78fdb9-e358-4220-b1aa-1993a5c68b3c/image.png)

### **Objetivo**

Desarrollar un módulo CRUD para la gestión de transferencias de vehículos en un CMS vehicular. Este módulo debe implementar roles, permisos y unidades organizativas, asegurando que cada usuario solo pueda acceder a los datos del proyecto y unidades organizativas a los que pertenece.

---

### **Requisitos del Proyecto**

### **Tecnologías**

- **Backend**: Nest.js
    - Opcional: Helmet, JWT, Cookies seguras.
- **Base de datos**: PostgreSQL (ORM: TypeORM o Prisma).
- **Infraestructura**: Render (plan Hobby).
    - Opcional: Redis, Background Workers, Cron Jobs, Variables de Entorno.
- **Repositorio de código**: GitHub.

---

### **Requisitos Técnicos**

### **1. Modelado de Datos**

### **Entidades Principales**

1. **Usuarios (`users`)**
    - Atributos: `id`, `username`, `email`, `password_hash`, `created_at`.
    - Relación: Muchos a muchos con `projects` y `organizational_units`.
2. **Roles (`roles`)**
    - Atributos: `id`, `name`, `description`.
    - Relación: Muchos a muchos con `permissions` y `users`.
3. **Permisos (`permissions`)**
    - Atributos: `id`, `name`, `description`.
4. **Proyectos (`projects`)**
    - Atributos: `id`, `name`, `description`, `created_at`.
    - Relación: Uno a muchos con `organizational_units`. Cada unidad organizativa pertenece exclusivamente a un proyecto.
5. **Unidades Organizativas (`organizational_units`)**
    - Atributos: `id`, `name`, `project_id`, `created_at`.
    - Relación: Muchos a muchos con `users`.
6. **Vehículos (`vehicles`)**
    - Atributos: `id`, `plate`, `service`, `created_at`.
7. **Transferencias (`transfers`)**
    - Atributos: `id`, `created_at`, `type`, `vehicle_id`, `client_id`, `transmitter_id`, `project_id`, `organizational_unit_id`.
    - Relación:
        - Pertenece a un `vehicle`.
        - Relación con `users` para cliente y transmitente.
        - Asociada a un proyecto y una unidad organizativa.

---

### **2. Funcionalidad**

### **CRUD de Transferencias de Vehículos**

1. **GET /transfers**:
    - Devuelve solo las transferencias asociadas al proyecto y unidades organizativas del usuario autenticado.
    - Requiere:
        - Token de autenticación válido.
        - Acceso al proyecto.
        - Permisos para el módulo.
        - Pertenencia a la unidad organizativa.
2. **POST /transfers**:
    - Crea una nueva transferencia.
    - Requiere que el cliente envíe explícitamente el `projectId` y el `organizationalUnitId`.
    - El backend valida que el usuario tiene acceso tanto al proyecto como a la unidad organizativa especificada.
3. **PUT /transfers/:id**:
    - Permite editar transferencias existentes.
    - Requiere que el cliente envíe explícitamente el `projectId` y el `organizationalUnitId`.
    - El backend valida que el usuario tiene acceso tanto al proyecto como a la unidad organizativa especificada.
4. **DELETE /transfers/:id**:
    - Permite eliminar una transferencia.
    - Solo si el usuario tiene permisos y pertenece a la unidad organizativa de la transferencia.

---

### **3. Validación de Roles, Permisos y Unidades Organizativas**

- **Middleware**:
    - Cargar proyectos, roles, permisos y unidades organizativas del usuario autenticado.
- **Guards**:
    - Validar:
        1. Token JWT válido.
        2. Permisos específicos para el módulo (`view_transfers`, `edit_transfers`, etc.).
        3. El usuario debe tener acceso explícito al proyecto especificado.
        4. El usuario debe tener acceso explícito a la unidad organizativa especificada.
        5. Verificar que la unidad organizativa pertenece al proyecto especificado.

---

### **Criterios de Evaluación**

### **Obligatorio**

1. **Correcto modelado de datos**:
    - Uso de TypeORM o Prisma para definir entidades y relaciones.
2. **Funcionalidad completa del CRUD**:
    - Implementación de los endpoints requeridos.
3. **Seguridad**:
    - Validación de roles, permisos, proyectos y unidades organizativas, asegurando que las relaciones entre estas entidades se respeten según las reglas descritas.
    - Uso de JWT para la autenticación.
    - Configuración de cookies seguras para proteger las sesiones.
4. **Uso de Render**:
    - Despliegue del backend en Render (plan Hobby).
5. **Documentación**:
    - Instrucciones claras en el README para clonar el repositorio, instalar dependencias, configurar variables de entorno y probar el proyecto.

### **Opcional**

1. Uso de Redis para caching.
2. Implementación de background workers o cron jobs.
3. Uso de **variables de entorno** para manejar configuraciones sensibles, como claves secretas, credenciales de base de datos, y configuraciones específicas del entorno.
4. Uso de Helmet para mejorar la seguridad.

---

### **Entregables**

1. **Repositorio en GitHub**:
    - Código limpio, con commits organizados y mensajes descriptivos.
2. **Documentación**:
    - Archivo README con:
        - Configuración inicial.
        - Descripción de las rutas y su funcionalidad.
        - Variables de entorno necesarias.
3. **Despliegue en Render**:
    - URL del servicio desplegado.

---

### **Duración de la Prueba**

Se espera que los candidatos completen la prueba antes del **12 de Enero**.

---

### **Evaluación**

1. **Funcionalidad** (40%):
    - El sistema cumple con los requisitos del CRUD y la validación de acceso.
2. **Calidad del Código** (30%):
    - Uso de buenas prácticas, modularidad, y limpieza del código.
3. **Seguridad** (20%):
    - Implementación de las medidas de seguridad requeridas.
4. **Uso de Variables de Entorno** (10%):
    - Configuración adecuada de variables de entorno para mantener la seguridad de las configuraciones sensibles.
