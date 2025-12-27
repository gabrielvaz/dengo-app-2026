export const theme = {
  colors: {
    primary: '#7C3AED', // Purple (Primary Brand Color)
    secondary: '#2D2B36', // Dark Purple Surface (Unselected)
    accent: '#FB923C', // Lighter Orange
    background: '#0F0E17', // Deep Dark Purple/Black
    surface: '#1E1B26', // Slightly lighter dark for cards
    text: '#FFFFFF', // White text
    textLight: '#A09FA6', // Secondary text
    white: '#FFFFFF',
    error: '#CF6679',
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    s: 4,
    m: 12,
    l: 20,
    xl: 32,
  },
  typography: {
    h1: {
      fontSize: 32,
      color: '#FFFFFF',
      fontWeight: '700' as const,
    },
    h2: {
      fontSize: 24,
      color: '#FFFFFF',
      fontWeight: '600' as const,
    },
    h3: {
      fontSize: 20,
      color: '#FFFFFF',
      fontWeight: '600' as const,
    },
    body: {
      fontSize: 16,
      color: '#A09FA6',
    },
    caption: {
      fontSize: 12,
      color: '#A09FA6',
    },
    button: {
      fontSize: 16,
      fontWeight: '600' as '600',
      color: '#FFFFFF',
    },
    // Backwards compatibility (mapping old keys to new style)
    header: {
      fontSize: 24,
      fontWeight: 'bold' as 'bold',
      color: '#FFFFFF',
    },
  },
};
