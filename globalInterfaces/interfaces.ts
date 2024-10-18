import { Theme } from "@react-navigation/native"

export interface IThemeMaximized extends Theme {
    actions: {
        error: string,
        success: string,
        warning: string,
        info: string
    }
}