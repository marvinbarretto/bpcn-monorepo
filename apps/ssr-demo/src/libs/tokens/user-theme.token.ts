import { InjectionToken } from "@angular/core";
import { ThemeType } from "../../app/shared/utils/theme.tokens";

export const USER_THEME_TOKEN = new InjectionToken<ThemeType>('UserTheme');