
# App del Clima

Una aplicación web elegante y funcional para consultar el clima en tiempo real de cualquier ciudad del mundo.

![App del Clima Screenshot](https://media.discordapp.net/attachments/1057074297555918869/1354974117601869884/image.png?ex=67e73d7b&is=67e5ebfb&hm=ece33b8c3e5a8acda2d362f580f6294a81d0fe70b4bc92fb0c24307f1a11e086&=&format=webp&quality=lossless&width=1122&height=544)

## Características

- Consulta del clima actual por ciudad y país
- Visualización de temperatura, descripción, humedad y velocidad del viento
- Cambio dinámico del fondo según la temperatura
- Historial de búsquedas recientes
- Detección automática de la ubicación del usuario
- Interfaz responsive para dispositivos móviles y de escritorio
- Efectos visuales modernos con glassmorphism
- Soporte para modo oscuro

## Tecnologías utilizadas

- HTML5
- CSS3 (con efectos avanzados y animaciones)
- JavaScript (ES6+)
- API de OpenWeatherMap
- Geolocalización del navegador
- Font Awesome para iconos
- Google Fonts (Montserrat y Poppins)

## Instalación

1. Clona este repositorio:
   ```
   git clone https://github.com/UnPendejoHola/app-clima.git
   ```

2. Navega al directorio del proyecto:
   ```
   cd app-clima
   ```

3. Abre el archivo `index.html` en tu navegador o utiliza un servidor local.

## Uso

1. Ingresa el nombre de una ciudad en el campo de texto
2. Opcionalmente, selecciona un país del menú desplegable para resultados más precisos
3. Haz clic en el botón "Buscar" o presiona Enter
4. Visualiza la información del clima actual
5. Accede a búsquedas anteriores desde la sección "Búsquedas recientes"

## Personalización

### Cambiar la API Key

Si deseas utilizar tu propia API key de OpenWeatherMap:

1. Regístrate en [OpenWeatherMap](https://openweathermap.org/) para obtener una API key
2. Abre el archivo `script.js`
3. Reemplaza el valor de la constante `API_KEY` con tu propia clave

### Modificar estilos

El archivo `styles.css` contiene variables CSS que facilitan la personalización:

```css
:root {
    --primary-color: #0083b0;
    --primary-light: #00b4db;
    --primary-dark: #00678a;
    /* Más variables... */
}
```

Modifica estas variables para cambiar los colores, fuentes y otros aspectos visuales de la aplicación.

## Estructura del proyecto

- `index.html` - Estructura HTML de la aplicación
- `styles.css` - Estilos y animaciones
- `script.js` - Lógica de la aplicación y comunicación con la API

## Compatibilidad

La aplicación es compatible con los navegadores modernos:
- Chrome (última versión)
- Firefox (última versión)
- Safari (última versión)
- Edge (última versión)

## 📞 Contacto

Si tienes preguntas o sugerencias, no dudes en contactarme:
- Email: zpanochita@gmail.com
- GitHub: [UnPendejoHola](https://github.com/UnPendejoHola)
- Discord: [unpendejo3](https://discord.com/users/1046488706078482505)

---

Hecho con ❤️ por [zPanochita](https://zpanochita.lat)
