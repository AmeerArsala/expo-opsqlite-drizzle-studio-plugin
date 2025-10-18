# Drizzle Studio for Expo OP-SQLite

Expo dev tools plugin for you to browse your Expo OP-SQLite data with Drizzle Studio 🎉

### Get Started

[Add Expo OP-SQLite to your project](https://orm.drizzle.team/docs/connect-op-sqlite)

Install `expo-opsqlite-drizzle-studio-plugin`

```shell

npm i expo-opsqlite-drizzle-studio-plugin

```

Set up Drizzle Studio plugin

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

Run an Expo app with Expo OP-SQLite on a physical device, simulator or emulator. Web is not supported.

```shell

npx expo start

```

In the terminal with "start" process, press `shift + m` to present the Dev Tools menu and choose `expo-opsqlite-drizzle-studio-plugin` from the list. Drizzle Studio will open in a new web browser tab.
