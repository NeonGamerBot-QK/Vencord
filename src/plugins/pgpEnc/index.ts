import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "PGP",
    description: "In work",
    authors: [Devs.Neon],
    start: () => {
        console.log(`hi`);
    },
    stop: () => {
        console.log(`Bye bye`);
    }
});