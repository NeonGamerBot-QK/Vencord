import { ModalProps } from "@utils/modal";
import { User } from "discord-types/general";

export interface Theme {
  path: string;
    name: string;
    file_name: string;
    type: string | "file" ;
    description?: string;
    authorId: string;
    tags: string[];
    thumbnail_type?: 'path' | 'url';
    thumbnailPath?: string;
    baseFolder2?: string;
}

export interface ThemeInfoModalProps extends ModalProps {
    author: User;
    theme: Theme;
}

export const enum TabItem {
    THEMES,
    SUBMIT_THEMES,
}

export const enum SearchStatus {
    ALL,
    ENABLED,
    DISABLED,
    THEME,
    SNIPPET,
    DARK,
    LIGHT,
}
