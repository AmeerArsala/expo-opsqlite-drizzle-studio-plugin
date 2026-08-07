

# Drizzle Studio para Expo OP-SQLite

Plugin de herramientas de desarrollo de Expo para que explores tus datos de Expo OP-SQLite con Drizzle Studio 🎉

### Para comenzar

[Agrega Expo OP-SQLite a tu proyecto](https://orm.drizzle.team/docs/connect-op-sqlite)

Instala `expo-opsqlite-drizzle-studio-plugin`

```shell

npm i expo-opsqlite-drizzle-studio-plugin

```

Configura el plugin de Drizzle Studio

```jsx
import { useDrizzleStudio } from "expo-opsqlite-drizzle-studio-plugin";

import * as SQLite from "@op-engineering/op-sqlite";

import { View } from "react-native";

const db = SQLite.open({ name: "my.db" });

export default function App() {
  useDrizzleStudio(db);

  return <View></View>;
}
```

Ejecuta una aplicación de Expo con Expo OP-SQLite en un dispositivo físico, simulador o emulador. No es compatible con la web.

```shell

npx expo start

```

En la terminal con el proceso "start", presiona `shift + m` para mostrar el menú de Dev Tools y selecciona `expo-opsqlite-drizzle-studio-plugin` de la lista. Drizzle Studio se abrirá en una nueva pestaña del navegador.
