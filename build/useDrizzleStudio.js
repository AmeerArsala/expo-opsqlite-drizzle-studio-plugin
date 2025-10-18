import { useDevToolsPluginClient, } from "expo/devtools";
import { useEffect } from "react";
export function useDrizzleStudio(db) {
    const client = useDevToolsPluginClient("expo-opsqlite-drizzle-studio-plugin");
    const queryFn = (db, client) => async (e) => {
        try {
            const data = await db.execute(e.sql, e.params || []);
            // Transform op-sqlite response to match expo-sqlite format
            client.sendMessage(`query-${e.id}`, {
                rows: data.rows || [],
                rowsAffected: data.rowsAffected ?? 0,
                insertId: data.insertId,
            });
        }
        catch (error) {
            client.sendMessage(`query-${e.id}`, {
                error: error instanceof Error ? error.message : String(error),
            });
        }
    };
    const transactionFn = (db, client) => async (e) => {
        const results = [];
        try {
            await db.transaction(async (tx) => {
                for (const query of e.queries) {
                    const result = await tx.execute(query.sql, query.params || []);
                    results.push(result);
                }
            });
            // Transform each result to match expo-sqlite format
            const finalResults = results.map((r) => ({
                rows: r.rows || [],
                rowsAffected: r.rowsAffected ?? 0,
                insertId: r.insertId,
            }));
            client.sendMessage(`transaction-${e.id}`, finalResults);
        }
        catch (error) {
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
        const subscriptions = [];
        subscriptions.push(client.addMessageListener("query", queryFn(db, client)));
        subscriptions.push(client.addMessageListener("transaction", transactionFn(db, client)));
        return () => {
            for (const subscription of subscriptions) {
                subscription.remove();
            }
        };
    }, [client, db]);
}
//# sourceMappingURL=useDrizzleStudio.js.map