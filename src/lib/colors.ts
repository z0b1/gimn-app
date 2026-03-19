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
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
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
