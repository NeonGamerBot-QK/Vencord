/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import { insertTextIntoChatInputBox } from "@utils/discord";
import definePlugin, { OptionType, PluginNative } from "@utils/types";
import { Button } from "@webpack/common";

// import * as Native from "./native";
// const Native = await import("./native");
// import { openFilePrompt } from "./native";
export function uniqueIdForThisPluginCalledCustomUpload() { }
const Native = VencordNative.pluginHelpers.CustomUpload as PluginNative<typeof import("./native")>;

// note this version uses the same patch as the plugin which changes how your button opens,
// @see



/**
 * Patch:
 *  {
            find: "Messages.CHAT_ATTACH_UPLOAD_OR_INVITE",
            replacement: {
                // Discord merges multiple props here with Object.assign()
                // This patch passes a third object to it with which we override onClick and onContextMenu
                match: /CHAT_ATTACH_UPLOAD_OR_INVITE,onDoubleClick:(.+?:void 0),\.\.\.(\i),/,
                replace: "$&onClick:$1,onContextMenu:$2.onClick,",
            },
        },
 */

const settings = definePluginSettings({
    upload_url: {
        description: "Upload URL",
        default: "https://example.com/upload",
        type: OptionType.STRING,
    },
    auth: {
        description: "The auth token, (optional)",
        default: "IGNORE_ME",
        type: OptionType.STRING,
    },
    testButton: {
        type: OptionType.COMPONENT,
        description: "Test Button",
        component: () => {
            return <Button >e </Button>;
            // return <Select options={[{
            //     label: "test",
            //     value: "tst"
            // }]}

            //     isSelected={v => v === "tst"}
            //     serialize={identity}
            // ></Select>;
            // Native
        },
    }
});
// @see https://stackoverflow.com/questions/64781995/how-to-get-mime-type-of-an-array-buffer-object
function getMimeTypeFromArrayBuffer(uint8arr) {
    // const uint8arr = new Uint8Array(arrayBuffer);

    const len = 4;
    if (uint8arr.length >= len) {
        const signatureArr = new Array(len);
        for (let i = 0; i < len; i++)
            signatureArr[i] = (uint8arr)[i].toString(16);
        const signature = signatureArr.join("").toLowerCase();
        let type: null | string = null;
        switch (signature) {
            case "89504e47":
                type = "image/png";
                break;
            case "47494638":
                type = "image/gif";
                break;
            case "ffd8ffe0":
                type = "image/jpg";

                break;
            case "ffd8ffe1":
                type = "image/jpg";

                break;
            case "ffd8ffdb":
                type = "image/jpg";
                break;
            case "ffd8ffe2":
                type = "image/jpeg";
                break;
            case "25504446":
                type = "application/pdf";
                break;
            case "504b0304":
                type = "application/zip";
                break;
            default:
                type = null;
                break;
        }
        return type;
    }
    return null;
}
export default definePlugin({
    name: "CustomUpload",
    description: "Upload with a single click, open menu with right click and use custom cdn to upload instead of stinky discord",
    settings,
    authors: [Devs.Neon],
    patches: [
        {
            find: "Messages.CHAT_ATTACH_UPLOAD_OR_INVITE",
            replacement: {
                // Discord merges multiple props here with Object.assign()
                // This patch passes a third object to it with which we override onClick and onContextMenu
                match: /CHAT_ATTACH_UPLOAD_OR_INVITE,onDoubleClick:(.+?:void 0),\.\.\.(\i),/,
                replace: "$&onClick:$self.customUpload,onContextMenu:$2.onClick,",
            },
        },
    ],
    customUpload(e) {
        console.log(e);
        // here me out i ask for electron
        // so heres what i do
        // 1. ~~open model~~ open file prompt
        // 2. get file
        // 3. upload file
        // 4. get link
        // 5. send file
        // CURSE YOU CORS!!
        Native.openFilePrompt().then(async (paths: string[]) => {
            console.log(paths);
            const contents = await Promise.all(paths.map(path => Native.readFilePath(path)));
            const form = new FormData();
            let i = 0;
            for (const content of contents) {
                form.append("file", new Blob([content]), paths[i].includes("\\") ? paths[i].split("\\").pop() : paths[i].split("/").pop());
                i++;
            }
            fetch(settings.store.upload_url, {
                method: "POST",
                headers: {
                    "Authorization": settings.store.auth,
                    // "Content-Type": undefined
                },
                body: form
            }).then(res => {
                console.log(res);
                res.json().then(({ files }) => {
                    insertTextIntoChatInputBox(files.join("\n"));
                });
            }).catch(e => {
                console.error(e);
            });
            // const d = await Native.readFilePath(paths[0]);
            // console.log(d, new TextDecoder().decode(d));
            // paths.forEach(path => {
            //     // const d = Native.readFilePath(path);
            //     // console.log(d, new TextDecoder().decode(d));
            //     fetch(settings.store.upload_url, {
            //         method: "POST",
            //         headers: {
            //             "Content-Type": "application/json",
            //             "Authorization": settings.store.auth
            //         },
            //         body: JSON.stringify({ path })
            //     }).then(res => {
            //         console.log(res);
            //     }).catch(e => {
            //         console.error(e);
            //     });
            // });


        });
    }

});

// e
