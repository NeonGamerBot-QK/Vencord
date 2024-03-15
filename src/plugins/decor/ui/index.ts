/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { classNameFactory } from "@api/Styles";
import { extractAndLoadChunksLazy, waitForPropsLazy } from "@webpack";

export const cl = classNameFactory("vc-decor-");
export const DecorationModalStyles = waitForPropsLazy("modalFooterShopButton");

export const requireAvatarDecorationModal = extractAndLoadChunksLazy(["openAvatarDecorationModal:"]);
export const requireCreateStickerModal = extractAndLoadChunksLazy(["stickerInspected]:"]);
