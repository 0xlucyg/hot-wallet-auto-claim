import { connect, keyStores, KeyPair, utils } from "near-api-js";
import { readFileSync } from "fs";
import { questionInt, question } from "readline-sync";

(async () => {
    const listAccounts = readFileSync("./private.txt", "utf-8")
        .split("\n")
        .map((a) => a.trim());
    const start = questionInt("start number from list: ");
    const end = questionInt("end number from list: ");
    const ammount = question("ammount to send: ").trim();
    /**
     *
     */

    const [PRIVATE_KEY, ACCOUNT_ID] = listAccounts[0].split("|");
    const myKeyStore = new keyStores.InMemoryKeyStore();
    const keyPair = KeyPair.fromString(PRIVATE_KEY);
    await myKeyStore.setKey("mainnet", ACCOUNT_ID, keyPair);

    const connection = await connect({
        networkId: "mainnet",
        nodeUrl: "https://rpc.mainnet.near.org",
        keyStore: myKeyStore,
    });

    for (let index = start; index <= end; index++) {
        console.log("");

        const [, TARGET_ID] = listAccounts[index - 1].split("|");
        const wallet = await connection.account(ACCOUNT_ID);

        try {
            console.log(index, `sending ${ammount} near to ${TARGET_ID}`);
            const send = await wallet.sendMoney(
                TARGET_ID,
                utils.format.parseNearAmount(ammount)
            );
            console.log(index, `hash: ${send.transaction?.hash}`);
        } catch (error) {
            console.log(error);
        }
    }
})();
