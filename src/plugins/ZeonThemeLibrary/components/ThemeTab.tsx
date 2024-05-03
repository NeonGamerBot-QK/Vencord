import { FluxDispatcher, Button, TabBar, UserStore, Card, Forms, useEffect, useState, UserUtils, React, Select, TextInput, TextArea, Toasts, showToast } from "@webpack/common";
import { SettingsTab, wrapTab } from "@components/VencordSettings/shared";
import { findByPropsLazy, findLazy } from "@webpack";
import { CodeBlock } from "@components/CodeBlock";
import { classNameFactory } from "@api/Styles";
import { User } from "discord-types/general";
import { generateId } from "@api/Commands";
import { openModal } from "@utils/modal";
import { Margins } from "@utils/margins";
import { proxyLazy } from "@utils/lazy";
import { Constructor } from "type-fest";
import { classes } from "@utils/misc";

import { Theme, SearchStatus, TabItem } from "../types";
import { ThemeInfoModal } from "./ThemeInfoModal";
import "./styles.css";

const cl = classNameFactory("vc-plugins-");
const InputStyles = findByPropsLazy("inputDefault", "inputWrapper");
const UserRecord: Constructor<Partial<User>> = proxyLazy(() => UserStore.getCurrentUser().constructor) as any;
const TextAreaProps = findLazy(m => typeof m.textarea === "string");

const API_URL = "https://raw.githubusercontent.com/NeonGamerBot-QK/Vencord-themes/main/manifest.json";

async function themeRequest(path: string, options: RequestInit = {}) {
    console.error('zeon - themeRequest', path, options)
    return fetch(API_URL, {
        ...options,
        headers: {
            ...options.headers,
        }
    }).then(r => r.json()).then(data => {
        return path === "SEARCH_THEMES" ? data :data.find(x => {
            return x.name == path 
        })
    });
}

function makeDummyUser(user: { username: string; id?: string; avatar?: string; }) {
    const newUser = new UserRecord({
        username: "Zeon" || user.username,
        id:  "778062673626660875" || (user.id ?? generateId()),
        //avatar: "https://cdn.discordapp.com/avatars/778062673626660875/bc1acc2f3144088b9502d556122c2add.png",
        bot: true,
    });
    FluxDispatcher.dispatch({
        type: "USER_UPDATE",
        user: newUser,
    });
    return newUser;
}

const themeTemplate = `/**
* @name [Theme name]
* @author [Your name]
* @description [Your Theme Description]
* @version [Your Theme Version]
* @donate [Optionally, your Donation Link]
* @tags [Optionally, tags that apply to your theme]
* @invite [Optionally, your Support Server Invite]
* @source [Optionally, your source code link]
*/

/* Your CSS goes here */
`;

function ThemeTab() {
    const [themes, setThemes] = useState<Theme[]>([]);
    const [filteredThemes, setFilteredThemes] = useState<Theme[]>([]);
    const [themeLinks, setThemeLinks] = useState(Vencord.Settings.themeLinks);
    const [searchValue, setSearchValue] = useState({ value: "", status: SearchStatus.ALL });
    const [loading, setLoading] = useState(true);

    const getUser = (id: string, username: string) => UserUtils.getUser(id) ?? makeDummyUser({ username, id });
    const onSearch = (query: string) => setSearchValue(prev => ({ ...prev, value: query }));
    const onStatusChange = (status: SearchStatus) => setSearchValue(prev => ({ ...prev, status }));

    const themeFilter = (theme: Theme) => {
        const enabled = themeLinks.includes("https://raw.githubusercontent.com/NeonGamerBot-QK/Vencord-themes/main/" + theme.path);
        if (enabled && searchValue.status === SearchStatus.DISABLED) return false;
        // if (!theme.tags.includes("dark") && searchValue.status === SearchStatus.DARK) return false;
        // if (!theme.tags.includes("light") && searchValue.status === SearchStatus.LIGHT) return false;
        if (!enabled && searchValue.status === SearchStatus.ENABLED) return false;
        if (!searchValue.value.length) return true;

        const v = searchValue.value.toLowerCase();
        return (
            theme.name.toLowerCase().includes(v) ||
            theme.description?.toLowerCase().includes(v) ||
            theme.tags?.some(t => t.toLowerCase().includes(v))
        );
    };

    useEffect(() => {
        themeRequest("SEARCH_THEMES", {
            method: "GET",
        }).then(async (data) => {
            //const data = await response.json();
            const themes: Theme[] = Object.values(data);
            // themes .sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
            setThemes(themes);
            setFilteredThemes(themes);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        setThemeLinks(Vencord.Settings.themeLinks);
    }, [Vencord.Settings.themeLinks]);

    useEffect(() => {
        const filteredThemes = themes.filter(themeFilter);
        setFilteredThemes(filteredThemes);
    }, [searchValue]);

    return (
        <div>
            <>
                {loading ? (
                    <div
                        className={Margins.top20}
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            fontSize: "1.5em",
                            color: "var(--text-muted)"
                        }}>Loading Themes...</div>
                ) : (<>
                    <div className={`${Margins.bottom8} ${Margins.top16}`}>
                        <Forms.FormTitle tag="h2"
                            style={{
                                overflowWrap: "break-word",
                                marginTop: 8,
                            }}>
                            Newest Additions
                        </Forms.FormTitle>

                        {themes.slice(0, 2).map((theme: Theme, index:number) => (
                            <Card style={{
                                padding: ".5rem",
                                marginBottom: ".5em",
                                marginTop: ".5em",
                                display: "flex",
                                flexDirection: "column",
                                backgroundColor: "var(--background-secondary-alt)"
                            }} key={index}>
                                <Forms.FormTitle tag="h2" style={{
                                    overflowWrap: "break-word",
                                    marginTop: 8,
                                }}
                                    className="vce-theme-text">
                                    {theme.name}
                                </Forms.FormTitle>
                                <Forms.FormText className="vce-theme-text">
                                    {theme.description}
                                </Forms.FormText>
                                <div className="vce-theme-info">
                                    <div style={{
                                        justifyContent: "flex-start",
                                        flexDirection: "column"
                                    }}>
                                        {theme.tags && (
                                            <Forms.FormText>
                                                {theme.tags.map(tag => (
                                                    <span className="vce-theme-info-tag">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </Forms.FormText>
                                        )}
                                        <div style={{ marginTop: "8px", display: "flex", flexDirection: "row" }}>
                                            {themeLinks.includes("https://raw.githubusercontent.com/NeonGamerBot-QK/Vencord-themes/main/" + theme.path) ? (
                                                <Button
                                                    onClick={() => {
                                                        const onlineThemeLinks = themeLinks.filter(x => x !== "https://raw.githubusercontent.com/NeonGamerBot-QK/Vencord-themes/main/" + theme.path);
                                                        setThemeLinks(onlineThemeLinks);
                                                        Vencord.Settings.themeLinks = onlineThemeLinks;
                                                    }}
                                                    size={Button.Sizes.MEDIUM}
                                                    color={Button.Colors.RED}
                                                    look={Button.Looks.FILLED}
                                                    className={Margins.right8}
                                                >
                                                    Remove Theme
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={() => {
                                                        const onlineThemeLinks = [...themeLinks, `https://raw.githubusercontent.com/NeonGamerBot-QK/Vencord-themes/main/${theme.path}`];
                                                        setThemeLinks(onlineThemeLinks);
                                                        Vencord.Settings.themeLinks = onlineThemeLinks;
                                                    }}
                                                    size={Button.Sizes.MEDIUM}
                                                    color={Button.Colors.GREEN}
                                                    look={Button.Looks.FILLED}
                                                    className={Margins.right8}
                                                >
                                                    Add Theme
                                                </Button>
                                            )}
                                            <Button
                                                onClick={async () => {
                                                    const author =await getUser(theme.authorId,"erm");
                                                    openModal(props => <ThemeInfoModal {...props} author={author} theme={theme} />);
                                                }}
                                                size={Button.Sizes.MEDIUM}
                                                color={Button.Colors.BRAND}
                                                look={Button.Looks.FILLED}
                                            >
                                                Theme Info
                                            </Button>
                                            <Button
                                                onClick={() => VencordNative.native.openExternal(`https://github.com/NeonGamerBot-QK/Vencord-themes/blob/main/${theme.path}`)}
                                                size={Button.Sizes.MEDIUM}
                                                color={Button.Colors.LINK}
                                                look={Button.Looks.LINK}
                                            >
                                                View Source
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                    <Forms.FormTitle tag="h2" style={{
                        overflowWrap: "break-word",
                        marginTop: 20,
                    }}>
                        Themes
                    </Forms.FormTitle>
                    <div className={cl("filter-controls")}>
                        <TextInput value={searchValue.value} placeholder="Search for a theme..." onChange={onSearch} />
                        <div className={InputStyles.inputWrapper}>
                            <Select
                                options={[
                                    { label: "Show All", value: SearchStatus.ALL, default: true },
                                    { label: "Show Enabled", value: SearchStatus.ENABLED },
                                    { label: "Show Disabled", value: SearchStatus.DISABLED },
                                ]}
                                serialize={String}
                                select={onStatusChange}
                                isSelected={v => v === searchValue.status}
                                closeOnSelect={true}
                            />
                        </div>
                    </div>
                    <div>
                        {filteredThemes.map((theme: Theme, index: number) => (
                            <Card style={{
                                padding: ".5rem",
                                marginBottom: ".5em",
                                marginTop: ".5em",
                                display: "flex",
                                flexDirection: "column",
                                backgroundColor: "var(--background-secondary-alt)"
                            }} key={index}>
                                <Forms.FormTitle tag="h2" style={{
                                    overflowWrap: "break-word",
                                    marginTop: 8,
                                }}
                                    className="vce-theme-text">
                                    {theme.name}
                                </Forms.FormTitle>
                                <Forms.FormText className="vce-theme-text">
                                    {theme.description}
                                </Forms.FormText>
                                {theme.thumbnail_type? <img
                                    role="presentation"
                                    src={theme.thumbnail_type == 'path' ? 'https://raw.githubusercontent.com/NeonGamerBot-QK/Vencord-themes/main/'+ theme.thumbnailPath: theme.thumbnailPath}
                                    alt="Theme Preview Image"
                                    className="vce-theme-info-preview"
                                /> : null }
                                <div className="vce-theme-info">
                                    <div style={{
                                        justifyContent: "flex-start",
                                        flexDirection: "column"
                                    }}>
                                        {theme.tags && (
                                            <Forms.FormText>
                                                {theme.tags.map(tag => (
                                                    <span className="vce-theme-info-tag">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </Forms.FormText>
                                        )}
                                        <div style={{ marginTop: "8px", display: "flex", flexDirection: "row" }}>
                                            {themeLinks.includes("https://raw.githubusercontent.com/NeonGamerBot-QK/Vencord-themes/main/" + theme.name) ? (
                                                <Button
                                                    onClick={() => {
                                                        const onlineThemeLinks = themeLinks.filter(x => x !== "https://raw.githubusercontent.com/NeonGamerBot-QK/Vencord-themes/main/" + theme.name);
                                                        setThemeLinks(onlineThemeLinks);
                                                        Vencord.Settings.themeLinks = onlineThemeLinks;
                                                    }}
                                                    size={Button.Sizes.MEDIUM}
                                                    color={Button.Colors.RED}
                                                    look={Button.Looks.FILLED}
                                                    className={Margins.right8}
                                                >
                                                    Remove Theme
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={() => {
                                                        const onlineThemeLinks = [...themeLinks, `https://raw.githubusercontent.com/NeonGamerBot-QK/Vencord-themes/main/${theme.path}`];
                                                        setThemeLinks(onlineThemeLinks);
                                                        Vencord.Settings.themeLinks = onlineThemeLinks;
                                                    }}
                                                    size={Button.Sizes.MEDIUM}
                                                    color={Button.Colors.GREEN}
                                                    look={Button.Looks.FILLED}
                                                    className={Margins.right8}
                                                >
                                                    Add Theme
                                                </Button>
                                            )}
                                            <Button
                                                onClick={async () => {
                                                    const author = await getUser(theme.authorId,"erm");
                                                    openModal(props => <ThemeInfoModal {...props} author={author} theme={theme} />);
                                                }}
                                                size={Button.Sizes.MEDIUM}
                                                color={Button.Colors.BRAND}
                                                look={Button.Looks.FILLED}
                                            >
                                                Theme Info
                                            </Button>
                                            <Button
                                                onClick={() => VencordNative.native.openExternal(`https://github.com/NeonGamerBot-QK/Vencord-themes/blob/main/${theme.path}`)}
                                                size={Button.Sizes.MEDIUM}
                                                color={Button.Colors.LINK}
                                                look={Button.Looks.LINK}
                                            >
                                                View Source
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </>)}
            </>
        </div >
    );
};

function SubmitThemes() {
    const currentUser = UserStore.getCurrentUser();
    const [themeContent, setContent] = useState("");

    const handleChange = (v: string) => setContent(v);

    return (
        <div className={`${Margins.bottom8} ${Margins.top16}`}>
            <Forms.FormTitle tag="h2" style={{
                overflowWrap: "break-word",
                marginTop: 8,
            }}>
                Theme Guidelines
            </Forms.FormTitle>
            <Forms.FormText>
                Follow the formatting for your CSS to get credit for your theme. You can find the template below.
            </Forms.FormText>
            <Forms.FormText>
                (your theme will be reviewed and can take up to 24 hours to be approved)
            </Forms.FormText>
            <Forms.FormText className={`${Margins.bottom16} ${Margins.top8}`}>
                <CodeBlock lang="css" content={themeTemplate} />
            </Forms.FormText>
            <Forms.FormTitle tag="h2" style={{
                overflowWrap: "break-word",
                marginTop: 8,
            }}>
                Submit Themes
            </Forms.FormTitle>
            <Forms.FormText>
                <TextArea
                    content={themeTemplate}
                    onChange={handleChange}
                    className={classes(TextAreaProps.textarea, "vce-text-input")}
                    placeholder="Theme CSS goes here..."
                    spellCheck={false}
                    rows={35}
                />
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Button
                        onClick={() => {
                            if (themeContent.length < 50) return showToast("Theme content is too short, must be above 50", Toasts.Type.FAILURE);

                            themeRequest("/submit/theme", {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    userId: `${currentUser.id}`,
                                    content: btoa(themeContent),
                                }),
                            }).then((response) => {
                                if (!response.ok) {
                                    Toasts.show({
                                        message: "Failed to submit theme, try again later. Probably ratelimit, wait 2 minutes.",
                                        id: Toasts.genId(),
                                        type: Toasts.Type.FAILURE,
                                        options: {
                                            duration: 5e3,
                                            position: Toasts.Position.BOTTOM
                                        }
                                    });
                                } else {
                                    Toasts.show({
                                        message: "Submitted your theme! Review can take up to 24 hours.",
                                        type: Toasts.Type.SUCCESS,
                                        id: Toasts.genId(),
                                        options: {
                                            duration: 5e3,
                                            position: Toasts.Position.BOTTOM
                                        }
                                    });
                                }
                            }).catch(() => {
                                showToast("Failed to submit theme, try later", Toasts.Type.FAILURE);
                            });
                        }}
                        size={Button.Sizes.MEDIUM}
                        color={Button.Colors.GREEN}
                        look={Button.Looks.FILLED}
                        className={Margins.top16}
                    >
                        Submit
                    </Button>
                    <p style={{
                        color: "var(--text-muted)",
                        fontSize: "12px",
                        marginTop: "8px",
                        marginLeft: "8px",
                    }}>
                        By submitting your theme, you agree to your Discord User ID being processed.
                    </p>
                </div>
            </Forms.FormText>
        </div>
    );
}

function ThemeLibrary() {
    const [currentTab, setCurrentTab] = useState(TabItem.THEMES);

    return (
        <SettingsTab title="Theme Library">
            <TabBar
                type="top"
                look="brand"
                className="vc-settings-tab-bar"
                selectedItem={currentTab}
                onItemSelect={setCurrentTab}
            >
                <TabBar.Item
                    className="vc-settings-tab-bar-item"
                    id={TabItem.THEMES}
                >
                    Themes
                </TabBar.Item>
                {/* <TabBar.Item
                    className="vc-settings-tab-bar-item"
                    id={TabItem.SUBMIT_THEMES}
                >
                    Submit Theme
                </TabBar.Item> */}
            </TabBar>

            { <ThemeTab />}
        </SettingsTab>
    );
}

export default wrapTab(ThemeLibrary, "Theme Library");
