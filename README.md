# DevTrack Frontend

## Proyecto

DevTrack es una aplicación web diseñada para la gestión de tareas y la colaboración en equipos de desarrollo de software. El objetivo principal es proporcionar una plataforma intuitiva y eficiente para organizar proyectos, asignar responsabilidades, establecer plazos y facilitar la comunicación entre los miembros del equipo.

La idea central de DevTrack es simplificar el flujo de trabajo de los desarrolladores, permitiéndoles centrarse en la codificación y la entrega de valor, minimizando el tiempo dedicado a la organización y el seguimiento manual de las tareas.

## Arquitectura principal
![image](https://github.com/user-attachments/assets/885bb279-4354-4892-a127-5d70081bb894)

## Arbol
```
public
└───src
    ├───components
    │   ├───auth
    │   ├───chat
    │   ├───notes
    │   ├───profile
    │   ├───projects
    │   ├───tasks
    │   └───team
    ├───hooks
    ├───layouts
    ├───lib
    ├───locales
    ├───services
    ├───types
    ├───utils
    └───views
        ├───404
        ├───auth
        ├───profile
        └───projects
````

## Tecnologías Utilizadas

Este proyecto de Frontend está construido utilizando las siguientes tecnologías y dependencias clave:

-   **React:** Una biblioteca de JavaScript para construir interfaces de usuario dinámicas y reactivas.
-   **React Router DOM:** Para la navegación y el enrutamiento dentro de la aplicación.
-   **Vite:** Un constructor de frontend extremadamente rápido y una herramienta de desarrollo que proporciona una excelente experiencia de desarrollo.
-   **TypeScript:** Un superconjunto de JavaScript que añade tipado estático opcional, mejorando la mantenibilidad y la detección de errores en tiempo de desarrollo.
-   **@chakra-ui/pin-input:** Componentes para la entrada de códigos PIN, útil para funcionalidades como la confirmación de cuenta o la autenticación de dos factores (futuro).
-   **@dnd-kit/core:** Una biblioteca para implementar funcionalidades de Drag and Drop (arrastrar y soltar), potencialmente útil para la reordenación de tareas o proyectos en el futuro.
-   **@headlessui/react:** Componentes de interfaz de usuario sin estilo, completamente accesibles y personalizables, que sirven como base para construir componentes personalizados.
-   **@heroicons/react:** Un conjunto de iconos SVG diseñados por el equipo de Tailwind CSS, utilizados para proporcionar una interfaz visualmente atractiva.
-   **@tailwindcss/forms:** Un plugin de Tailwind CSS para proporcionar estilos base consistentes para los elementos de formulario.
-   **@tanstack/react-query:** Una potente biblioteca para la gestión de datos asíncronos en React, facilitando la obtención, almacenamiento en caché, sincronización y actualización de datos del servidor.
-   **@tanstack/react-query-devtools:** Herramientas de desarrollo para React Query, ayudando a inspeccionar y depurar el estado de las consultas y mutaciones.
-   **Axios:** Una biblioteca cliente HTTP basada en promesas para realizar peticiones al backend.
-   **cors:** (Aunque listada en `dependencies`, normalmente se usa en el backend para habilitar el Intercambio de Recursos de Origen Cruzado).
-   **react-hook-form:** Una biblioteca para la validación de formularios y la gestión del estado de los formularios en React Hooks.
-   **react-toastify:** Una biblioteca para mostrar notificaciones elegantes y personalizables a los usuarios.
-   **Zod:** Una biblioteca de declaración y validación de esquemas TypeScript-first, utilizada para asegurar la integridad de los datos, especialmente en los formularios y las respuestas de la API.
-   **autoprefixer:** Un plugin de PostCSS para analizar CSS y añadir los prefijos de proveedor necesarios.
-   **eslint:** Un linter para identificar y reportar patrones problemáticos en el código JavaScript/TypeScript.
-   **eslint-plugin-react-hooks:** Un plugin de ESLint que verifica el cumplimiento de las reglas de los Hooks de React.
-   **eslint-plugin-react-refresh:** Un plugin de ESLint para asegurar la correcta implementación de la Fast Refresh de React.
-   **globals:** Un paquete que proporciona un conjunto de variables de entorno de JavaScript comunes.
-   **postcss:** Una herramienta para transformar estilos con JS plugins.
-   **tailwindcss:** Un framework CSS de utilidad, de bajo nivel, altamente configurable y basado en clases.
-   **tailwindscss:** (Parece ser un intento de integrar la sintaxis de Sass con Tailwind CSS, podría ser una dependencia de desarrollo para facilitar la escritura de estilos).
-   **typescript-eslint:** Un conjunto de plugins de ESLint que proporcionan reglas específicas para TypeScript.
-   **vite:** (Listado también en `devDependencies` ya que es una herramienta de desarrollo y construcción).

## Scripts de `package.json`

El archivo `package.json` incluye varios scripts que facilitan el desarrollo y la gestión del proyecto. Aquí tienes una breve descripción de cada uno y cómo usarlos:

-   **`dev`**: Este script inicia el servidor de desarrollo de Vite.  Es el comando principal que usarás durante el desarrollo.
    -   Uso: `npm run dev` o `yarn dev`
    -   Esto iniciará un servidor local que recargará automáticamente la página en el navegador cuando realices cambios en el código.

-   **`build`**: Este script realiza una compilación de producción de la aplicación. Primero, ejecuta el compilador de TypeScript (`tsc -b`) para verificar y transpilar el código TypeScript a JavaScript, y luego utiliza Vite para empaquetar los archivos estáticos optimizados para la distribución.
    -   Uso: `npm run build` o `yarn build`
    -   El resultado de la compilación se guardará en el directorio `dist` (por defecto).

-   **`lint`**: Este script ejecuta ESLint para analizar el código fuente y encontrar posibles errores o problemas de estilo.
    -   Uso: `npm run lint` o `yarn lint`
    -   Es recomendable ejecutar este comando regularmente para mantener la calidad del código.

-   **`preview`**: Este script inicia un servidor local para previsualizar la compilación de producción (el contenido del directorio `dist`).  Esto te permite probar la aplicación después de haberla construido, pero antes de desplegarla.
    -   Uso: `npm run preview` o `yarn preview`

## Variables de Entorno

Este proyecto utiliza variables de entorno para configurar diferentes aspectos de la aplicación, como la URL de la API del backend.  Las variables de entorno se definen en archivos `.env`.

En este proyecto, se espera que configures al menos la siguiente variable de entorno:

-   **`VITE_API_URL`**: Esta variable especifica la URL base de la API del backend a la que la aplicación frontend enviará las peticiones.

### Configuración de las Variables de Entorno

1.  **Crea un archivo `.env`** en el directorio raíz del proyecto (el mismo directorio donde se encuentra el archivo `package.json`).
2.  **Añade la variable de entorno** al archivo `.env` con el siguiente formato:

    ```
    VITE_API_URL=http://localhost:8080/api
    ```

    Asegúrate de reemplazar `http://localhost:8080/api` con la URL real de tu API del backend.

    Si tienes diferentes entornos (desarrollo, producción, etc.), puedes crear archivos `.env.development`, `.env.production`, etc., y Vite cargará automáticamente el archivo correspondiente según el modo en que se esté ejecutando la aplicación.  Por ejemplo, si ejecutas `npm run dev`, Vite cargará `.env.development` (si existe). Si ejecutas `npm run build`, Vite cargará `.env` y `.env.production`

    Ejemplo de estructura de archivos:

    ```
    devtrack-frontend/
    ├── .env                # Variables de entorno por defecto
    ├── .env.development    # Variables de entorno para desarrollo
    ├── .env.production     # Variables de entorno para producción
    ├── package.json
    └── ...
    ```
    Es importante añadir el archivo `.env` al `.gitignore` para evitar subir accidentalmente secretos a tu repositorio.

Con las variables de entorno configuradas, la aplicación podrá comunicarse correctamente con el backend, independientemente del entorno en el que se esté ejecutando.
