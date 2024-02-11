import { connect, keyStores, KeyPair, Contract } from "near-api-js";
import { readFileSync } from "fs";

(async () => {
    const listAccounts = readFileSync("./private.txt", "utf-8")
        .split("\n")
        .map((a) => a.trim());
    /**
     *
     */

    for (const [index, value] of listAccounts.entries()) {
        const [PRIVATE_KEY, ACCOUNT_ID] = value.split("|");

        const myKeyStore = new keyStores.InMemoryKeyStore();
        const keyPair = KeyPair.fromString(PRIVATE_KEY);
        await myKeyStore.setKey("mainnet", ACCOUNT_ID, keyPair);

        const connection = await connect({
            networkId: "mainnet",
            nodeUrl: "https://rpc.mainnet.near.org",
            keyStore: myKeyStore,
        });

        const wallet = await connection.account(ACCOUNT_ID);
        const contract = new Contract(wallet, "game.hot.tg", {
            changeMethods: ["claim"],
        });

        console.log(
            `[${index + 1}/${
                listAccounts.length
            }] claiming account ${ACCOUNT_ID}`
        );
        const response = await contract.claim({
            args: {},
        });
        console.log(response);

        console.log("");
    }
})();
