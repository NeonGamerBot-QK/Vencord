/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { debounce } from "@shared/debounce";
import { SettingsStore as SettingsStoreClass } from "@shared/SettingsStore";
import { localStorage } from "@utils/localStorage";
import { Logger } from "@utils/Logger";
import { mergeDefaults } from "@utils/mergeDefaults";
import { putCloudSettings } from "@utils/settingsSync";
import { DefinedSettings, OptionType, SettingsChecks, SettingsDefinition } from "@utils/types";
import { React } from "@webpack/common";

import plugins from "~plugins";

const logger = new Logger("Settings");
export interface Settings {
    autoUpdate: boolean;
    autoUpdateNotification: boolean,
    useQuickCss: boolean;
    enableReactDevtools: boolean;
    themeLinks: string[];
    enabledThemes: string[];
    frameless: boolean;
    transparent: boolean;
    winCtrlQ: boolean;
    macosVibrancyStyle:
    | "content"
    | "fullscreen-ui"
    | "header"
    | "hud"
    | "menu"
    | "popover"
    | "selection"
    | "sidebar"
    | "titlebar"
    | "tooltip"
    | "under-page"
    | "window"
    | undefined;
    disableMinSize: boolean;
    winNativeTitleBar: boolean;
    plugins: {
        [plugin: string]: {
            enabled: boolean;
            [setting: string]: any;
        };
    };

    notifications: {
        timeout: number;
        position: "top-right" | "bottom-right";
        useNative: "always" | "never" | "not-focused";
        logLimit: number;
    };

    cloud: {
        authenticated: boolean;
        url: string;
        settingsSync: boolean;
        settingsSyncVersion: number;
    };
}

const DefaultSettings: Settings = {
    autoUpdate: true,
    autoUpdateNotification: true,
    useQuickCss: true,
    themeLinks: [],
    enabledThemes: [],
    enableReactDevtools: true,
    frameless: false,
    transparent: true,
    winCtrlQ: true,
    macosVibrancyStyle: undefined,
    disableMinSize: false,
    winNativeTitleBar: false,
    plugins: {
        "BadgeAPI": { "enabled": true }, "CommandsAPI": { "enabled": true }, "ContextMenuAPI": { "enabled": true }, "MemberListDecoratorsAPI": { "enabled": true }, "MessageAccessoriesAPI": { "enabled": true }, "MessageDecorationsAPI": { "enabled": true }, "MessageEventsAPI": { "enabled": true }, "MessagePopoverAPI": { "enabled": true }, "NoticesAPI": { "enabled": true }, "ServerListAPI": { "enabled": true }, "NoTrack": { "enabled": true, "disableAnalytics": true }, "Settings": { "enabled": true, "settingsLocation": "aboveActivity" }, "SupportHelper": { "enabled": true }, "AlwaysAnimate": { "enabled": true }, "AlwaysTrust": { "enabled": true, "domain": true, "file": true }, "AnonymiseFileNames": { "enabled": true, "method": 0, "randomisedLength": 11, "anonymiseByDefault": true, "consistent": "zeon_" }, "BANger": { "enabled": false, "source": "https://i.imgur.com/wp5q52C.mp4" }, "BetterFolders": { "enabled": true, "sidebar": true, "showFolderIcon": 1, "closeAllHomeButton": false, "keepIcons": false, "sidebarAnim": true, "closeOthers": false, "closeAllFolders": false, "forceOpen": false }, "BetterGifAltText": { "enabled": true }, "BetterNotesBox": { "enabled": true, "hide": false, "noSpellCheck": false }, "BetterRoleDot": { "enabled": true, "bothStyles": true, "copyRoleColorInProfilePopout": true }, "BetterUploadButton": { "enabled": true }, "BiggerStreamPreview": { "enabled": false }, "BlurNSFW": { "enabled": true, "blurAmount": 10 }, "CallTimer": { "enabled": true, "format": "human" }, "ClearURLs": { "enabled": true }, "ClientTheme": { "enabled": false }, "ColorSighted": { "enabled": false }, "ConsoleShortcuts": { "enabled": true }, "CopyUserURLs": { "enabled": true }, "CrashHandler": { "enabled": true, "attemptToPreventCrashes": true, "attemptToNavigateToHome": true }, "CustomRPC": { "enabled": false, "type": 1, "timestampMode": 1, "appID": "1", "appName": "Ur mom", "details": "Ur om", "state": "Ur mom", "streamLink": "https://youtube.com/urmom" }, "Dearrow": { "enabled": false }, "Decor": { "enabled": true }, "EmoteCloner": { "enabled": true }, "Experiments": { "enabled": true, "enableIsStaff": true }, "F8Break": { "enabled": true }, "FakeNitro": { "enabled": true, "enableEmojiBypass": true, "emojiSize": 512, "transformEmojis": true, "enableStickerBypass": true, "stickerSize": 512, "transformStickers": true, "transformCompoundSentence": true, "enableStreamQualityBypass": true, "hyperLinkText": "{{NAME}}", "useHyperLinks": true }, "FakeProfileThemes": { "enabled": true, "nitroFirst": true }, "FavoriteEmojiFirst": { "enabled": false }, "FavoriteGifSearch": { "enabled": false }, "FixImagesQuality": { "enabled": true }, "FixSpotifyEmbeds": { "enabled": true }, "ForceOwnerCrown": { "enabled": true }, "FriendInvites": { "enabled": true }, "GameActivityToggle": { "enabled": true, "oldIcon": false }, "GifPaste": { "enabled": false }, "GreetStickerPicker": { "enabled": false }, "HideAttachments": { "enabled": false }, "iLoveSpam": { "enabled": true }, "IgnoreActivities": { "enabled": false }, "ImageZoom": { "enabled": true, "size": 100, "zoom": 2.5, "nearestNeighbour": false, "square": false, "saveZoomValues": true, "zoomSpeed": 0.5, "invertScroll": true }, "InvisibleChat": { "enabled": false, "savedPasswords": "password" }, "KeepCurrentChannel": { "enabled": false }, "LastFMRichPresence": { "enabled": false }, "LoadingQuotes": { "enabled": true, "replaceEvents": true, "enableDiscordPresetQuotes": false, "additionalQuotes": "", "additionalQuotesDelimiter": "|", "enablePluginPresetQuotes": true }, "MemberCount": { "enabled": true, "memberList": true, "toolTip": true }, "MessageClickActions": { "enabled": false }, "MessageLinkEmbeds": { "enabled": true, "listMode": "blacklist", "idList": "", "automodEmbeds": "never" }, "MessageLogger": { "enabled": true, "deleteStyle": "overlay", "ignoreBots": false, "ignoreSelf": true, "ignoreUsers": "", "ignoreChannels": "", "ignoreGuilds": "", "logEdits": true, "logDeletes": true }, "MessageTags": { "enabled": true }, "MoreCommands": { "enabled": true }, "MoreKaomoji": { "enabled": false }, "MoreUserTags": { "enabled": true, "tagSettings": { "WEBHOOK": { "text": "Webhook", "showInChat": true, "showInNotChat": true }, "OWNER": { "text": "Owner", "showInChat": true, "showInNotChat": true }, "ADMINISTRATOR": { "text": "Admin", "showInChat": true, "showInNotChat": true }, "MODERATOR_STAFF": { "text": "Staff", "showInChat": true, "showInNotChat": true }, "MODERATOR": { "text": "Mod", "showInChat": true, "showInNotChat": true }, "VOICE_MODERATOR": { "text": "VC Mod", "showInChat": true, "showInNotChat": true }, "CHAT_MODERATOR": { "text": "Chat Mod", "showInChat": true, "showInNotChat": true } } }, "Moyai": { "enabled": true, "ignoreBots": true, "ignoreBlocked": true, "triggerWhenUnfocused": true, "quality": "HD", "volume": 0.5545774647887324 }, "MutualGroupDMs": { "enabled": true }, "NoBlockedMessages": { "enabled": false }, "NoDevtoolsWarning": { "enabled": true }, "NoF1": { "enabled": true }, "NoMosaic": { "enabled": true, "inlineVideo": true }, "NoPendingCount": { "enabled": false }, "NoProfileThemes": { "enabled": false }, "NoRPC": { "enabled": false }, "NoReplyMention": { "enabled": true, "userList": "1234567890123445,1234567890123445", "shouldPingListed": true, "inverseShiftReply": false }, "NoScreensharePreview": { "enabled": false }, "NoSystemBadge": { "enabled": true }, "NoTypingAnimation": { "enabled": false }, "NoUnblockToJump": { "enabled": false }, "NormalizeMessageLinks": { "enabled": false }, "NotificationVolume": { "enabled": true, "notificationVolume": 100 }, "NSFWGateBypass": { "enabled": true }, "OnePingPerDM": { "enabled": false }, "oneko": { "enabled": true, "customScript": "https://raw.githubusercontent.com/adryd325/oneko.js/8fa8a1864aa71cd7a794d58bc139e755e96a236c/oneko.js", "imageUrl": "https://raw.githubusercontent.com/adryd325/oneko.js/14bab15a755d0e35cd4ae19c931d96d306f99f42/oneko.gif" }, "OpenInApp": { "enabled": true, "spotify": true, "steam": true, "epic": true }, "PermissionFreeWill": { "enabled": true, "lockout": true, "onboarding": true }, "PermissionsViewer": { "enabled": true, "permissionsSortOrder": 1, "defaultPermissionsDropdownState": false }, "petpet": { "enabled": true }, "PictureInPicture": { "enabled": true }, "PinDMs": { "enabled": true, "pinnedDMs": "1020101529832783982,964267813604843611,1042925179979972641", "pinOrder": 0, "dmSectioncollapsed": false }, "PlainFolderIcon": { "enabled": true }, "PlatformIndicators": { "enabled": true, "colorMobileIndicator": true, "list": true, "badges": true, "messages": true }, "PreviewMessage": { "enabled": true }, "PronounDB": { "enabled": true, "pronounSource": 0, "showInProfile": true, "showSelf": true, "showInMessages": true, "pronounsFormat": "LOWERCASE" }, "QuickMention": { "enabled": true }, "QuickReply": { "enabled": true }, "ReactErrorDecoder": { "enabled": true }, "ReadAllNotificationsButton": { "enabled": true }, "RelationshipNotifier": { "enabled": true, "offlineRemovals": true, "groups": true, "servers": true, "friends": true, "friendRequestCancels": true, "notices": false }, "RevealAllSpoilers": { "enabled": false }, "ReverseImageSearch": { "enabled": true }, "RoleColorEverywhere": { "enabled": true, "chatMentions": true, "memberList": true, "voiceUsers": true }, "SearchReply": { "enabled": true }, "SecretRingToneEnabler": { "enabled": false }, "SendTimestamps": { "enabled": true, "replaceMessageContents": true }, "ServerListIndicators": { "enabled": true, "mode": 2 }, "ServerProfile": { "enabled": true }, "ShikiCodeblocks": { "enabled": true, "useDevIcon": "GREYSCALE", "theme": "https://raw.githubusercontent.com/shikijs/shiki/0b28ad8ccfbf2615f2d9d38ea8255416b8ac3043/packages/shiki/themes/dark-plus.json" }, "ShowAllMessageButtons": { "enabled": false }, "ShowConnections": { "enabled": true, "iconSpacing": 1, "iconSize": 32 }, "ShowHiddenChannels": { "enabled": true, "showMode": 1, "hideUnreads": true, "defaultAllowedUsersAndRolesDropdownState": true }, "ShowMeYourName": { "enabled": true, "mode": "user-nick", "displayNames": false, "inReplies": false }, "SilentMessageToggle": { "enabled": true, "persistState": false, "autoDisable": true }, "SilentTyping": { "enabled": true, "showIcon": true, "isEnabled": true }, "SortFriendRequests": { "enabled": true, "showDates": false }, "SpotifyControls": { "enabled": true, "hoverControls": false }, "SpotifyCrack": { "enabled": true, "noSpotifyAutoPause": true, "keepSpotifyActivityOnIdle": false }, "SpotifyShareCommands": { "enabled": true }, "StartupTimings": { "enabled": true }, "SuperReactionTweaks": { "enabled": true, "superReactByDefault": false, "unlimitedSuperReactionPlaying": false, "superReactionPlayingLimit": 20 }, "TextReplace": { "enabled": true }, "ThemeAttributes": { "enabled": true }, "TimeBarAllActivities": { "enabled": false }, "Translate": { "enabled": true, "autoTranslate": false, "receivedInput": "auto", "receivedOutput": "en", "sentInput": "auto", "sentOutput": "en", "showChatBarButton": true }, "TypingIndicator": { "enabled": true, "includeMutedChannels": true, "includeCurrentChannel": true, "indicatorMode": 3, "includeBlockedUsers": true }, "TypingTweaks": { "enabled": true, "alternativeFormatting": true, "showRoleColors": true, "showAvatars": true }, "Unindent": { "enabled": false }, "UnsuppressEmbeds": { "enabled": true }, "UrbanDictionary": { "enabled": true, "resultsAmount": 10 }, "UserVoiceShow": { "enabled": true, "showInUserProfileModal": true, "showVoiceChannelSectionHeader": true }, "USRBG": { "enabled": true, "voiceBackground": true, "nitroFirst": true }, "ValidUser": { "enabled": true }, "VoiceChatDoubleClick": { "enabled": false }, "VcNarrator": { "enabled": false }, "ViewIcons": { "enabled": true, "format": "webp", "imgSize": "1024" }, "ViewRaw": { "enabled": true, "clickMethod": "Left" }, "VoiceMessages": { "enabled": true }, "VolumeBooster": { "enabled": false }, "WhoReacted": { "enabled": true }, "Wikisearch": { "enabled": true }, "XSOverlay": { "enabled": true, "ignoreBots": false, "pingColor": "#7289da", "channelPingColor": "#8a2be2", "timeout": 1, "opacity": 1, "volume": 0.2, "soundPath": "default", "botNotifications": false }, "BetterGifPicker": { "enabled": true }, "FixCodeblockGap": { "enabled": true }, "ReviewDB": { "enabled": true, "notifyReviews": true, "reviewsDropdownState": true, "showWarning": true, "hideBlockedUsers": true, "hideTimestamps": false }, "FixYoutubeEmbeds": { "enabled": true }, "ChatInputButtonAPI": { "enabled": true }, "DisableCallIdle": { "enabled": true }, "NewGuildSettings": { "enabled": true, "guild": true, "everyone": true, "role": true, "showAllChannels": true }, "BetterRoleContext": { "enabled": true, "roleIconFileFormat": "png" }, "BetterSettings": { "enabled": true, "disableFade": true, "eagerLoad": true, "organizeMenu": true }, "FriendsSince": { "enabled": true }, "OverrideForumDefaults": { "enabled": true }, "ResurrectHome": { "enabled": true, "forceServerHome": false }, "WebRichPresence (arRPC)": { "enabled": true }, "WebContextMenus": { "enabled": true, "addBack": true }, "WebKeybinds": { "enabled": true }, "UnlockedAvatarZoom": { "enabled": false }, "ShowHiddenThings": { "enabled": true, "showTimeouts": true, "showInvitesPaused": true, "showModView": true, "disableDiscoveryFilters": true, "disableDisallowedDiscoveryFilters": true }, "BetterSessions": { "enabled": true, "backgroundCheck": true, "checkInterval": 20 }, "ImplicitRelationships": { "enabled": true, "sortByAffinity": true }, "StreamerModeOnStream": { "enabled": false }, "Theme Library": { "enabled": true }, "Zeon Theme Library": { "enabled": true }, "Zeon": { "enabled": true, "useCss": true, "useTheme": true, "GuildId": "00000000000", "ApiToken": "CHANGEME", "AIModel": "gemma-7b-it" }, "DevCompanion": { "enabled": true, "notifyOnAutoConnect": true }, "wakatime": { "enabled": true, "apiKey": "CHANGEME" }, "run_js": { "enabled": true }, "RunJS": { "enabled": true, "disableAll": false, "disableUrl": false }, "PartyMode": { "enabled": true, "superIntensePartyMode": 0 }, "TabApi": { "enabled": true }, "CustomUpload": { "enabled": false }, "Quoter": { "enabled": true }, "AutomodContext": { "enabled": true }, "cookieClicker": { "enabled": false }, "CtrlEnterSend": { "enabled": false }, "CustomIdle": { "enabled": false }, "ExportContacts": { "enabled": true }, "GlobalBadges": { "enabled": true, "showPrefix": true, "showCustom": true }, "HasteBin": { "enabled": true, "url": "https://bin.saahild.com" }, "hideChatButtons": { "enabled": true, "Open": false, "Color": false }, "ImageLink": { "enabled": false }, "MessageLoggerEnhanced": { "enabled": false, "ShowLogsButton": true, "autoCheckForUpdates": true, "imageCacheDir": "/home/neon/.var/app/com.discordapp.Discord/config/Vencord/MessageLoggerData/savedImages", "logsDir": "/home/neon/.var/app/com.discordapp.Discord/config/Vencord/MessageLoggerData" }, "MessageLatency": { "enabled": true, "latency": 2, "detectDiscordKotlin": true, "showMillis": true }, "Cute nekos": { "enabled": true }, "NoDefaultHangStatus": { "enabled": true }, "NoServerEmojis": { "enabled": false }, "PauseInvitesForever": { "enabled": false }, "ReplaceGoogleSearch": { "enabled": false }, "ReplyTimestamp": { "enabled": true }, "ShowTimeoutDuration": { "enabled": true }, "ValidReply": { "enabled": false }, "Timezone": { "enabled": true, "showProfileTime": true, "showMessageHeaderTime": true }, "KeywordNotify": { "enabled": false }, "VoiceDownload": { "enabled": true }, "ziplineImages": { "enabled": false }, "Party mode 🎉": { "enabled": true, "superIntensePartyMode": 0 }, "DontRoundMyTimestamps": { "enabled": false }, "MaskedLinkPaste": { "enabled": true }, "Summaries": { "enabled": true, "summaryExpiryThresholdDays": 3 }, "WatchTogetherAdblock": { "enabled": true }, "BetterQuickReact": { "enabled": false }, "ChineseWhispers": { "enabled": false, "intensity": 108, "shuffle": true }, "Demonstration": { "enabled": true, "keyBind": "F6", "soundVolume": 0.1 }, "GifRoulette": { "enabled": true, "pingOwnerChance": false }, "Glide": { "enabled": false, "customFont": "@import url('https://fonts.googleapis.com/css2?family=Poppins&wght@500&display=swap');", "serverListAnim": false, "memberListAnim": true, "privacyBlur": false, "tooltips": false, "animationSpeed": "0.2", "Accent": "313338", "Primary": "000000", "Text": "ffffff", "Brand": "ffffff" }, "GoogleThat": { "enabled": true, "defaultEngine": "google", "hyperlink": true }, "Grammar": { "enabled": true, "correctWords": true, "blockedWords": "" }, "Meow": { "enabled": true }, "ModViewBypass": { "enabled": true }, "NoBulletPoints": { "enabled": false }, "NoDefaultEmojis": { "enabled": false }, "Personify": { "enabled": false }, "RPCStats": { "enabled": true }, "utilityDock": { "enabled": true }, "FriendshipRanks": { "enabled": true }, "SuncordToolbox": { "enabled": true }, "VencordToolbox": { "enabled": true }, "Anammox": { "enabled": true, "dms": true, "billing": true, "gift": true, "emojiList": true }, "ColorMessage": { "enabled": false }, "CopyEmojiAsFormattedString": { "enabled": true }, "CopyUserMention": { "enabled": true }, "CustomAppIcons": { "enabled": true }, "DeadMembers": { "enabled": true }, "MessageLinkTooltip": { "enabled": true }, "ModalFade": { "enabled": true }, "Timezones": { "enabled": true, "preference": 1, "showTimezonesInProfile": true, "showTimezonesInChat": true }, "Title": { "enabled": true, "title": "Suncord" }, "AllCallTimers": { "enabled": true, "watchLargeGuilds": false, "showWithoutHover": true, "showRoleColor": true, "trackSelf": true, "showSeconds": true, "format": "human" }, "AmITyping": { "enabled": false }, "BetterShopPreview": { "enabled": true }, "BlockKrisp": { "enabled": false }, "CleanChannelName": { "enabled": false }, "CommandPalette": { "enabled": true, "hotkey": ["Control", "Shift", "P"] }, "CustomScreenShare": { "enabled": true }, "DeNitro": { "enabled": false }, "DiscordColorways": { "enabled": false }, "DoubleCounterVerifyBypass": { "enabled": true }, "EmojiDumper": { "enabled": false }, "GifCollection": { "enabled": false }, "GodMode": { "enabled": true }, "HideChatButtons": { "enabled": false }, "HideMessage": { "enabled": false }, "HolyNotes": { "enabled": true }, "IRememberYou": { "enabled": false }, "IgnoreTerms": { "enabled": true }, "MemberListActivities": { "enabled": true, "iconSize": 14.83274647887324, "renderGifs": true }, "NotifyUserChanges": { "enabled": true, "notifyStatus": true, "userIds": "", "notifyVoice": false }, "PlatformSpoofer": { "enabled": true, "platform": "web" }, "QuestCompleter": { "enabled": true }, "QuestionMarkReplacement": { "enabled": true }, "RepeatMessage": { "enabled": true }, "ReplyPingControl": { "enabled": true }, "RunInConsole": { "enabled": true }, "ScreenShareStreamerMode": { "enabled": true }, "ServerProfilesToolbox": { "enabled": true }, "ShowBadgesInChat": { "enabled": true, "showSuncordDonor": true, "showSuncordContributor": true, "showVencordDonor": true, "showVencordContributor": true, "showDiscordProfile": true, "showDiscordNitro": true, "VencordDonorPosition": 2, "VencordContributorPosition": 3, "DiscordProfilePosition": 4 }, "SmukiCommands": { "enabled": true, "profileCommand": true, "taxCommand": true }, "SoundBoardLogger": { "enabled": true, "IconLocation": "toolbar" }, "TalkInReverse": { "enabled": false }, "ThemeLibrary": { "enabled": false }, "UnlimitedAccounts": { "enabled": true }, "UserPFP": { "enabled": false }, "VoiceChatUtilities": { "enabled": true }, "WhosWatching": { "enabled": true }, "YoutubeDescription": { "enabled": true }
    },

    notifications: {
        timeout: 5000,
        position: "bottom-right",
        useNative: "not-focused",
        logLimit: 50,
    },

    cloud: {
        authenticated: false,
        url: "https://vencord.saahild.com/",
        settingsSync: true,
        settingsSyncVersion: 0,
    }
};

const settings = !IS_REPORTER ? VencordNative.settings.get() : {} as Settings;
mergeDefaults(settings, DefaultSettings);

const saveSettingsOnFrequentAction = debounce(async () => {
    if (Settings.cloud.settingsSync && Settings.cloud.authenticated) {
        await putCloudSettings();
        delete localStorage.Vencord_settingsDirty;
    }
}, 60_000);


export const SettingsStore = new SettingsStoreClass(settings, {
    readOnly: true,
    getDefaultValue({
        target,
        key,
        path
    }) {
        const v = target[key];
        if (!plugins) return v; // plugins not initialised yet. this means this path was reached by being called on the top level

        if (path === "plugins" && key in plugins)
            return target[key] = {
                enabled: IS_REPORTER ?? plugins[key].required ?? plugins[key].enabledByDefault ?? false
            };

        // Since the property is not set, check if this is a plugin's setting and if so, try to resolve
        // the default value.
        if (path.startsWith("plugins.")) {
            const plugin = path.slice("plugins.".length);
            if (plugin in plugins) {
                const setting = plugins[plugin].options?.[key];
                if (!setting) return v;

                if ("default" in setting)
                    // normal setting with a default value
                    return (target[key] = setting.default);

                if (setting.type === OptionType.SELECT) {
                    const def = setting.options.find(o => o.default);
                    if (def)
                        target[key] = def.value;
                    return def?.value;
                }
            }
        }
        return v;
    }
});

if (!IS_REPORTER) {
    SettingsStore.addGlobalChangeListener((_, path) => {
        SettingsStore.plain.cloud.settingsSyncVersion = Date.now();
        localStorage.Vencord_settingsDirty = true;
        saveSettingsOnFrequentAction();
        VencordNative.settings.set(SettingsStore.plain, path);
    });
}

/**
 * Same as {@link Settings} but unproxied. You should treat this as readonly,
 * as modifying properties on this will not save to disk or call settings
 * listeners.
 * WARNING: default values specified in plugin.options will not be ensured here. In other words,
 * settings for which you specified a default value may be uninitialised. If you need proper
 * handling for default values, use {@link Settings}
 */
export const PlainSettings = settings;
/**
 * A smart settings object. Altering props automagically saves
 * the updated settings to disk.
 * This recursively proxies objects. If you need the object non proxied, use {@link PlainSettings}
 */
export const Settings = SettingsStore.store;

/**
 * Settings hook for React components. Returns a smart settings
 * object that automagically triggers a rerender if any properties
 * are altered
 * @param paths An optional list of paths to whitelist for rerenders
 * @returns Settings
 */
// TODO: Representing paths as essentially "string[].join('.')" wont allow dots in paths, change to "paths?: string[][]" later
export function useSettings(paths?: UseSettings<Settings>[]) {
    const [, forceUpdate] = React.useReducer(() => ({}), {});

    React.useEffect(() => {
        if (paths) {
            paths.forEach(p => SettingsStore.addChangeListener(p, forceUpdate));
            return () => paths.forEach(p => SettingsStore.removeChangeListener(p, forceUpdate));
        } else {
            SettingsStore.addGlobalChangeListener(forceUpdate);
            return () => SettingsStore.removeGlobalChangeListener(forceUpdate);
        }
    }, []);

    return SettingsStore.store;
}

export function migratePluginSettings(name: string, ...oldNames: string[]) {
    const { plugins } = SettingsStore.plain;
    if (name in plugins) return;

    for (const oldName of oldNames) {
        if (oldName in plugins) {
            logger.info(`Migrating settings from old name ${oldName} to ${name}`);
            plugins[name] = plugins[oldName];
            delete plugins[oldName];
            SettingsStore.markAsChanged();
            break;
        }
    }
}

export function definePluginSettings<
    Def extends SettingsDefinition,
    Checks extends SettingsChecks<Def>,
    PrivateSettings extends object = {}
>(def: Def, checks?: Checks) {
    const definedSettings: DefinedSettings<Def, Checks, PrivateSettings> = {
        get store() {
            if (!definedSettings.pluginName) throw new Error("Cannot access settings before plugin is initialized");
            return Settings.plugins[definedSettings.pluginName] as any;
        },
        use: settings => useSettings(
            settings?.map(name => `plugins.${definedSettings.pluginName}.${name}`) as UseSettings<Settings>[]
        ).plugins[definedSettings.pluginName] as any,
        def,
        checks: checks ?? {} as any,
        pluginName: "",

        withPrivateSettings<T extends object>() {
            return this as DefinedSettings<Def, Checks, T>;
        }
    };

    return definedSettings;
}

type UseSettings<T extends object> = ResolveUseSettings<T>[keyof T];

type ResolveUseSettings<T extends object> = {
    [Key in keyof T]:
    Key extends string
    ? T[Key] extends Record<string, unknown>
    // @ts-ignore "Type instantiation is excessively deep and possibly infinite"
    ? UseSettings<T[Key]> extends string ? `${Key}.${UseSettings<T[Key]>}` : never
    : Key
    : never;
};
