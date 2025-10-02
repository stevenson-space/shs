import {Theme} from "@/utils/types";
import lightBaseTheme from "@/themes/base/light.json";
import darkBaseTheme from "@/themes/base/dark.json";

export function fallbackTheme(theme: Theme): Theme {
  if (theme.styling.base === "light" || theme.styling.base === undefined) {
    return lightBaseTheme as Theme;
  } else if (theme.styling.base === "dark") {
    return darkBaseTheme as Theme;
  } else {
    throw new Error(`Invalid base theme: ${theme.styling.base}`);
  }
}
