import { connect, keyStores, KeyPair } from "near-api-js";
import { readFileSync } from "fs";
import moment from "moment";
import { questionInt } from "readline-sync";

const delayTime = 119 * 60; // 1 jam 59 menit * 60 detik

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

    const start = questionInt("input start number: ");
    const stop = questionInt("input stop number: ");

    while (true) {
        for (let index = start; index <= stop; index++) {
            console.log("");
            const [PRIVATE_KEY, ACCOUNT_ID] =
                listAccounts[index - 1].split("|");

            const myKeyStore = new keyStores.InMemoryKeyStore();
            const keyPair = KeyPair.fromString(PRIVATE_KEY);
            await myKeyStore.setKey("mainnet", ACCOUNT_ID, keyPair);

            const connection = await connect({
                networkId: "mainnet",
                nodeUrl: "https://rpc.mainnet.near.org",
                keyStore: myKeyStore,
            });

            // connection.connection.provider
            //     .query({
            //         account_id: "game.hot.tg",
            //         method_name: "get_user",
            //         finality: "optimistic",
            //         request_type: "call_function",
            //         args_base64: Buffer.from(
            //             JSON.stringify({ account_id: ACCOUNT_ID })
            //         ).toString("base64"),
            //     })
            //     .then((res) => JSON.parse(Buffer.from(res.result).toString()))
            //     .then((res) => {
            //         console.log(res);
            //     });
            const wallet = await connection.account(ACCOUNT_ID);

            console.log(
                `[${moment().format("HH:mm:ss")}] [${index}/${
                    listAccounts.length
                }] claiming account ${ACCOUNT_ID}`
            );
            try {
                await wallet.functionCall({
                    contractId: "game.hot.tg",
                    methodName: "claim",
                    args: {},
                });

                // console.log(callContract);
            } catch (error) {
                console.log(error);
            }
        }

        console.log("");
        console.log(`[ DELAY FOR ${delayTime} SECONDS ]`);
        await delay(delayTime);
    }
})();
