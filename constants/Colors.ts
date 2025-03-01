/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

/**
 * Colors based on website theme
 */

export enum ColorCategory {
  Text = 'text',
  Background = 'background',
  NavBackground = 'navBackground',
  Tint = 'tint',
  Icon = 'icon',
  Action = 'action',
  ActionText = 'actionText',
}

// #FFE9E4 : paper-pink
// #ED5959 : brand-pink
// #A372F2 : brand-purple
// #403B51 : inkverse-black
// #2A2633 : inkverse-black-dark  
// #55BC31 : action-green
// #F7F7F7 : soft-white
// #567CD6 : taddy-blue
// #3E5FBC : taddy-blue-dark

export const Colors = {
  light: {
    [ColorCategory.Text]: '#403B51',      // inkverse-black
    [ColorCategory.Background]: '#FFE9E4', // paper-pink
    [ColorCategory.Tint]: '#ED5959',       // brand-pink
    [ColorCategory.Icon]: '#567CD6',       // taddy-blue
    [ColorCategory.NavBackground]: '#F7F7F7', // soft-white
    [ColorCategory.Action]: '#55BC31', // action-green
    [ColorCategory.ActionText]: '#F7F7F7', // action-text
  },
  dark: {
    [ColorCategory.Text]: '#F7F7F7',      // soft-white
    [ColorCategory.Background]: '#403B51', // inkverse-black
    [ColorCategory.NavBackground]: '#2A2633', // inkverse-black-dark
    [ColorCategory.Tint]: '#F7F7F7',      // soft-white
    [ColorCategory.Icon]: '#3E5FBC',      // taddy-blue-dark
    [ColorCategory.Action]: '#A372F2', // brand-purple
    [ColorCategory.ActionText]: '#F7F7F7', // action-text
  },
} as const;
