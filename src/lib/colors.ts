// Color configuration - SINGLE SOURCE OF TRUTH for entire app
// Change these values to instantly change the entire app's theme

export const colors = {
  // Brand colors - NAVY BLUE THEME
  brand: {
    primary: '#094d92',   // Deep navy for primary actions, buttons, CTAs
    secondary: '#60b2e5', // Sky blue for secondary elements, highlights, links
    accent: '#685044',    // Warm brown for emphasis, hover states
  },
  
  // Neutral colors - warm-toned for backgrounds, text, borders
  neutral: {
    50: '#faf6f0',
    100: '#f0ebe3',
    200: '#e0d9ce',
    300: '#cbc1b3',
    400: '#b0a494',
    500: '#948777',
    600: '#786b5d',
    700: '#5f5448',
    800: '#4a4036',
    900: '#332c24',
    950: '#1f1a15',
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
    brandGradient: 'linear-gradient(135deg, #094d92 0%, #60b2e5 100%)',
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
