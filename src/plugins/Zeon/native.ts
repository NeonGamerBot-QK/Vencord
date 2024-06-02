/*
 * Vencord, a Discord client mod
 * Zeons edition
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import os from "os";
// just made the native file for now :)

export const noop = () => { };
export const getHostname = () => {
  return os.hostname();
};
