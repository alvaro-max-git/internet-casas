# 🔐 Internet de las Casas (IoH)

**Internet de las Casas (IoH)** es una aplicación web desarrollada como parte de un proyecto universitario que permite a propietarios de alojamientos turísticos gestionar el acceso remoto a sus viviendas mediante cerraduras inteligentes conectadas a Internet. 

El objetivo es que los **hosts** puedan configurar accesos a sus alojamientos sin necesidad de llaves físicas, y que los **usuarios** (huéspedes) accedan mediante **Bluetooth** desde su smartphone. El sistema permite, además, registrar accesos y estadísticas de uso.

---

El sistema elimina la necesidad de llaves físicas para permitir el acceso a una vivienda, facilitando que un **host (propietario)**:
- Gestione el acceso a sus alojamientos de forma remota.
- Genere accesos temporales para sus huéspedes mediante tokens o por usario autenticado.
- Consulte el historial de accesos y estadísticas de uso.
- Sincronice automáticamente las cerraduras disponibles mediante la API de [Seam](https://www.seam.co/) con la mayoría de las *smart locks* del mercado.
- Cargue los accesos configurados a Google Calendar, previamente habiendo iniciado sesión con Google.
Y que un **huésped (usuario)**:
- Consulte sus accesos activos o futuros.
- Acceda a la vivienda con un acceso válido utilizando **Bluetooth** para detectar la cercanía de la cerradura.

## Tecnologías utilizadas

Este proyecto se ha desarrollado con una arquitectura cliente-servidor en tres capas.
### Backend
- **Java 17** + **Spring Boot**  
- API RESTful con control de sesiones y autenticación básica  
- Persistencia con **JPA/Hibernate** y base de datos relacional H2.
- Sincronización de dispositivos con **Seam API (SDK oficial)**
- Desplegada en https://internet-casas.onrender.com/ (si está inactiva se tiene que rearrancar).
### Frontend
- **React.js**  
- Uso de **Web Bluetooth API** para conexión BLE con cerraduras inteligentes 
- Diseño responsive orientado a uso en smartphones
- Desplegada en https://internet-casas.netlify.app/
### Otros
- **Docker** para contenerización y despliegue en Render.
- **Figma** para prototipado de interfaz y experiencia de usuario  
- **JUnit**  para pruebas automatizadas


## Estado del proyecto (MVP)

Este repositorio contiene la versión **MVP funcional**, con las siguientes funcionalidades implementadas:

- Registro y autenticación de hosts y usuarios
- Alta y sincronización de cerraduras virtuales (Seam)
- Creación de accesos temporales
- Simulación de apertura de cerraduras
- Gestión de sesiones con tokens temporales


