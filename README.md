# Proyecto de Node.js para Login con Express e Implementación de Tokens

Este proyecto es una aplicación básica de autenticación desarrollada con Node.js y Express. Utiliza tokens JWT (JSON Web Tokens) para manejar la autenticación de los usuarios de manera segura y eficiente.

---

## Características

1. **Registro de Usuarios**: Permite a los nuevos usuarios registrarse proporcionando un nombre de usuario y una contraseña.

2. **Autenticación de Usuarios**: Permite a los usuarios registrados iniciar sesión proporcionando sus credenciales.

3. **Generación de Tokens JWT**: Al iniciar sesión correctamente, se genera un token JWT que se utiliza para autenticar las solicitudes posteriores.

4. **Protección de Rutas**: Algunas rutas están protegidas y solo son accesibles para los usuarios autenticados.

---

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución para JavaScript en el servidor.
- **Express**: Framework para Node.js que facilita la creación de aplicaciones web.
- **JWT (JSON Web Tokens)**: Estándar para la creación de tokens de acceso que permiten la autenticación de usuarios.

---

## Instalación y Configuración

1. **Clona o descarga el repositorio**:

   ```bash
   git clone https://github.com/tu_usuario/tu_repositorio.git
   cd tu_repositorio
   ```

2. **Instala las dependencias**:

   ```bash
   npm install
   ```

3. **Configura las variables de entorno**:

   Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables:

   ```env
   PORT=3000
   JWT_SECRET=tu_secreto_jwt
   ```

4. **Inicia el servidor**:

   ```bash
   npm start
   ```

   El servidor estará corriendo en `http://localhost:3000`.

---

## Endpoints

- **POST /register**: Registra un nuevo usuario.
  
  ```json
  {
    "username": "ejemplo",
    "password": "contraseña"
  }
  ```

- **POST /login**: Autentica a un usuario y genera un token JWT.

  ```json
  {
    "username": "ejemplo",
    "password": "contraseña"
  }
  ```

- **GET /protected**: Ruta protegida que solo es accesible con un token JWT válido. 

  Necesitas incluir el token en el encabezado de la solicitud:

  ```
  Authorization: Bearer <tu_token_jwt>
  ```

---

## Contribución

¡Siéntete libre de contribuir al proyecto! Puedes abrir un problema para informar sobre errores o sugerir nuevas características. También puedes enviar solicitudes de extracción con mejoras o correcciones de código.

---

## Licencia

Este proyecto está bajo la licencia [MIT](https://opensource.org/licenses/MIT), lo que significa que puedes utilizarlo, modificarlo y distribuirlo libremente, siempre y cuando se mantenga el aviso de licencia original.

---

¡Esperamos que encuentres útil esta aplicación de autenticación con Node.js y Express! Si tienes alguna pregunta o sugerencia, no dudes en ponerte en contacto con nosotros. ¡Gracias por tu interés en nuestro proyecto!
