import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Available themes
const themes = {
  default: {
    name: 'Default',
    colors: {
      primary: 'blue',
      secondary: 'purple', 
      accent: 'green',
      background: 'gradient-to-br from-purple-50 to-blue-50',
      surface: 'white',
      text: 'gray-900',
      textSecondary: 'gray-600'
    },
    gradients: {
      primary: 'bg-gradient-to-r from-blue-600 to-purple-600',
      secondary: 'bg-gradient-to-r from-purple-600 to-pink-600',
      accent: 'bg-gradient-to-r from-green-600 to-blue-600'
    }
  },
  
  dark: {
    name: 'Dark Mode',
    colors: {
      primary: 'purple',
      secondary: 'blue',
      accent: 'green',
      background: 'gradient-to-br from-gray-900 to-gray-800',
      surface: 'gray-800',
      text: 'white',
      textSecondary: 'gray-300'
    },
    gradients: {
      primary: 'bg-gradient-to-r from-purple-600 to-blue-600',
      secondary: 'bg-gradient-to-r from-blue-600 to-indigo-600',
      accent: 'bg-gradient-to-r from-green-600 to-teal-600'
    }
  },
  
  vibrant: {
    name: 'Vibrant',
    colors: {
      primary: 'pink',
      secondary: 'orange',
      accent: 'yellow',
      background: 'gradient-to-br from-pink-50 to-orange-50',
      surface: 'white',
      text: 'gray-900',
      textSecondary: 'gray-600'
    },
    gradients: {
      primary: 'bg-gradient-to-r from-pink-600 to-red-600',
      secondary: 'bg-gradient-to-r from-orange-600 to-yellow-600',
      accent: 'bg-gradient-to-r from-yellow-600 to-pink-600'
    }
  },
  
  minimal: {
    name: 'Minimal',
    colors: {
      primary: 'gray',
      secondary: 'slate',
      accent: 'blue',
      background: 'gradient-to-br from-gray-50 to-slate-50',
      surface: 'white',
      text: 'gray-900',
      textSecondary: 'gray-600'
    },
    gradients: {
      primary: 'bg-gradient-to-r from-gray-600 to-slate-600',
      secondary: 'bg-gradient-to-r from-slate-600 to-gray-600',
      accent: 'bg-gradient-to-r from-blue-600 to-slate-600'
    }
  }
};

// Theme actions
const themeActions = {
  SET_THEME: 'SET_THEME',
  SET_CUSTOM_COLORS: 'SET_CUSTOM_COLORS',
  RESET_THEME: 'RESET_THEME'
};

// Initial state
const initialState = {
  currentTheme: 'default',
  theme: themes.default,
  customColors: null,
  availableThemes: themes
};

// Theme reducer
const themeReducer = (state, action) => {
  switch (action.type) {
    case themeActions.SET_THEME:
      return {
        ...state,
        currentTheme: action.payload,
        theme: themes[action.payload] || themes.default,
        customColors: null
      };
    
    case themeActions.SET_CUSTOM_COLORS:
      return {
        ...state,
        customColors: action.payload,
        theme: {
          ...state.theme,
          colors: { ...state.theme.colors, ...action.payload }
        }
      };
    
    case themeActions.RESET_THEME:
      return {
        ...state,
        currentTheme: 'default',
        theme: themes.default,
        customColors: null
      };
    
    default:
      return state;
  }
};

// Create context
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('eventBooker_theme');
    const savedCustomColors = localStorage.getItem('eventBooker_customColors');
    
    if (savedTheme && themes[savedTheme]) {
      dispatch({ type: themeActions.SET_THEME, payload: savedTheme });
    }
    
    if (savedCustomColors) {
      try {
        const customColors = JSON.parse(savedCustomColors);
        dispatch({ type: themeActions.SET_CUSTOM_COLORS, payload: customColors });
      } catch (error) {
        console.warn('Failed to load custom colors:', error);
      }
    }
  }, []);

  // Save theme when it changes
  useEffect(() => {
    localStorage.setItem('eventBooker_theme', state.currentTheme);
    
    if (state.customColors) {
      localStorage.setItem('eventBooker_customColors', JSON.stringify(state.customColors));
    } else {
      localStorage.removeItem('eventBooker_customColors');
    }
  }, [state.currentTheme, state.customColors]);

  // Change theme
  const setTheme = (themeName) => {
    if (themes[themeName]) {
      dispatch({ type: themeActions.SET_THEME, payload: themeName });
    }
  };

  // Set custom colors
  const setCustomColors = (colors) => {
    dispatch({ type: themeActions.SET_CUSTOM_COLORS, payload: colors });
  };

  // Reset to default theme
  const resetTheme = () => {
    dispatch({ type: themeActions.RESET_THEME });
  };

  // Get CSS classes for current theme
  const getThemeClasses = () => {
    const { colors } = state.theme;
    
    return {
      // Button styles
      primaryButton: `bg-${colors.primary}-600 hover:bg-${colors.primary}-700 text-white`,
      secondaryButton: `bg-${colors.secondary}-600 hover:bg-${colors.secondary}-700 text-white`,
      accentButton: `bg-${colors.accent}-600 hover:bg-${colors.accent}-700 text-white`,
      
      // Background styles
      pageBackground: `bg-${colors.background}`,
      cardBackground: `bg-${colors.surface}`,
      
      // Text styles
      primaryText: `text-${colors.text}`,
      secondaryText: `text-${colors.textSecondary}`,
      
      // Border styles
      border: `border-${colors.primary}-200`,
      focusRing: `focus:ring-${colors.primary}-500`,
      
      // Status colors
      success: 'bg-green-600 hover:bg-green-700 text-white',
      warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      error: 'bg-red-600 hover:bg-red-700 text-white',
      info: 'bg-blue-600 hover:bg-blue-700 text-white'
    };
  };

  // Get inline styles for dynamic colors
  const getThemeStyles = () => {
    if (!state.customColors) return {};
    
    return {
      '--primary-color': state.customColors.primary || state.theme.colors.primary,
      '--secondary-color': state.customColors.secondary || state.theme.colors.secondary,
      '--accent-color': state.customColors.accent || state.theme.colors.accent
    };
  };

  const value = {
    ...state,
    setTheme,
    setCustomColors,
    resetTheme,
    getThemeClasses,
    getThemeStyles
  };

  return (
    <ThemeContext.Provider value={value}>
      <div style={getThemeStyles()}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;