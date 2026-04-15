// Color configuration - SINGLE SOURCE OF TRUTH for entire app
// Change these values to instantly change the entire app's theme

export const colors = {
  // Brand colors - PRIMARY RED THEME
  brand: {
    primary: '#DC2626',   // Vibrant red for primary actions, buttons, CTAs
    secondary: '#EF4444', // Lighter red for backgrounds, borders, subtle accents
    accent: '#991B1B',    // Deep red for hover states, emphasis, secondary actions
  },
  
  // Neutral colors - for backgrounds, text, borders
  neutral: {
    50: '#ECFFFE',
    100: '#D7FFFB',
    200: '#B2F7F2',
    300: '#8DEEE8',
    400: '#66E2DB',
    500: '#48D1CC',
    600: '#34B6B1',
    700: '#278F8B',
    800: '#1D6966',
    900: '#124645',
    950: '#0A2B2A',
  },
  
  // Semantic colors - DO NOT CHANGE (UX consistency)
  semantic: {
    success: '#10B981',  // Emerald green for success/accept
    warning: '#F59E0B',  // Amber for warnings
    danger: '#EF4444',   // Red for errors/delete
    info: '#3B82F6',     // Blue for info
  },
  
  // Gradients (optional)
  gradients: {
    brandGradient: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
  }
};

// Export individual color values for convenience
export const {
  brand: { primary, secondary, accent },
  neutral,
  semantic,
  gradients,
} = colors;

// Helper: Get all colors as object for easy iteration
export function getAllColors() {
  return colors;
}

// Helper: Change theme (useful for dynamic theming)
export function updateThemeColors(newColors: Partial<typeof colors>) {
  Object.assign(colors, newColors);
}
