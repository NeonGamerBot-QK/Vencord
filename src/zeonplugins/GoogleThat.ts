/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ApplicationCommandOptionType,findOption } from "@api/Commands";
import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
function getMessage(opts)
{
    const inputOption = findOption(opts, "input", "");

    const chosenEngine = searchEngines[settings.store.defaultEngine];

    const queryURL = "" + chosenEngine + encodeURIComponent(inputOption);

    if(settings.store.hyperlink)
    {
        return `[${inputOption}](${queryURL})`;
    }
    else
    {
        return queryURL;
    }
}

const searchEngines = {
    "google": "https://www.google.com/search?q=",
    "bing": "https://www.bing.com/search?q=",
    "yahoo": "https://search.yahoo.com/search?p=",
    "duckduckgo": "https://duckduckgo.com/?q=",
    "baidu": "https://www.baidu.com/s?wd=",
    "yandex": "https://yandex.com/search/?text=",
    "ecosia": "https://www.ecosia.org/search?q=",
    "ask": "https://www.ask.com/web?q="
};

const settings = definePluginSettings({
    hyperlink: {
        type: OptionType.BOOLEAN,
        description: "If the sent link should hyperlink with the query as the label",
        default: true
    },
    defaultEngine:
    {
        type: OptionType.SELECT,
        description: "The default search engine to use when no parameter is provided",
        options: Object.keys(searchEngines).map((key, index) => ({
            label: key.charAt(0).toUpperCase() + key.slice(1),
            value: key,
            default: index == 0
        }))
    }
});

export default definePlugin({
    name: "GoogleThat",
    description: "Adds a command to send a google search link to a query",
    authors: [Devs.Samwich],
    dependencies: ["CommandsAPI"],
    settings,
    commands: [
        {
            name: "googlethat",
            description: "send a google search link to a query",
            options: [
                {
                    name: "input",
                    description: "The search query",
                    type: ApplicationCommandOptionType.STRING,
                    required: true,
                }
            ],
            execute: opts => ({
                content: getMessage(opts)
            }),
        }
    ]
});
