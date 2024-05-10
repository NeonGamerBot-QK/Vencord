/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { addChatBarButton, ChatBarButton, removeChatBarButton } from "@api/ChatButtons";
import { addButton, removeButton } from "@api/MessagePopover";
import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import { insertTextIntoChatInputBox } from "@utils/discord";
import { copyWithToast } from "@utils/misc";
import definePlugin, { OptionType } from "@utils/types";
import { ChannelStore, DraftStore, DraftType, SelectedChannelStore, useStateFromStores } from "@webpack/common";


const UploadIcon = () => {
    return <svg viewBox="0 0 512 512" fill="currentColor" aria-hidden="true" width="18" height="18">
        <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm65.2 216H224v80c0 8.8-7.2 16-16 16h-32c-8.8 0-16-7.2-16-16v-80H94.8c-14.3 0-21.4-17.3-11.3-27.4l96.4-95.7c6.7-6.6 17.4-6.6 24 0l96.4 95.7c10.2 10.1 3 27.4-11.3 27.4zM377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z" />
    </svg>;
};

// function sortObject<T extends object>(obj: T): T {
//     return Object.fromEntries(Object.entries(obj).sort(([k1], [k2]) => k1.localeCompare(k2))) as T;
// }

// function cleanMessage(msg: Message) {
//     const clone = sortObject(JSON.parse(JSON.stringify(msg)));
//     for (const key of [
//         "email",
//         "phone",
//         "mfaEnabled",
//         "personalConnectionId"
//     ]) delete clone.author[key];

//     // message logger added properties
//     const cloneAny = clone as any;
//     delete cloneAny.editHistory;
//     delete cloneAny.deleted;
//     cloneAny.attachments?.forEach(a => delete a.deleted);

//     return clone;
// }

// function openViewRawModal(json: string, type: string, msgContent?: string) {
//     const key = openModal(props => (
//         <ErrorBoundary>
//             <ModalRoot {...props} size={ModalSize.LARGE}>
//                 <ModalHeader>
//                     <Text variant="heading-lg/semibold" style={{ flexGrow: 1 }}>View Raw</Text>
//                     <ModalCloseButton onClick={() => closeModal(key)} />
//                 </ModalHeader>
//                 <ModalContent>
//                     <div style={{ padding: "16px 0" }}>
//                         {!!msgContent && (
//                             <>
//                                 <Forms.FormTitle tag="h5">Content</Forms.FormTitle>
//                                 <CodeBlock content={msgContent} lang="" />
//                                 <Forms.FormDivider className={Margins.bottom20} />
//                             </>
//                         )}

//                         <Forms.FormTitle tag="h5">{type} Data</Forms.FormTitle>
//                         <CodeBlock content={json} lang="json" />
//                     </div>
//                 </ModalContent >
//                 <ModalFooter>
//                     <Flex cellSpacing={10}>
//                         <Button onClick={() => copyWithToast(json, `${type} data copied to clipboard!`)}>
//                             Copy {type} JSON
//                         </Button>
//                         {!!msgContent && (
//                             <Button onClick={() => copyWithToast(msgContent, "Content copied to clipboard!")}>
//                                 Copy Raw Content
//                             </Button>
//                         )}
//                     </Flex>
//                 </ModalFooter>
//             </ModalRoot >
//         </ErrorBoundary >
//     ));
// }

// function openViewRawModalMessage(msg: Message) {
//     msg = cleanMessage(msg);
//     const msgJson = JSON.stringify(msg, null, 4);

//     return openViewRawModal(msgJson, "Message", msg.content);
// }

const settings = definePluginSettings({
    url: {
        description: "Pastebin url",
        type: OptionType.STRING,
        default: "https://bin.saahild.com"
    }
});

// function MakeContextCallback(name: "Guild" | "User" | "Channel"): NavContextMenuPatchCallback {
//     return (children, props) => {
//         const value = props[name.toLowerCase()];
//         if (!value) return;
//         if (props.label === i18n.Messages.CHANNEL_ACTIONS_MENU_LABEL) return; // random shit like notification settings

//         const lastChild = children.at(-1);
//         if (lastChild?.key === "developer-actions") {
//             const p = lastChild.props;
//             if (!Array.isArray(p.children))
//                 p.children = [p.children];

//             children = p.children;
//         }

//         children.splice(-1, 0,
//             <Menu.MenuItem
//                 id={`vc-view-${name.toLowerCase()}-raw`}
//                 label="View Raw"
//                 action={() => openViewRawModal(JSON.stringify(value, null, 4), name)}
//                 icon={CopyIcon}
//             />
//         );
//     };
// }
const getDraft = (channelId: string) => DraftStore.getDraft(channelId, DraftType.ChannelMessage);
const ChatBarIcon: ChatBarButton = ({ isMainChat, isEmpty }) => {
    const channelId = SelectedChannelStore.getChannelId();
    const draft = useStateFromStores([DraftStore], () => getDraft(channelId));
    if (!isMainChat || isEmpty) return null;

    return (
        <ChatBarButton
            tooltip="Upload to hastebin"
            onClick={() => {
                const content = getDraft(channelId);
                fetch(settings.store.url + "/documents", {
                    method: "POST",
                    body: content,
                    headers: {
                        "Content-Type": "text/plain"
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        // console.log(data);
                        insertTextIntoChatInputBox(settings.store.url + "/" + data.key);
                        // copyWithToast(settings.store.url + "/" + data.key, "Copied URL");
                    })
                    .catch(console.error);
            }}
        // buttonProps={{ "aria-haspopup": "dialog" }}
        >
            <UploadIcon />
        </ChatBarButton>
    );
};
export default definePlugin({
    name: "HasteBin",
    description: "hastebin upload buddy",
    authors: [Devs.Neon],
    dependencies: ["MessagePopoverAPI"],
    settings,
    // contextMenus: {
    //     "guild-context": MakeContextCallback("Guild"),
    //     "channel-context": MakeContextCallback("Channel"),
    //     "user-context": MakeContextCallback("User")
    // },

    start() {
        addChatBarButton("UploadToHastebin", ChatBarIcon);
        addButton("HSB", msg => {
            const handleClick = () => {
                // alert("clicked");
                fetch(settings.store.url + "/documents", {
                    method: "POST",
                    body: msg.content,
                    headers: {
                        "Content-Type": "text/plain"
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data);
                        copyWithToast(settings.store.url + "/" + data.key, "Copied URL");
                    })
                    .catch(console.error);
            };

            const handleContextMenu = e => {
                // if (settings.store.clickMethod === "Left") {
                //     e.preventDefault();
                //     e.stopPropagation();
                //     copyWithToast(msg.content);
                // } else {
                //     e.preventDefault();
                //     e.stopPropagation();
                //     openViewRawModalMessage(msg);
                // }
            };

            const label = "Upload to bin";

            return {
                label,
                icon: UploadIcon,
                message: msg,
                channel: ChannelStore.getChannel(msg.channel_id),
                onClick: handleClick,
                onContextMenu: handleContextMenu
            };
        });
    },

    stop() {
        removeChatBarButton("UploadToHastebin");
        removeButton("HSB");
    }
});
