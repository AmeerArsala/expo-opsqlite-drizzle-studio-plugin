// useDrizzleStudio.tsx
import { type DB, type QueryResult } from "@op-engineering/op-sqlite";
import {
  type DevToolsPluginClient,
  type EventSubscription,
  useDevToolsPluginClient,
} from "expo/devtools";
import { useEffect } from "react";

export function useDrizzleStudio(db: DB | null) {
  const client = useDevToolsPluginClient("expo-drizzle-studio-plugin");

  const queryFn =
    (db: DB, client: DevToolsPluginClient) =>
    async (e: { sql: string; params?: any[]; id: string }) => {
      try {
        const data = await db.execute(e.sql, e.params || []);
        client.sendMessage(`query-${e.id}`, data.rows || []);
      } catch (error) {
        client.sendMessage(`query-${e.id}`, {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    };

  const transactionFn =
    (db: DB, client: DevToolsPluginClient) =>
    async (e: { queries: { sql: string; params?: any[] }[]; id: string }) => {
      const results: (QueryResult | { error: string })[] = [];
      try {
        await db.transaction(async (tx) => {
          for (const query of e.queries) {
            const result = await tx.execute(query.sql, query.params || []);
            results.push(result);
          }
        });
        const finalResults = results.map((r) => (r as QueryResult).rows || r);
        client.sendMessage(`transaction-${e.id}`, finalResults);
      } catch (error) {
        results.push({
          error: error instanceof Error ? error.message : String(error),
        });
        client.sendMessage(`transaction-${e.id}`, results);
      }
    };

  useEffect(() => {
    if (!client || !db) {
      return;
    }

    const subscriptions: EventSubscription[] = [];

    subscriptions.push(client.addMessageListener("query", queryFn(db, client)));
    subscriptions.push(
      client.addMessageListener("transaction", transactionFn(db, client)),
    );

    return () => {
      for (const subscription of subscriptions) {
        subscription.remove();
      }
    };
  }, [client, db]);
}
