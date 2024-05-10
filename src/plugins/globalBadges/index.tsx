/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { addBadge, BadgePosition, ProfileBadge, removeBadge } from "@api/Badges";
import definePlugin, { OptionType } from "@utils/types";
import { React, Tooltip } from "@webpack/common";
import { User } from "discord-types/general";

type CustomBadge = string | {
    name: string;
    badge: string;
    custom?: boolean;
};

interface BadgeCache {
    badges: { [mod: string]: CustomBadge[]; };
    expires: number;
}

const API_URL = "https://clientmodbadges-api.herokuapp.com/";

const cache = new Map<string, BadgeCache>();
const EXPIRES = 1000 * 60 * 15;

const fetchBadges = (id: string): BadgeCache["badges"] | undefined => {
    const cachedValue = cache.get(id);
    if (!cache.has(id) || (cachedValue && cachedValue.expires < Date.now())) {
        fetch(`${API_URL}users/${id}`)
            .then(res => res.json() as Promise<BadgeCache["badges"]>)
            .then(body => {
                cache.set(id, { badges: body, expires: Date.now() + EXPIRES });
                return body;
            });
    } else if (cachedValue) {
        return cachedValue.badges;
    }
};

const BadgeComponent = ({ name, img }: { name: string, img: string; }) => {
    return (
        <Tooltip text={name} >
            {(tooltipProps: any) => (
                <img
                    {...tooltipProps}
                    src={img}
                    style={{ width: "22px", height: "22px", transform: name.includes("Replugged") ? "scale(0.9)" : null, margin: "0 2px" }}
                />
            )}
        </Tooltip>
    );
};

const GlobalBadges = ({ user }: { user: User; }) => {
    const [badges, setBadges] = React.useState<BadgeCache["badges"]>({});
    React.useEffect(() => setBadges(fetchBadges(user.id) ?? {}), [user.id]);

    if (!badges) return null;
    const globalBadges: JSX.Element[] = [];

    Object.keys(badges).forEach(mod => {
        if (mod.toLowerCase() === "vencord") return;
        badges[mod].forEach(badge => {
            if (typeof badge === "string") {
                const fullNames = { "hunter": "Bug Hunter", "early": "Early User" };
                badge = {
                    name: fullNames[badge as string] ? fullNames[badge as string] : badge,
                    badge: `${API_URL}badges/${mod}/${(badge as string).replace(mod, "").trim().split(" ")[0]}`
                };
            } else if (typeof badge === "object") badge.custom = true;
            if (!showCustom() && badge.custom) return;
            const cleanName = badge.name.replace(mod, "").trim();
            const prefix = showPrefix() ? mod : "";
            if (!badge.custom) badge.name = `${prefix} ${cleanName.charAt(0).toUpperCase() + cleanName.slice(1)}`;
            globalBadges.push(<BadgeComponent name={badge.name} img={badge.badge} />);
        });
    });

    return (
        <div className="vc-global-badges" style={{ alignItems: "center", display: "flex" }}>
            {globalBadges}
        </div>
    );
};

const Badge: ProfileBadge = {
    component: b => <GlobalBadges {...b} />,
    position: BadgePosition.START,
    shouldShow: userInfo => !!Object.keys(fetchBadges(userInfo.user.id) ?? {}).length,
    key: "GlobalBadges"
};

const showPrefix = () => Vencord.Settings.plugins.GlobalBadges.showPrefix;
const showCustom = () => Vencord.Settings.plugins.GlobalBadges.showCustom;

export default definePlugin({
    name: "GlobalBadges",
    description: "Adds global badges from other client mods",
    authors: [{ name: "HypedDomi", id: 354191516979429376n }],

    start: () => addBadge(Badge),
    stop: () => removeBadge(Badge),

    options: {
        showPrefix: {
            type: OptionType.BOOLEAN,
            description: "Shows the Mod as Prefix",
            default: true,
            restartNeeded: false
        },
        showCustom: {
            type: OptionType.BOOLEAN,
            description: "Show Custom Badges",
            default: true,
            restartNeeded: false
        }
    }
});
