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
    const channel = ChannelStore.getChannel(channelId);

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
            icon = <><svg style={{ fill: "var(--channel-icon)", height: "24px", width: "24px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64h96v80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64z" /></svg></>;
            break;
        case "1178158179385888879":
            icon = <><svg style={{ fill: "var(--channel-icon)", height: "24px", width: "24px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M249.6 471.5c10.8 3.8 22.4-4.1 22.4-15.5V78.6c0-4.2-1.6-8.4-5-11C247.4 52 202.4 32 144 32C93.5 32 46.3 45.3 18.1 56.1C6.8 60.5 0 71.7 0 83.8V454.1c0 11.9 12.8 20.2 24.1 16.5C55.6 460.1 105.5 448 144 448c33.9 0 79 14 105.6 23.5zm76.8 0C353 462 398.1 448 432 448c38.5 0 88.4 12.1 119.9 22.6c11.3 3.8 24.1-4.6 24.1-16.5V83.8c0-12.1-6.8-23.3-18.1-27.6C529.7 45.3 482.5 32 432 32c-58.4 0-103.4 20-123 35.6c-3.3 2.6-5 6.8-5 11V456c0 11.4 11.7 19.3 22.4 15.5z" /></svg></>;
            break;
        case "1237024834790100992":
            icon = <><svg style={{ fill: "var(--channel-icon)", height: "24px", width: "24px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7v72V368c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V147L192 223.8V432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V200 128c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z" /></svg></>;
            break;
        case "1178489699686432828":
        case "1210399621478748230":
            icon = <><svg style={{ fill: "var(--channel-icon)", height: "24px", width: "24px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M569.5 440C588 472 564.8 512 527.9 512H48.1c-36.9 0-60-40.1-41.6-72L246.4 24c18.5-32 64.7-32 83.2 0l239.9 416zM288 354c-25.4 0-46 20.6-46 46s20.6 46 46 46 46-20.6 46-46-20.6-46-46-46zm-43.7-165.3l7.4 136c.3 6.4 5.6 11.3 12 11.3h48.5c6.4 0 11.6-5 12-11.3l7.4-136c.4-6.9-5.1-12.7-12-12.7h-63.4c-6.9 0-12.4 5.8-12 12.7z" /></svg></>;
            break;
        case "1178155999769665546":
            icon = <><svg style={{ fill: "var(--channel-icon)", height: "24px", width: "24px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M80 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm32.4 97.2c28-12.4 47.6-40.5 47.6-73.2c0-44.2-35.8-80-80-80S0 35.8 0 80c0 32.8 19.7 61 48 73.3V358.7C19.7 371 0 399.2 0 432c0 44.2 35.8 80 80 80s80-35.8 80-80c0-32.8-19.7-61-48-73.3V272c26.7 20.1 60 32 96 32h86.7c12.3 28.3 40.5 48 73.3 48c44.2 0 80-35.8 80-80s-35.8-80-80-80c-32.8 0-61 19.7-73.3 48H208c-49.9 0-91-38.1-95.6-86.8zM80 408a24 24 0 1 1 0 48 24 24 0 1 1 0-48zM344 272a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z" /></svg></>;
            break;
        case "1169453978745065542":
        case "1155257379814920212":
        case "1155343304255348788":
            icon = <><svg style={{ fill: "var(--channel-icon)", height: "24px", width: "24px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" /></svg></>;
            break;
        case "1179990006140514304":
        case "1179990052437246012":
            icon = <><svg style={{ fill: "var(--channel-icon)", height: "24px", width: "24px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z" />
            </svg></>;
            break;
        case "1224160307665174549":
            icon = <><svg style={{ fill: "var(--channel-icon)", height: "24px", width: "24px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <defs></defs>
                <path d="M7 5.5C7 4.67157 7.67157 4 8.5 4H15.5C16.3284 4 17 4.67157 17 5.5V12H8.5C7.67157 12 7 11.3284 7 10.5V5.5Z" fill="#F26207"></path>
                <path d="M17 12H25.5C26.3284 12 27 12.6716 27 13.5V18.5C27 19.3284 26.3284 20 25.5 20H17V12Z" fill="#F26207"></path>
                <path d="M7 21.5C7 20.6716 7.67157 20 8.5 20H17V26.5C17 27.3284 16.3284 28 15.5 28H8.5C7.67157 28 7 27.3284 7 26.5V21.5Z" fill="#F26207"></path>
            </svg></>;
            break;
        case "1193964100426936492":
            //
            icon = <><svg style={{ fill: "var(--channel-icon)", height: "24px", width: "24px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M16 12.25c-2.071 0-3.75 1.679-3.75 3.75s1.679 3.75 3.75 3.75c2.071 0 3.75-1.679 3.75-3.75v0c-0.003-2.070-1.68-3.747-3.75-3.75h-0zM16 18.25c-1.243 0-2.25-1.007-2.25-2.25s1.007-2.25 2.25-2.25c1.243 0 2.25 1.007 2.25 2.25v0c-0.002 1.242-1.008 2.248-2.25 2.25h-0zM2.75 16c0.213-3.554 1.667-6.732 3.93-9.142l-0.007 0.008c0.131-0.135 0.212-0.319 0.212-0.522 0-0.414-0.336-0.75-0.75-0.75-0.204 0-0.388 0.081-0.524 0.213l0-0c-2.542 2.664-4.167 6.222-4.36 10.157l-0.001 0.037c0.195 3.972 1.82 7.53 4.367 10.202l-0.006-0.006c0.135 0.131 0.319 0.212 0.523 0.212 0.414 0 0.75-0.336 0.75-0.75 0-0.203-0.081-0.388-0.213-0.523l0 0c-2.259-2.4-3.714-5.58-3.92-9.095l-0.002-0.040zM8.863 16c0.151-2.479 1.166-4.697 2.744-6.379l-0.005 0.005c0.131-0.135 0.212-0.319 0.212-0.522 0-0.414-0.336-0.75-0.75-0.75-0.204 0-0.388 0.081-0.523 0.213l0-0c-1.853 1.943-3.037 4.537-3.177 7.406l-0.001 0.027c0.14 2.895 1.325 5.489 3.182 7.436l-0.004-0.005c0.136 0.138 0.325 0.223 0.533 0.223 0.414 0 0.749-0.335 0.749-0.749 0-0.208-0.085-0.396-0.222-0.532l-0-0c-1.577-1.674-2.592-3.893-2.737-6.345l-0.001-0.028zM26.391 5.807c-0.136-0.135-0.322-0.218-0.528-0.218-0.414 0-0.75 0.336-0.75 0.75 0 0.205 0.083 0.392 0.216 0.527l-0-0c2.255 2.402 3.709 5.58 3.92 9.093l0.002 0.040c-0.213 3.554-1.666 6.733-3.929 9.143l0.007-0.008c-0.14 0.136-0.226 0.326-0.226 0.537 0 0.414 0.336 0.75 0.75 0.75 0.211 0 0.402-0.087 0.539-0.228l0-0c2.541-2.665 4.166-6.222 4.358-10.157l0.001-0.037c-0.194-3.971-1.819-7.529-4.365-10.2l0.006 0.006zM20.398 8.567c-0.136 0.136-0.22 0.323-0.22 0.531 0 0.206 0.083 0.393 0.218 0.529l-0-0c1.574 1.676 2.589 3.893 2.739 6.344l0.001 0.029c-0.152 2.48-1.167 4.697-2.745 6.378l0.005-0.005c-0.134 0.136-0.218 0.322-0.218 0.528 0 0.415 0.336 0.751 0.751 0.751 0.207 0 0.394-0.083 0.529-0.218l-0 0c1.852-1.944 3.036-4.538 3.177-7.407l0.001-0.027c-0.14-2.896-1.325-5.491-3.184-7.437l0.004 0.004c-0.135-0.136-0.323-0.22-0.529-0.22s-0.394 0.084-0.529 0.22l-0 0z"></path>
            </svg></>;
            break;
        case "1225646952213905468":
            icon = <><svg style={{ fill: "var(--channel-icon)", height: "24px", width: "24px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M 225.599 143.511 C 188.164 149.610, 147.635 171.095, 108 205.854 C 96.349 216.071, 63 249.242, 63 250.613 C 63 251.690, 92.787 280.835, 106.500 293.177 C 124.127 309.041, 150.199 327.476, 169 337.371 C 225.336 367.019, 281.921 366.051, 338 334.479 C 347.581 329.085, 354.405 324.499, 349 327.087 C 347.625 327.745, 345.373 329.072, 343.995 330.035 C 338.769 333.690, 318.032 343.481, 306.644 347.670 C 287.473 354.722, 272.988 357.269, 251.500 357.364 C 236.512 357.431, 231.583 357.061, 222.046 355.153 C 189.406 348.623, 160.957 334.701, 127.323 308.798 C 113.140 297.875, 100.285 286.362, 80.563 266.919 L 63.627 250.221 79.591 234.361 C 88.372 225.637, 99.368 215.092, 104.028 210.926 C 144.016 175.179, 181.680 154.055, 220 145.881 C 228.613 144.044, 233.824 143.629, 249 143.571 C 271.191 143.486, 282.542 145.260, 304 152.167 C 315.168 155.762, 339.955 168.393, 353.071 177.174 C 367.146 186.596, 383.738 199.414, 395 209.566 C 410.813 223.820, 436 248.952, 436 250.476 C 436 253.749, 396.990 291.217, 379.027 305.197 C 377.121 306.681, 375.772 308.105, 376.030 308.362 C 378.013 310.334, 437 254.411, 437 250.559 C 437 246.835, 399.486 210.834, 377 192.979 C 366.427 184.584, 346.194 170.944, 336 165.339 C 320.207 156.657, 299.982 148.945, 282.500 144.940 C 270.423 142.173, 238.704 141.377, 225.599 143.511 M 229.530 161.587 C 188.971 167.890, 145.774 193.326, 101.693 236.863 L 87.886 250.500 99.693 261.886 C 165.254 325.111, 219.099 348.562, 275.303 338.369 C 280.145 337.491, 283.908 336.575, 283.666 336.333 C 283.424 336.091, 279.238 336.650, 274.363 337.576 C 262.576 339.814, 239.726 339.808, 227 337.563 C 187.040 330.514, 139.420 301.010, 95.534 256.110 L 89.569 250.006 94.534 244.921 C 102.126 237.147, 124.153 217.370, 134.368 209.158 C 162.940 186.188, 194.988 169.867, 223.352 163.840 C 236.659 161.012, 260.935 160.783, 275 163.351 C 303.242 168.508, 335.978 185.037, 367 209.805 C 378.985 219.373, 409.284 247.397, 410.452 249.994 C 411.599 252.543, 378.867 282.818, 359.170 297.428 C 348.756 305.153, 346.818 307.379, 356.250 300.784 C 367.643 292.818, 384.033 278.859, 398.730 264.607 L 413.241 250.535 400.056 237.720 C 338.241 177.637, 283.506 153.200, 229.530 161.587 M 228 180.661 C 202.510 185.084, 171.036 200.991, 144.656 222.783 C 133.726 231.813, 116 248.933, 116 250.459 C 116 252.992, 140.790 275.598, 155.500 286.479 C 187.490 310.142, 219.204 321.914, 251.151 321.982 C 268.211 322.018, 292.910 316.172, 310.250 307.995 C 317.382 304.631, 319.623 302.839, 313.250 305.595 C 293.786 314.012, 278.567 318.420, 263.204 320.088 C 229.847 323.709, 195.040 313.136, 160.827 288.988 C 150.039 281.374, 133.010 266.809, 123.500 257.063 L 116.500 249.889 125 241.881 C 161.859 207.154, 191.552 189.694, 226.354 182.284 C 237.731 179.862, 263.347 179.888, 275 182.334 C 308.359 189.335, 340.837 208.298, 374.500 240.428 L 384.500 249.972 372.500 261.743 C 358.363 275.610, 347.302 284.673, 333.333 293.833 C 319.411 302.963, 318.906 303.321, 322 301.864 C 333.406 296.493, 358.436 277.333, 375.289 261.072 L 386.097 250.645 378.799 243.237 C 343.681 207.596, 304.723 185.286, 268.448 180.044 C 258.567 178.616, 237.978 178.930, 228 180.661 M 244.211 199.073 C 239.480 200.518, 233.335 207.072, 231.907 212.197 C 230.885 215.867, 231.031 218.117, 232.901 227.500 C 235.990 242.993, 240.877 264.091, 241.981 266.702 C 243.275 269.758, 248.485 272.272, 251.947 271.512 C 257.823 270.221, 258.860 267.788, 264.677 241.651 C 269.415 220.362, 269.987 216.665, 269.069 213.258 C 267.791 208.510, 263.555 202.861, 259.544 200.556 C 255.878 198.448, 248.573 197.742, 244.211 199.073 M 246.500 199.931 C 239.790 201.545, 234.776 206.406, 232.994 213.023 C 231.875 217.177, 233.128 224.606, 239.892 253.944 C 243.015 267.488, 244.624 270, 250.177 270 C 254.776 270, 256.707 268.411, 258.367 263.260 C 260.655 256.158, 268 220.431, 268 216.401 C 268 212.783, 265.968 207.876, 263.132 204.648 C 259.689 200.729, 252.116 198.581, 246.500 199.931 M 178.972 220.177 C 169.257 226.417, 148.627 242.542, 143.724 247.727 L 140.949 250.663 147.724 256.605 C 151.451 259.873, 156.805 264.443, 159.622 266.759 C 166.974 272.806, 186.817 286, 188.558 286 C 189.714 286, 189.474 284.895, 187.451 280.904 C 183.247 272.606, 180.854 261.702, 180.779 250.500 C 180.705 239.235, 182.461 230.946, 186.972 221.271 C 188.569 217.844, 189.542 214.835, 189.135 214.583 C 188.727 214.331, 184.154 216.849, 178.972 220.177 M 312 215.564 C 312 215.874, 313.144 218.630, 314.543 221.688 C 318.348 230.005, 320.202 239.343, 320.266 250.500 C 320.330 261.735, 319.027 268.351, 314.778 278.351 C 313.178 282.118, 312.110 285.443, 312.406 285.739 C 314.542 287.876, 359 254.306, 359 250.557 C 359 247.917, 338.948 231.236, 323.864 221.329 C 315.034 215.529, 312 214.055, 312 215.564 M 181 220.200 C 171.564 226.094, 157.435 236.878, 149.541 244.212 L 142.679 250.586 149.837 256.995 C 158.162 264.448, 173.316 275.905, 181.817 281.174 L 187.745 284.847 185.980 281.174 C 181.609 272.074, 179.647 262.799, 179.598 251 C 179.546 238.342, 180.794 231.782, 185.071 222.250 C 186.613 218.813, 187.790 216.031, 187.687 216.070 C 187.584 216.108, 184.575 217.967, 181 220.200 M 313.766 217.166 C 315.737 219.622, 319.744 231.865, 321.071 239.485 C 322.728 249.003, 321.720 261.662, 318.482 272 C 317.017 276.675, 315.155 281.543, 314.343 282.817 C 313.112 284.748, 313.913 284.468, 319.158 281.133 C 329.204 274.746, 343.925 263.622, 351.437 256.740 L 358.374 250.386 353.913 246.274 C 351.460 244.013, 346.430 239.685, 342.736 236.657 C 331.512 227.457, 310.893 213.584, 313.766 217.166 M 243.756 281.755 C 240.778 283.601, 238 288.522, 238 291.951 C 238 295.010, 240.517 299.475, 243.615 301.912 C 250.419 307.264, 261.482 302.277, 262.684 293.316 C 263.346 288.384, 260.626 283.062, 256.478 281.172 C 252.811 279.501, 246.958 279.769, 243.756 281.755 M 243.659 283.054 C 242.223 284.183, 240.535 286.818, 239.909 288.910 C 237.852 295.775, 243.283 303, 250.500 303 C 256.280 303, 262 297.529, 262 292 C 262 289.065, 259.430 284.415, 256.783 282.561 C 253.569 280.310, 246.825 280.563, 243.659 283.054 M 341 310.139 C 329.953 317.464, 308.019 328.075, 295.804 332.002 C 284.497 335.637, 281.736 337.266, 291.643 334.458 C 300.475 331.953, 314.409 326.242, 324.684 320.913 C 333.379 316.403, 349 306.483, 349 305.470 C 349 304.812, 349.287 304.644, 341 310.139 M 364.192 316.398 C 353.738 323.819, 348.996 327.728, 354.543 324.352 C 362.712 319.379, 376.733 308.787, 374.809 309.041 C 374.639 309.063, 369.862 312.374, 364.192 316.398" stroke="none" fill="#71640d" fill-rule="evenodd" /><path d="M 230.500 144.077 C 189.762 149.646, 147.719 171.868, 104.028 210.926 C 99.368 215.092, 88.372 225.637, 79.591 234.361 L 63.627 250.221 80.563 266.919 C 100.285 286.362, 113.140 297.875, 127.323 308.798 C 160.957 334.701, 189.406 348.623, 222.046 355.153 C 239.012 358.547, 264.428 358.338, 282.144 354.658 C 302.019 350.529, 326.908 340.506, 345.475 329.153 C 352.820 324.662, 372.072 311.092, 377.500 306.580 C 379.700 304.751, 385.775 299.726, 391 295.415 C 403.122 285.411, 436 252.578, 436 250.476 C 436 248.952, 410.813 223.820, 395 209.566 C 361.346 179.229, 323.516 156.901, 291.500 148.476 C 274.153 143.912, 246.367 141.908, 230.500 144.077 M 229.530 161.587 C 188.971 167.890, 145.774 193.326, 101.693 236.863 L 87.886 250.500 99.693 261.886 C 144.042 304.655, 182.364 328.619, 220.580 337.482 C 253.094 345.023, 289.396 339.216, 324.911 320.794 C 345.665 310.029, 374.109 288.409, 398.286 265.023 L 413.253 250.546 400.062 237.725 C 338.241 177.637, 283.508 153.200, 229.530 161.587 M 237 180.613 C 199.378 185.249, 165.352 203.863, 125 241.881 L 116.500 249.889 123.500 257.063 C 138.051 271.975, 161.510 290.702, 175.113 298.264 C 188.246 305.564, 191.763 307.324, 198.907 310.172 C 233.649 324.022, 263.824 324.368, 299 311.319 C 324.789 301.753, 346.953 286.803, 372.500 261.743 L 384.500 249.972 374.500 240.428 C 341.002 208.455, 308.093 189.193, 275.500 182.482 C 267.744 180.885, 244.105 179.737, 237 180.613 M 244.211 199.073 C 239.480 200.518, 233.335 207.072, 231.907 212.197 C 230.885 215.867, 231.031 218.117, 232.901 227.500 C 235.990 242.993, 240.877 264.091, 241.981 266.702 C 243.275 269.758, 248.485 272.272, 251.947 271.512 C 257.823 270.221, 258.860 267.788, 264.677 241.651 C 269.415 220.362, 269.987 216.665, 269.069 213.258 C 267.791 208.510, 263.555 202.861, 259.544 200.556 C 255.878 198.448, 248.573 197.742, 244.211 199.073 M 178.972 220.177 C 169.257 226.417, 148.627 242.542, 143.724 247.727 L 140.949 250.663 147.724 256.605 C 151.451 259.873, 156.805 264.443, 159.622 266.759 C 166.974 272.806, 186.817 286, 188.558 286 C 189.714 286, 189.474 284.895, 187.451 280.904 C 183.247 272.606, 180.854 261.702, 180.779 250.500 C 180.705 239.235, 182.461 230.946, 186.972 221.271 C 188.569 217.844, 189.542 214.835, 189.135 214.583 C 188.727 214.331, 184.154 216.849, 178.972 220.177 M 312 215.564 C 312 215.874, 313.144 218.630, 314.543 221.688 C 318.348 230.005, 320.202 239.343, 320.266 250.500 C 320.330 261.735, 319.027 268.351, 314.778 278.351 C 313.178 282.118, 312.110 285.443, 312.406 285.739 C 314.542 287.876, 359 254.306, 359 250.557 C 359 247.917, 338.948 231.236, 323.864 221.329 C 315.034 215.529, 312 214.055, 312 215.564 M 243.756 281.755 C 240.778 283.601, 238 288.522, 238 291.951 C 238 295.010, 240.517 299.475, 243.615 301.912 C 250.419 307.264, 261.482 302.277, 262.684 293.316 C 263.346 288.384, 260.626 283.062, 256.478 281.172 C 252.811 279.501, 246.958 279.769, 243.756 281.755" stroke="none" fill="#b29906" fill-rule="evenodd" />
            </svg></>;
            break;
        // content warning
        //
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
    },
    useCss: {
        type: OptionType.BOOLEAN,
        description: "Use inject css. (may lag)",
        default: true
    }
});
function injectCSS(css) {
    const style = document.createElement("style");
    style.id = "zeon-css";
    style.innerHTML = css;
    document.head.appendChild(style);
}
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
            // @ts-ignore
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
    },
    // @see https://discord.com/channels/1015060230222131221/1032200195582197831/1217606292940521542
    {
        find: "this.favoriteEmojisWithoutFetchingLatest.concat",
        replacement: {
            match: "this.favoriteEmojisWithoutFetchingLatest.concat",
            replace: "[].concat"
        }
    },
    ],
    // It might be likely you could delete these and go make patches above!
    start() {
        if (settings.store.useCss) {
            const css = `
            .avatar__991e2 {
                background-color: #7289da;
                border-radius: 50%;
                padding: 4px;
                margin-left: 4px;
            }
            `;

            import("./styles.css");
            // injectCSS(css);
        }
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
        document.getElementById("zeon-css")?.remove();
    },
});
