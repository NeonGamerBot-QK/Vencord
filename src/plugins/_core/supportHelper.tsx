/*
 * Vencord, a Discord client mod
 * Zeons edition
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import ErrorBoundary from "@components/ErrorBoundary";
import { Link } from "@components/Link";
import { openUpdaterModal } from "@components/VencordSettings/UpdaterTab";
import { Devs, SUPPORT_CHANNEL_ID } from "@utils/constants";
import { insertTextIntoChatInputBox } from "@utils/discord";
import { Margins } from "@utils/margins";
import { isPluginDev } from "@utils/misc";
import { relaunch } from "@utils/native";
import definePlugin from "@utils/types";
import { isOutdated, update } from "@utils/updater";
import { Alerts, Card, ChannelStore, DraftType, Forms, GuildMemberStore, NavigationRouter, Parser, PermissionsBits, PermissionStore, RelationshipStore, UploadHandler, UploadManager, UserStore } from "@webpack/common";

import gitHash from "~git-hash";
import plugins from "~plugins";

import settings from "./settings";

const VENCORD_GUILD_ID = "1015060230222131221";

const AllowedChannelIds = [
    SUPPORT_CHANNEL_ID,
    "1179990006140514304", // zeon priv channel
    "1024286218801926184", // Vencord > #bot-spam
    "1033680203433660458", // Vencord > #v
];

const TrustedRolesIds = [
    "1026534353167208489", // contributor
    "1026504932959977532", // regular
    "1042507929485586532", // donor
];
function hasPermission(channelId: string, permission: bigint) {
    const channel = ChannelStore.getChannel(channelId);

    if (!channel || channel.isPrivate()) return true;

    return PermissionStore.can(permission, channel);
}
const hasAttachmentPerms = (channelId: string) => hasPermission(channelId, PermissionsBits.ATTACH_FILES);

export default definePlugin({
    name: "SupportHelper",
    required: true,
    description: "Helps us provide support to you",
    authors: [Devs.Ven, Devs.Neon],
    dependencies: ["CommandsAPI"],

    patches: [{
        find: ".BEGINNING_DM.format",
        replacement: {
            match: /BEGINNING_DM\.format\(\{.+?\}\),(?=.{0,100}userId:(\i\.getRecipientId\(\)))/,
            replace: "$& $self.ContributorDmWarningCard({ userId: $1 }),"
        }
    }],

    commands: [{
        name: "vencord-debug",
        description: "Send Vencord Debug info",
        predicate: ctx => AllowedChannelIds.includes(ctx.channel.id),
        async execute(ops, cmdCtx) {
            UploadManager.clearAll(cmdCtx.channel.id, DraftType.SlashCommand);
            const { RELEASE_CHANNEL } = window.GLOBAL_ENV;
            // clear everything cuz ts aint working
            UploadManager.clearAll(cmdCtx.channel.id, DraftType.ChannelMessage);
            UploadManager.clearAll(cmdCtx.channel.id, DraftType.ApplicationLauncherCommand);
            UploadManager.clearAll(cmdCtx.channel.id, DraftType.FirstThreadMessage);
            UploadManager.clearAll(cmdCtx.channel.id, DraftType.Poll);
            UploadManager.clearAll(cmdCtx.channel.id, DraftType.ThreadSettings);
            await UploadManager.clearAll(cmdCtx.channel.id, DraftType.SlashCommand);

            const client = (() => {
                if (IS_DISCORD_DESKTOP) return `Discord Desktop v${DiscordNative.app.getVersion()}`;
                if (IS_VESKTOP) return `Vesktop v${VesktopNative.app.getVersion()}`;
                if ("armcord" in window) return `ArmCord v${window.armcord.version}`;
                // @ts-expect-error
                const name = typeof unsafeWindow !== "undefined" ? "UserScript" : "Web";
                return `${name} (${navigator.userAgent})`;
            })();

            const isApiPlugin = (plugin: string) => plugin.endsWith("API") || plugins[plugin].required;

            const enabledPlugins = Object.keys(plugins).filter(p => Vencord.Plugins.isPluginEnabled(p) && !isApiPlugin(p));

            const info = {
                Vencord:
                    `v${VERSION} • [${gitHash}](<https://github.com/NeonGamerBot-QK/Vencord/commit/${gitHash}>)` +
                    `${settings.additionalInfo} - ${Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(BUILD_TIMESTAMP)}`,
                Client: `${RELEASE_CHANNEL} ~ ${client}`,
                Platform: window.navigator.platform
            };

            if (IS_DISCORD_DESKTOP) {
                info["Last Crash Reason"] = (await DiscordNative.processUtils.getLastCrash())?.rendererCrashReason ?? "N/A";
            }

            const debugInfo = `
            ## NOTICE: THIS IS A COMPLETE FORK OF VENCORD!!! ##
${Object.entries(info).map(([k, v]) => `**${k}**: ${v}`).join("\n")}

Enabled Plugins (${enabledPlugins.length}):
${enabledPlugins.join(", ")}
`;
            if (hasAttachmentPerms(cmdCtx.channel.id)) {
                const file = new File([debugInfo], "debug.txt", { type: "text/plain" });
                UploadManager.clearAll(cmdCtx.channel.id, DraftType.ChannelMessage);
                setTimeout(() => {
                    UploadManager.clearAll(cmdCtx.channel.id, DraftType.SlashCommand);
                    UploadHandler.promptToUpload([file], cmdCtx.channel, DraftType.ChannelMessage);
                }, 1000);
            } else if (debugInfo.length > 2000) {
                fetch("https://bin.saahild.com/documents", {
                    method: "POST",
                    body: debugInfo,
                    headers: {
                        "Content-Type": "text/plain"
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        // console.log(data);
                        insertTextIntoChatInputBox("https://bin.saahild.com/" + data.key);
                        // copyWithToast(settings.store.url + "/" + data.key, "Copied URL");
                    })
                    .catch(console.error);
            } else {
                return {
                    content: debugInfo.trim().replaceAll("```\n", "```")
                };
            }

        }
    }],

    flux: {
        async CHANNEL_SELECT({ channelId }) {
            if (channelId !== SUPPORT_CHANNEL_ID) return;

            const selfId = UserStore.getCurrentUser()?.id;
            if (!selfId || isPluginDev(selfId)) return;

            if (isOutdated) {
                return Alerts.show({
                    title: "Hold on!",
                    body: <div>
                        <Forms.FormText>You are using an outdated version of Vencord! Chances are, your issue is already fixed.</Forms.FormText>
                        <Forms.FormText className={Margins.top8}>
                            Please first update before asking for support!
                        </Forms.FormText>
                    </div>,
                    onCancel: () => openUpdaterModal!(),
                    cancelText: "View Updates",
                    confirmText: "Update & Restart Now",
                    async onConfirm() {
                        await update();
                        relaunch();
                    },
                    secondaryConfirmText: "I know what I'm doing or I can't update"
                });
            }

            // @ts-ignore outdated type
            const roles = GuildMemberStore.getSelfMember(VENCORD_GUILD_ID)?.roles;
            if (!roles || TrustedRolesIds.some(id => roles.includes(id))) return;

            if (!IS_WEB && IS_UPDATER_DISABLED) {
                return Alerts.show({
                    title: "Hold on!",
                    body: <div>
                        <Forms.FormText>You are using an externally updated Vencord version, which we do not provide support for!</Forms.FormText>
                        <Forms.FormText className={Margins.top8}>
                            Please either switch to an <Link href="https://vencord.dev/download">officially supported version of Vencord</Link>, or
                            contact your package maintainer for support instead.
                        </Forms.FormText>
                    </div>,
                    onCloseCallback: () => setTimeout(() => NavigationRouter.back(), 50)
                });
            }

            const repo = await VencordNative.updater.getRepo();
            if (repo.ok && !repo.value.includes("Vendicated/Vencord")) {
                return Alerts.show({
                    title: "Hold on!",
                    body: <div>
                        <Forms.FormText>You are using a fork of Vencord, which we do not provide support for!</Forms.FormText>
                        <Forms.FormText className={Margins.top8}>
                            Please either switch to an <Link href="https://vencord.dev/download">officially supported version of Vencord</Link>, or
                            contact your package maintainer for support instead.
                        </Forms.FormText>
                    </div>,
                    onCloseCallback: () => setTimeout(() => NavigationRouter.back(), 50)
                });
            }
        }
    },

    ContributorDmWarningCard: ErrorBoundary.wrap(({ userId }) => {
        if (!isPluginDev(userId)) return null;
        if (RelationshipStore.isFriend(userId)) return null;

        return (
            <Card className={`vc-plugins-restart-card ${Margins.top8}`}>
                Please do not private message Vencord plugin developers for support!
                <br />
                Instead, use the Vencord support channel: {Parser.parse("https://discord.com/channels/1015060230222131221/1026515880080842772")}
                {!ChannelStore.getChannel(SUPPORT_CHANNEL_ID) && " (Click the link to join)"}
            </Card>
        );
    }, { noop: true })
});
