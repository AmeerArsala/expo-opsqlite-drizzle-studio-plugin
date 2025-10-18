import { useDevToolsPluginClient, } from "expo/devtools";
import { useEffect } from "react";
export function useDrizzleStudio(db) {
    const client = useDevToolsPluginClient("expo-drizzle-studio-plugin");
    const queryFn = (db, client) => async (e) => {
        try {
            const data = await db.execute(e.sql, e.params || []);
            client.sendMessage(`query-${e.id}`, data.rows || []);
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
            const finalResults = results.map((r) => r.rows || r);
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