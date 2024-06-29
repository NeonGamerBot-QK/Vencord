/*
 * Vencord, a Discord client mod
 * Zeons edition
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings, migratePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

const settings = definePluginSettings({
  showTimeouts: {
    type: OptionType.BOOLEAN,
    description: "Show member timeout icons in chat.",
    default: true
  },
  showInvitesPaused: {
    type: OptionType.BOOLEAN,
    description: "Show the invites paused tooltip in the server list.",
    default: true
  },
  showModView: {
    type: OptionType.BOOLEAN,
    description: "Show the member mod view context menu item in all servers.",
    default: true
  },
  disableDiscoveryFilters: {
    type: OptionType.BOOLEAN,
    description: "Disable filters in Server Discovery search that hide servers that don't meet discovery criteria.",
    default: true
  },
  disableDisallowedDiscoveryFilters: {
    type: OptionType.BOOLEAN,
    description: "Disable filters in Server Discovery search that hide NSFW & disallowed servers.",
    default: true
  }
});

migratePluginSettings("ShowHiddenThings", "ShowTimeouts");
export default definePlugin({
  name: "ShowHiddenThings",
  tags: ["ShowTimeouts", "ShowInvitesPaused", "ShowModView", "DisableDiscoveryFilters"],
  description: "Displays various hidden & moderator-only things regardless of permissions.",
  authors: [Devs.Dolfies],
  patches: [
    {
      find: "showCommunicationDisabledStyles",
      predicate: () => settings.store.showTimeouts,
      replacement: {
        match: /&&\i\.\i\.canManageUser\(\i\.\i\.MODERATE_MEMBERS,\i\.author,\i\)/,
        replace: "",
      },
    },
    {
      find: "2022-07_invites_disabled",
      predicate: () => settings.store.showInvitesPaused,
      replacement: {
        match: /\i\.\i\.can\(\i\.\i.MANAGE_GUILD,\i\)/,
        replace: "true",
      },
    },
    {
      find: /context:\i,checkElevated:!1\}\),\i\.\i.{0,200}autoTrackExposure/,
      predicate: () => settings.store.showModView,
      replacement: {
        match: /return \i\.\i\(\i\.\i\(\{user:\i,context:\i,checkElevated:!1\}\),\i\.\i\)/,
        replace: "return true",
      }
    },
    {
      find: "prod_discoverable_guilds",
      predicate: () => settings.store.disableDiscoveryFilters,
      replacement: {
        match: /\{"auto_removed:.*?\}/,
        replace: "{}"
      }
    },
    // remove the 200 server minimum
    {
      find: '">200"',
      predicate: () => settings.store.disableDiscoveryFilters,
      replacement: {
        match: '">200"',
        replace: '">0"'
      }
    },
    // empty word filter (why would anyone search "horny" in fucking server discovery... please... why are we patching this again??)
    {
      find: '"horny","fart"',
      predicate: () => settings.store.disableDisallowedDiscoveryFilters,
      replacement: {
        match: /=\["egirl",.+?\]/,
        replace: "=[]"
      }
    },
    // empty 2nd word filter
    {
      find: '"pepe","nude"',
      predicate: () => settings.store.disableDisallowedDiscoveryFilters,
      replacement: {
        match: /(?<=[?=])\["pepe",.+?\]/,
        replace: "[]",
      },
    },
    // patch request that queries if term is allowed
    {
      find: ".GUILD_DISCOVERY_VALID_TERM",
      predicate: () => settings.store.disableDisallowedDiscoveryFilters,
      all: true,
      replacement: {
        match: /\i\.\i\.get\(\{url:\i\.\i\.GUILD_DISCOVERY_VALID_TERM,query:\{term:\i\},oldFormErrors:!0\}\);/g,
        replace: "Promise.resolve({ body: { valid: true } });"
      }
    }
  ],
  settings,
});
