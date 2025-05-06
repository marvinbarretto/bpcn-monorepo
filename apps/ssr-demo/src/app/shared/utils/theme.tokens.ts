export type ThemeType =
  | 'Default'
  | 'HighContrast'
  | 'Tritanopia'
  | 'LowContrast'
  | 'Purple'
  | 'RedGreen';

export interface Theme {
  backgroundColor: string;
  textColor: string;
  fontSize?: string;
  letterSpacing?: string;
}

export const themeTokens: Record<ThemeType, Theme> = {
  Default: {
    backgroundColor: '#FFFFEE',
    textColor: '#333333'
  },
  HighContrast: {
    backgroundColor: '#000000',
    textColor: '#FFFF00'
  },
  Tritanopia: {
    backgroundColor: '#E5E5E5',
    textColor: '#330066'
  },
  LowContrast: {
    backgroundColor: '#FFFFCC',
    textColor: '#333333'
  },
  Purple: {
    backgroundColor: '#FFEC07',
    textColor: '#871C9A'
  },
  RedGreen: {
    backgroundColor: '#78B389',
    textColor: '#B32357'
  }
};

export const defaultTheme: { type: ThemeType; theme: Theme } = {
  type: 'Default',
  theme: themeTokens.Default
};
