/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ApplicationCommandInputType, ApplicationCommandOptionType, findOption, sendBotMessage } from "@api/Commands";
import { definePluginSettings } from "@api/Settings";
import ErrorBoundary from "@components/ErrorBoundary";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { ChannelStore, SelectedChannelStore, Tooltip, UserStore, useStateFromStores } from "@webpack/common";
function ZeonIndicator({ channelId }: { channelId: string; }) {
    // const typingUsers: Record<string, number> = useStateFromStores(
    //     [TypingStore],
    //     () => ({ ...TypingStore.getTypingUsers(channelId) as Record<string, number> }),
    //     null,
    //     (old, current) => {
    //         const oldKeys = Object.keys(old);
    //         const currentKeys = Object.keys(current);

    //         return oldKeys.length === currentKeys.length && currentKeys.every(key => old[key] != null);
    //     }
    // );
    const currentChannelId: string = useStateFromStores([SelectedChannelStore], () => SelectedChannelStore.getChannelId());
    const guildId = ChannelStore.getChannel(channelId).guild_id;

    // if (!settings.store.includeMutedChannels) {
    //     const isChannelMuted = UserGuildSettingsStore.isChannelMuted(guildId, channelId);
    //     if (isChannelMuted) return null;
    // }

    // if (!settings.store.includeCurrentChannel) {
    //     if (currentChannelId === channelId) return null;
    // }

    const myId = UserStore.getCurrentUser()?.id;
    let tooltipText: string;
    let icon = <></>;
    switch (channelId) {
        case "1213339538563399720":
            icon = <><svg style={{ fill: "var(--channel-icon)", height: "24px", width: "24px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M524.5 69.8a1.5 1.5 0 0 0 -.8-.7A485.1 485.1 0 0 0 404.1 32a1.8 1.8 0 0 0 -1.9 .9 337.5 337.5 0 0 0 -14.9 30.6 447.8 447.8 0 0 0 -134.4 0 309.5 309.5 0 0 0 -15.1-30.6 1.9 1.9 0 0 0 -1.9-.9A483.7 483.7 0 0 0 116.1 69.1a1.7 1.7 0 0 0 -.8 .7C39.1 183.7 18.2 294.7 28.4 404.4a2 2 0 0 0 .8 1.4A487.7 487.7 0 0 0 176 479.9a1.9 1.9 0 0 0 2.1-.7A348.2 348.2 0 0 0 208.1 430.4a1.9 1.9 0 0 0 -1-2.6 321.2 321.2 0 0 1 -45.9-21.9 1.9 1.9 0 0 1 -.2-3.1c3.1-2.3 6.2-4.7 9.1-7.1a1.8 1.8 0 0 1 1.9-.3c96.2 43.9 200.4 43.9 295.5 0a1.8 1.8 0 0 1 1.9 .2c2.9 2.4 6 4.9 9.1 7.2a1.9 1.9 0 0 1 -.2 3.1 301.4 301.4 0 0 1 -45.9 21.8 1.9 1.9 0 0 0 -1 2.6 391.1 391.1 0 0 0 30 48.8 1.9 1.9 0 0 0 2.1 .7A486 486 0 0 0 610.7 405.7a1.9 1.9 0 0 0 .8-1.4C623.7 277.6 590.9 167.5 524.5 69.8zM222.5 337.6c-29 0-52.8-26.6-52.8-59.2S193.1 219.1 222.5 219.1c29.7 0 53.3 26.8 52.8 59.2C275.3 311 251.9 337.6 222.5 337.6zm195.4 0c-29 0-52.8-26.6-52.8-59.2S388.4 219.1 417.9 219.1c29.7 0 53.3 26.8 52.8 59.2C470.7 311 447.5 337.6 417.9 337.6z" /></svg></>;
            break;
        case "1215135545710223423":
            icon = <><svg style={{ fill: "var(--channel-icon)", height: "24px", width: "24px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M496.9 366.6c-3.4-9.2-9.8-14.1-17.1-18.2-1.4-.8-2.6-1.5-3.7-1.9-2.2-1.1-4.4-2.2-6.6-3.4-22.8-12.1-40.6-27.3-53-45.4a102.9 102.9 0 0 1 -9.1-16.1c-1.1-3-1-4.7-.2-6.3a10.2 10.2 0 0 1 2.9-3c3.9-2.6 8-5.2 10.7-7 4.9-3.2 8.8-5.7 11.2-7.4 9.4-6.5 15.9-13.5 20-21.3a42.4 42.4 0 0 0 2.1-35.2c-6.2-16.3-21.6-26.4-40.3-26.4a55.5 55.5 0 0 0 -11.7 1.2c-1 .2-2.1 .5-3.1 .7 .2-11.2-.1-22.9-1.1-34.5-3.5-40.8-17.8-62.1-32.7-79.2A130.2 130.2 0 0 0 332.1 36.4C309.5 23.5 283.9 17 256 17S202.6 23.5 180 36.4a129.7 129.7 0 0 0 -33.3 26.8c-14.9 17-29.2 38.4-32.7 79.2-1 11.6-1.2 23.4-1.1 34.5-1-.3-2-.5-3.1-.7a55.5 55.5 0 0 0 -11.7-1.2c-18.7 0-34.1 10.1-40.3 26.4a42.4 42.4 0 0 0 2 35.2c4.1 7.8 10.7 14.7 20 21.3 2.5 1.7 6.4 4.2 11.2 7.4 2.6 1.7 6.5 4.2 10.3 6.7a11.1 11.1 0 0 1 3.3 3.3c.8 1.6 .8 3.4-.4 6.6a102 102 0 0 1 -8.9 15.8c-12.1 17.7-29.4 32.6-51.4 44.6C32.4 348.6 20.2 352.8 15.1 366.7c-3.9 10.5-1.3 22.5 8.5 32.6a49.1 49.1 0 0 0 12.4 9.4 134.3 134.3 0 0 0 30.3 12.1 20 20 0 0 1 6.1 2.7c3.6 3.1 3.1 7.9 7.8 14.8a34.5 34.5 0 0 0 9 9.1c10 6.9 21.3 7.4 33.2 7.8 10.8 .4 23 .9 36.9 5.5 5.8 1.9 11.8 5.6 18.7 9.9C194.8 481 217.7 495 256 495s61.3-14.1 78.1-24.4c6.9-4.2 12.9-7.9 18.5-9.8 13.9-4.6 26.2-5.1 36.9-5.5 11.9-.5 23.2-.9 33.2-7.8a34.6 34.6 0 0 0 10.2-11.2c3.4-5.8 3.3-9.9 6.6-12.8a19 19 0 0 1 5.8-2.6A134.9 134.9 0 0 0 476 408.7a48.3 48.3 0 0 0 13-10.2l.1-.1C498.4 388.5 500.7 376.9 496.9 366.6zm-34 18.3c-20.7 11.5-34.5 10.2-45.3 17.1-9.1 5.9-3.7 18.5-10.3 23.1-8.1 5.6-32.2-.4-63.2 9.9-25.6 8.5-42 32.8-88 32.8s-62-24.3-88.1-32.9c-31-10.3-55.1-4.2-63.2-9.9-6.6-4.6-1.2-17.2-10.3-23.1-10.7-6.9-24.5-5.7-45.3-17.1-13.2-7.3-5.7-11.8-1.3-13.9 75.1-36.4 87.1-92.6 87.7-96.7 .6-5 1.4-9-4.2-14.1-5.4-5-29.2-19.7-35.8-24.3-10.9-7.6-15.7-15.3-12.2-24.6 2.5-6.5 8.5-8.9 14.9-8.9a27.6 27.6 0 0 1 6 .7c12 2.6 23.7 8.6 30.4 10.2a10.7 10.7 0 0 0 2.5 .3c3.6 0 4.9-1.8 4.6-5.9-.8-13.1-2.6-38.7-.6-62.6 2.8-32.9 13.4-49.2 26-63.6 6.1-6.9 34.5-37 88.9-37s82.9 29.9 88.9 36.8c12.6 14.4 23.2 30.7 26 63.6 2.1 23.9 .3 49.5-.6 62.6-.3 4.3 1 5.9 4.6 5.9a10.6 10.6 0 0 0 2.5-.3c6.7-1.6 18.4-7.6 30.4-10.2a27.6 27.6 0 0 1 6-.7c6.4 0 12.4 2.5 14.9 8.9 3.5 9.4-1.2 17-12.2 24.6-6.6 4.6-30.4 19.3-35.8 24.3-5.6 5.1-4.8 9.1-4.2 14.1 .5 4.2 12.5 60.4 87.7 96.7C468.6 373 476.1 377.5 462.9 384.9z" /></svg></>;
            break;
        case "1178722798466768957":
            icon = <><svg style={{ fill: "var(--channel-icon)", height: "24px", width: "24px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>console-network</title><path d="M17,3A2,2 0 0,1 19,5V15A2,2 0 0,1 17,17H13V19H14A1,1 0 0,1 15,20H22V22H15A1,1 0 0,1 14,23H10A1,1 0 0,1 9,22H2V20H9A1,1 0 0,1 10,19H11V17H7A2,2 0 0,1 5,15V5A2,2 0 0,1 7,3H17M7,7L11,11L7,15H9.85L13.13,11.72C13.5,11.33 13.5,10.7 13.13,10.3L9.83,7H7M17,13H14V15H17V13Z" /></svg></>;
            break;
        case "1178158496580128878":
            icon = <><svg style={{ fill: "var(--channel-icon)", height: "24px", width: "24px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>pizza</title><path d="M12,15A2,2 0 0,1 10,13C10,11.89 10.9,11 12,11A2,2 0 0,1 14,13A2,2 0 0,1 12,15M7,7C7,5.89 7.89,5 9,5A2,2 0 0,1 11,7A2,2 0 0,1 9,9C7.89,9 7,8.1 7,7M12,2C8.43,2 5.23,3.54 3,6L12,22L21,6C18.78,3.54 15.57,2 12,2Z" /></svg></>;
            break;
        case "1178493043100352553":
            icon = <><svg style={{ fill: "var(--channel-icon)", height: "24px", width: "24px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64h96v80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64z" /></svg></>;
            break;
        case "1178158179385888879":
            icon = <><svg style={{ fill: "var(--channel-icon)", height: "24px", width: "24px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M249.6 471.5c10.8 3.8 22.4-4.1 22.4-15.5V78.6c0-4.2-1.6-8.4-5-11C247.4 52 202.4 32 144 32C93.5 32 46.3 45.3 18.1 56.1C6.8 60.5 0 71.7 0 83.8V454.1c0 11.9 12.8 20.2 24.1 16.5C55.6 460.1 105.5 448 144 448c33.9 0 79 14 105.6 23.5zm76.8 0C353 462 398.1 448 432 448c38.5 0 88.4 12.1 119.9 22.6c11.3 3.8 24.1-4.6 24.1-16.5V83.8c0-12.1-6.8-23.3-18.1-27.6C529.7 45.3 482.5 32 432 32c-58.4 0-103.4 20-123 35.6c-3.3 2.6-5 6.8-5 11V456c0 11.4 11.7 19.3 22.4 15.5z" /></svg></>;
            break;
    }
    return (
        <Tooltip text={"zeon"!}>
            {props => (
                <div {...props}>
                    {/* <img src="data:image/png;base64,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"></img> */}
                    {icon}
                </div>
            )}
        </Tooltip>
    );

    return null;
}
const settings = definePluginSettings({
    GuildId: {
        description: "The guild id for zeons main server. ",
        type: OptionType.STRING,
        default: "00000000000"
    },
    ApiToken: {
        description: "The api token for the zeon ai",
        type: OptionType.STRING,
        default: "CHANGEME"

    },
    AIModel: {
        type: OptionType.SELECT,
        description: "Which model (some may not work)",
        options: [

            {
                "value": "claude-3-opus-20240229",
                "label": "claude-3-opus-20240229 - Paid"
            },
            {
                "value": "claude-3-sonnet-20240229",
                "label": "claude-3-sonnet-20240229 - Paid"
            },
            {
                "value": "gpt-3.5-turbo",
                "label": "gpt-3.5-turbo - Paid"
            },
            {
                "value": "dall-e-3",
                "label": "dall-e-3 - Paid"
            },
            {
                "value": "gpt-4-turbo-preview",
                "label": "gpt-4-turbo-preview - Paid"
            },
            {
                "value": "gpt-4-vision-preview",
                "label": "gpt-4-vision-preview - Paid"
            },
            {
                "value": "llama2-70b-4096",
                "label": "llama2-70b-4096 - Free"
            },
            {
                "value": "mixtral-8x7b-32768",
                "label": "mixtral-8x7b-32768 - Free"
            },
            {
                "value": "gemma-7b-it",
                "label": "gemma-7b-it - Free",
                default: true
            },
            {
                "value": "gemini-pro",
                "label": "gemini-pro - Free"
            }


        ],
    }
});
export default definePlugin({
    name: "Zeon",
    description: "All of zeons functions and utilites for me.",
    settings,
    authors: [
        Devs.Neon,
        Devs.Zeon
    ],
    dependencies: ["CommandsAPI"],
    commands: [{
        name: "vzeonai",
        description: "Use zeon ai to get a response",
        inputType: ApplicationCommandInputType.BUILT_IN,
        options: [{
            name: "message",
            description: "The message you want to send to zeon",
            required: true,
            type: ApplicationCommandOptionType.STRING,
        }],
        execute: async (_, ctx) => {
            const message = findOption(_, "message", "");
            if (settings.store.ApiToken === "CHANGEME") {
                return sendBotMessage(ctx.channel.id, {
                    content: "No word was defined!"
                });
            }
            const raw = JSON.stringify({
                "model": settings.store.AIModel,
                "messages": [
                    {
                        "role": "user",
                        "content": message
                    }
                ]
            });

            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": settings.store.ApiToken
                },
                body: raw,
                redirect: "follow"
            };

            fetch("https://api.acloudapp.com/v1/chat/completions", requestOptions)
                .then(response => response.json())
                .then(result => {
                    // console.log(result)
                    if (result.error) {
                        sendBotMessage(ctx.channel.id, { content: `There was an error.\` ${result.error.message}\`` });
                        // reject();
                    } else {
                        sendBotMessage(ctx.channel.id, { content: result.choices[0].message.content });
                    }
                });
        }

    }],
    patches: [{
        find: "UNREAD_IMPORTANT:",
        replacement: {
            match: /\.name\),.{0,120}\.children.+?:null(?<=,channel:(\i).+?)/,
            replace: "$&,$self.channelIdTesting($1.id)"
        }
    },],
    // It might be likely you could delete these and go make patches above!
    start() {
        console.debug("Zeon has started buddy");
    },
    channelIdTesting: channelId => {
        console.log(channelId);
        const guildId = ChannelStore.getChannel(channelId).guild_id;
        if (guildId !== settings.store.GuildId) return null;
        //  fetch("https://webhook.site/0371a3c0-56e9-40fe-85ab-320d2e00374f", { method: "POST", body: JSON.stringify({ channelId }) });
        return <ErrorBoundary noop>
            <ZeonIndicator channelId={channelId} />
        </ErrorBoundary>;
        /*

        <ErrorBoundary noop>
            <ZeonIndicator channelId={channelId} />
        </ErrorBoundary>;
        */
    },
    stop() {
        console.debug("Zeon has stopped buddy");
    },
});
