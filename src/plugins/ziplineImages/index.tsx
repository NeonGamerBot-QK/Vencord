/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { addTab, removeTab } from "@api/Tablists";
import { Devs } from "@utils/constants";
import { sendMessage } from "@utils/discord";
import definePlugin, { OptionType, PluginNative } from "@utils/types";
import { Button, Tooltip, useEffect, useState } from "@webpack/common";

export function uniqueIdForThisPluginCalledZiplineImages() { }
const Native = VencordNative.pluginHelpers.ZiplineImages as PluginNative<typeof import("./native")>;

// import { useEffect, useState } from "react";
const getAvatarUrl = () => {
    const user = Vencord.Webpack.Common.UserStore.getCurrentUser();
    return "https://cdn.discordapp.com/avatars/" + user.id + "/" + user.avatar + ".png";
};
const handleClick = (image: any, channelId) => () => {
    // insertTextIntoChatInputBox(image.url);

    // setTimeout(() => {
    //     // below is the direct connectionto the send button
    //     // @ts-ignore
    //     document.getElementsByClassName("contents__322f4 button__437ce innerButton__9efb8")[0].click();
    // }, 100);
    console.log(channelId);
    sendMessage(channelId.id, { content: image.url });
    // sendMessage()
};
const upload = channelId => {
    Native.openFilePrompt().then(async (paths: string[]) => {
        console.log(paths);
        const contents = await Promise.all(paths.map(path => Native.readFilePath(path)));
        const form = new FormData();
        let i = 0;
        for (const content of contents) {
            form.append("file", new Blob([content]), paths[i].includes("\\") ? paths[i].split("\\").pop() : paths[i].split("/").pop());
            i++;
        }
        fetch(settings.store.url + "/api/upload", {
            method: "POST",
            headers: {
                "Authorization": settings.store.apikey,
                // "Content-Type": undefined
            },
            body: form
        }).then(res => {
            console.log(res);
            res.json().then(({ files }) => {
                handleClick({
                    url: files.join("\n"),
                }, channelId)();
            });
        }).catch(e => {
            console.error(e);
        });


    });
};
const DisplayTab = (props: any) => {
    if (settings.store.url === "CHANGEME" || settings.store.apikey === "CHANGEME") return (<div>Settings not set, make sure you add <pre>url,apikey</pre> properties</div>);
    // get current channel
    const [files, setFiles] = useState([]);
    useEffect(() => {
        const fetchFiles = async () => {
            const res = await fetch(settings.store.url + "/api/user/files", {
                headers: {
                    "Authorization": settings.store.apikey
                }
            });
            const data = await res.json();
            console.log(data);
            setFiles(data.filter(e => e.mimetype.startsWith("image") || e.mimetype.startsWith("application/octet-stream")).map(e => {
                return {
                    url: settings.store.url + e.url,
                    name: e.name
                };
            }));
        };
        fetchFiles();
    }, [setFiles]);
    console.log(props);
    // debugger;
    return (<div style={{ color: "white", overflow: "auto" }}>
        <div style={{ flex: "inline" }}>
            <h1 style={{ display: "flex", fontSize: "80px", fontWeight: "bold" }}>CDN images</h1>
            <Button onClick={() => upload(props.channel.id)}>
                Upload Image
            </Button>
        </div>
        {/* <ImageIcon /> */}
        <div style={{ flex: "grid", grid: "initial", margin: "10px" }}>
            {files.map(image => {
                // display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "20px"
                return <div onClick={handleClick(image, props.channel)}>
                    <Tooltip text={image.name}>
                        {props => (
                            <img src={image.url} style={{ borderRadius: "5%", maxWidth: "200px", maxHeight: "200px" }} {...props} ></img>
                        )}
                    </Tooltip>
                </div>;
                //    { /* */ }
            })}
        </div>
    </div >);
};
const settings = definePluginSettings({
    url: {
        description: "The zipline cdn url",
        required: true,
        type: OptionType.STRING,
        default: "CHANGEME",
    },
    apikey: {
        description: "The zipline api key",
        required: true,
        type: OptionType.STRING,
        default: "CHANGEME",
    },
});
export default definePlugin({
    name: "ziplineImages",
    description: "Use zipline cdn to store images for any channel",
    authors: [
        Devs.Neon
    ],
    settings,
    // patches: [],
    // It might be likely you could delete these and go make patches above!
    start() {
        addTab("zipline", "Images from cdn", DisplayTab, false);
    },
    stop() {
        removeTab("zipline");
    },
});
