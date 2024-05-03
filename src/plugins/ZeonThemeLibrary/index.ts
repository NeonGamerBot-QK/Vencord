import definePlugin from "@utils/types";

export default definePlugin({
    name: "Zeon Theme Library",
    description: "A library of themes for Vencord except its from my https://github.com/NeonGamerBot-QK/Vencord-themes and zeon themed :).",
    authors: [{
        name: "Fafa",
        id: 428188716641812481n,
    }, {
        name: "Neon",
        id: 566766267046821888n,
    }, {
        name: "Zeon",
        id: 778062673626660875n
    }],

    start() {
        const customSettingsSections = (
            Vencord.Plugins.plugins.Settings as any as { customSections: ((ID: Record<string, unknown>) => any)[]; }
        ).customSections;

        const ThemeSection = () => ({
            section: "ZeonThemeLibrary",
            label: "Zeons Theme Library",
            element: require("./components/ThemeTab").default,
            id: "ZeonThemeSection"
        });

        customSettingsSections.push(ThemeSection);
    },

    stop() {
        const customSettingsSections = (
            Vencord.Plugins.plugins.Settings as any as { customSections: ((ID: Record<string, unknown>) => any)[]; }
        ).customSections;

        const i = customSettingsSections.findIndex(section => section({}).id === "ZeonThemeSection");

        if (i !== -1) customSettingsSections.splice(i, 1);
    }
});
