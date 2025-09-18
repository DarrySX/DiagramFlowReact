# Diagrama de Flujo para Presentación

Una aplicación React interactiva para crear diagramas de flujo para presentaciones, construida con Vite, TypeScript y Tailwind CSS.

## 🚀 Tecnologías

- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript  
- **Vite** - Herramienta de build ultrarrápida
- **Tailwind CSS** - Framework CSS utilitario
- **Radix UI** - Componentes de interfaz accesibles
- **React DnD** - Drag and drop para React
- **Lucide React** - Iconos modernos

## 📦 Instalación

Asegúrate de tener [pnpm](https://pnpm.io/) instalado. Si no lo tienes:

```bash
npm install -g pnpm
```

Luego instala las dependencias:

```bash
pnpm install
```

## 🔧 Scripts Disponibles

- `pnpm dev` - Inicia el servidor de desarrollo
- `pnpm build` - Construye la aplicación para producción  
- `pnpm preview` - Preview de la build de producción
- `pnpm type-check` - Verifica los tipos de TypeScript
- `pnpm clean` - Limpia archivos de build y cache

## 🏃‍♂️ Desarrollo

Para iniciar el servidor de desarrollo:

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes React reutilizables
│   ├── ui/             # Componentes de UI base (Shadcn/UI)
│   └── figma/          # Componentes específicos de Figma
├── styles/             # Estilos globales
└── main.tsx           # Punto de entrada de la aplicación
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.
