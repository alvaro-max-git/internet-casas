## Implementar cifrado de la comunicación (TLS)

1. **Crear un fichero de almacenamiento de claves**

En la consola, en la carpeta donde queramos almacenarlo:
```shell
keytool -genkey -v -keystore mykeys.jks -keyalg RSA -keysize 2048 -validity 1000 -alias key
```

Seguir las instrucciones y poner una contraseña, por ejemplo "cambiame". Se creará un fichero llamado mykeys.jks.

2. **Crear variables de entorno**

Crear un archivo para variables de entorno llamado `.env` en la carpeta del backend (ioh-api) Este archivo NO se sincroniza con github (está en el `.gitignore`), es para que se almacenen datos sensibles, como la contraseña y ruta del almacén de claves.

La ruta:
`internet-casas/ioh-api/.env`

Su contenido (cambiar la constraeña y la ruta por la que corresponda):
```
SSL_KEY_PASSWORD=cambiame
SSL_KEY_STORE_PASSWORD=cambiame
SSL_KEYS_STORE_PATH=file:///E:/Max/ISST/internet-casas/mykeys.jks
```

De esta forma cuando arranquéis el backend os cogerá vuestras claves de forma segura.
