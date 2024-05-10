/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";

async function getcuteneko(): Promise<string> {
    const res = await fetch("https://nekos.best/api/v2/neko");
    const json = (await res.json());
    const url = json.results[0].url as string;
    const name = (json.results[0].source_url as string).split("https://")[1];
    return `[${name}](${url})`;
}



export default definePlugin({
    name: "Cute nekos",
    authors: [
        Devs.echo
    ],
    description: "what the fuck am i doing with my life",
    dependencies: ["CommandsAPI"],
    commands: [{
        name: "nekos",
        description: "AAAAAAAAAAAAAAAAAAAAAA",
        execute: async opts => ({
            content: await getcuteneko()
        })
    }]
});
