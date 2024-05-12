/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { dialog } from "electron";
import { readFileSync } from "fs";
// so apperntly you can use electron's dialog module to open a file prompt
// because its IPC is broken ... or something
export function openFilePrompt(): Promise<string[]> {
    return new Promise((res, rej) => {

        let files = dialog.showOpenDialogSync({
            properties: ["openFile"],
        });
        // , function (files) {
        console.log(files);
        // handle filesw
        if (!files) files = [];
        res(files);
        // debugger;

        // }

    });
}
export function uniqueIdForThisPluginCalledCustomUpload() { }
export function readFilePath(_e: any, file: string): Buffer {
    console.log(_e, file);
    return readFileSync(file);
}
