export type ThemeType =
  | 'Default'
  | 'HighContrast'
  | 'Tritanopia'
  | 'LowContrast'
  | 'Purple'
  | 'RedGreen'
  | 'DarkMidnight'
  | 'DarkPastel'
  | 'LightPastel'
  | 'Solar';

  export type Theme = {
    name: string;
    isDark: boolean;
    tokens: {
      background: string;
      text: string;
  
      primary: string;
      onPrimary: string;
  
      secondary: string;
      onSecondary: string;
  
      accent: string;
      onAccent: string;
  
      error: string;
      onError: string;
  
      shadow?: string;
      overlay?: string;
    };
  };

  export const themeTokens: Record<string, Theme> = {
    Default: {
      name: 'Default',
      isDark: false,
      tokens: {
        background: '#FFFFEE',
        text: '#333333',
        primary: '#007BFF',
        onPrimary: '#FFFFFF',
        secondary: '#6C757D',
        onSecondary: '#FFFFFF',
        accent: '#FFD54F',
        onAccent: '#000000',
        error: '#D32F2F',
        onError: '#FFFFFF',
        shadow: 'rgba(0, 0, 0, 0.15)',
        overlay: 'rgba(0, 0, 0, 0.5)'
      }
    },
  
    HighContrast: {
      name: 'HighContrast',
      isDark: true,
      tokens: {
        background: '#000000',
        text: '#FFFFFF',
        primary: '#FFFF00',
        onPrimary: '#000000',
        secondary: '#00FFFF',
        onSecondary: '#000000',
        accent: '#FF00FF',
        onAccent: '#000000',
        error: '#FF0000',
        onError: '#000000',
        shadow: 'rgba(255, 255, 255, 0.2)',
        overlay: 'rgba(255, 255, 255, 0.1)'
      }
    },
  
    Tritanopia: {
      name: 'Tritanopia',
      isDark: false,
      tokens: {
        background: '#E5E5E5',
        text: '#330066',
        primary: '#0033CC',
        onPrimary: '#FFFFFF',
        secondary: '#009999',
        onSecondary: '#FFFFFF',
        accent: '#FF9933',
        onAccent: '#000000',
        error: '#D32F2F',
        onError: '#FFFFFF',
        shadow: 'rgba(0, 0, 0, 0.1)',
        overlay: 'rgba(0, 0, 0, 0.2)'
      }
    },
  
    LowContrast: {
      name: 'LowContrast',
      isDark: false,
      tokens: {
        background: '#FFFFCC',
        text: '#666666',
        primary: '#999999',
        onPrimary: '#000000',
        secondary: '#CCCCCC',
        onSecondary: '#000000',
        accent: '#EEEEEE',
        onAccent: '#000000',
        error: '#CC6666',
        onError: '#000000',
        shadow: 'rgba(0, 0, 0, 0.05)',
        overlay: 'rgba(0, 0, 0, 0.1)'
      }
    },
  
    Purple: {
      name: 'Purple',
      isDark: false,
      tokens: {
        background: '#FFECF5',
        text: '#871C9A',
        primary: '#AB47BC',
        onPrimary: '#FFFFFF',
        secondary: '#CE93D8',
        onSecondary: '#4A148C',
        accent: '#FFDDEE',
        onAccent: '#000000',
        error: '#D32F2F',
        onError: '#FFFFFF',
        shadow: 'rgba(0, 0, 0, 0.1)',
        overlay: 'rgba(0, 0, 0, 0.3)'
      }
    },
  
    RedGreen: {
      name: 'RedGreen',
      isDark: false,
      tokens: {
        background: '#E6F4EA',
        text: '#222222',
        primary: '#78B389',
        onPrimary: '#FFFFFF',
        secondary: '#B32357',
        onSecondary: '#FFFFFF',
        accent: '#FF6F61',
        onAccent: '#FFFFFF',
        error: '#D32F2F',
        onError: '#FFFFFF',
        shadow: 'rgba(0, 0, 0, 0.1)',
        overlay: 'rgba(0, 0, 0, 0.2)'
      }
    },
  
    DarkMidnight: {
      name: 'DarkMidnight',
      isDark: true,
      tokens: {
        background: '#121212',
        text: '#E0E0E0',
        primary: '#1E88E5',
        onPrimary: '#FFFFFF',
        secondary: '#3949AB',
        onSecondary: '#FFFFFF',
        accent: '#F50057',
        onAccent: '#FFFFFF',
        error: '#EF5350',
        onError: '#000000',
        shadow: 'rgba(0, 0, 0, 0.5)',
        overlay: 'rgba(255, 255, 255, 0.05)'
      }
    },
  
    DarkPastel: {
      name: 'DarkPastel',
      isDark: true,
      tokens: {
        background: '#2D2D2D',
        text: '#F8F8F2',
        primary: '#FF79C6',
        onPrimary: '#000000',
        secondary: '#8BE9FD',
        onSecondary: '#000000',
        accent: '#BD93F9',
        onAccent: '#000000',
        error: '#FF5555',
        onError: '#000000',
        shadow: 'rgba(0, 0, 0, 0.4)',
        overlay: 'rgba(255, 255, 255, 0.05)'
      }
    },
  
    LightPastel: {
      name: 'LightPastel',
      isDark: false,
      tokens: {
        background: '#FFF1F1',
        text: '#333333',
        primary: '#FFB3BA',
        onPrimary: '#000000',
        secondary: '#BAE1FF',
        onSecondary: '#000000',
        accent: '#B5EAD7',
        onAccent: '#000000',
        error: '#FF6961',
        onError: '#000000',
        shadow: 'rgba(0, 0, 0, 0.1)',
        overlay: 'rgba(0, 0, 0, 0.15)'
      }
    },
  
    Solar: {
      name: 'Solar',
      isDark: false,
      tokens: {
        background: '#FDF6E3',
        text: '#657B83',
        primary: '#B58900',
        onPrimary: '#002B36',
        secondary: '#268BD2',
        onSecondary: '#FFFFFF',
        accent: '#CB4B16',
        onAccent: '#FFFFFF',
        error: '#DC322F',
        onError: '#FFFFFF',
        shadow: 'rgba(0, 43, 54, 0.2)',
        overlay: 'rgba(101, 123, 131, 0.15)'
      }
    }
  };

export const ALL_THEME_TYPES = Object.keys(themeTokens) as ThemeType[];

export const defaultTheme: { type: ThemeType; theme: Theme } = {
  type: 'Default',
  theme: themeTokens['Default']
};
