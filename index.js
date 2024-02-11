import { connect, keyStores, KeyPair } from "near-api-js";
import { readFileSync } from "fs";
import moment from "moment";

const delayTime = 115 * 60; // 1 jam 55 menit * 60 detik

const delay = (timeInMS) => {
    return new Promise((resolve) => {
        return setTimeout(resolve, timeInMS * 1000);
    });
};

(async () => {
    const listAccounts = readFileSync("./private.txt", "utf-8")
        .split("\n")
        .map((a) => a.trim());
    /**
     *
     */

    while (true) {
        for (const [index, value] of listAccounts.entries()) {
            console.log("");
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

            console.log(
                `[${moment().format("HH:mm:ss")}] [${index + 1}/${
                    listAccounts.length
                }] claiming account ${ACCOUNT_ID}`
            );

            const callContract = await wallet.functionCall({
                contractId: "game.hot.tg",
                methodName: "claim",
                args: {},
            });

            // console.log(callContract);
        }

        console.log(`[ DELAY FOR ${delayTime} SECONDS ]`);
        await delay(delayTime);
    }
})();
