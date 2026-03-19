# 🎨 Gimn-App Color System

## Overview
All app colors are centralized in **ONE file**: `src/lib/colors.ts`

Changing colors is as simple as modifying this file. The entire app will instantly reflect the changes without touching any components.

## Current Theme: Red Brand

- **Primary:** #DC2626 (Vibrant red)
- **Secondary:** #EF4444 (Light red)
- **Accent:** #991B1B (Deep red)

## How to Change Colors

### Method 1: One-Prompt Change (Recommended)
Simply ask: "Change the entire app's theme to [color name/hex]"

The agent will:
1. Update `src/lib/colors.ts` with new primary/secondary/accent colors
2. Run build to verify
3. Commit and push

### Method 2: Manual Change
1. Open `src/lib/colors.ts`
2. Modify the `colors.brand` object:
   ```typescript
   brand: {
     primary: '#NEW_HEX',
     secondary: '#NEW_HEX',
     accent: '#NEW_HEX',
   }
   ```
3. Save the file
4. Run `npm run build` to verify
5. Colors throughout the app will change instantly

## Color Files

### Central Source
- **src/lib/colors.ts** - The single source of truth. All colors defined here.

### Where Colors Are Used
- **tailwind.config.mjs** - Imports colors.ts and applies to Tailwind theme
- **src/app/globals.css** - CSS custom properties (--color-primary, etc.)
- **All components** - Use Tailwind classes (brand-primary, brand-secondary, etc.)

## Color Hierarchy

### Brand Colors (Can be changed with one prompt)
- `brand-primary` - Main brand color for buttons, CTAs, important elements
- `brand-secondary` - Light brand color for backgrounds, subtle elements
- `brand-accent` - Dark brand color for hover states, emphasis

### Semantic Colors (Should NOT be changed - UX consistency)
- `success: #10B981` (green) - Accept, resolve, confirm actions
- `danger: #EF4444` (red) - Delete, reject, error states
- `warning: #F59E0B` (amber) - Warnings
- `info: #3B82F6` (blue) - Information

## Example Color Schemes

### Current (Red Theme)
```
Primary: #DC2626
Secondary: #EF4444
Accent: #991B1B
```

### Blue Theme
```
Primary: #2563EB
Secondary: #60A5FA
Accent: #1E40AF
```

### Green Theme
```
Primary: #16A34A
Secondary: #4ADE80
Accent: #15803D
```

### Purple Theme
```
Primary: #9333EA
Secondary: #D8B4FE
Accent: #6B21A8
```

## Component Color Usage

All components use one of three methods:

1. **Tailwind Brand Classes** (Recommended)
   ```jsx
   <button className="bg-brand-primary hover:bg-brand-accent">
     Click me
   </button>
   ```

2. **CSS Variables**
   ```css
   .button {
     background-color: var(--color-primary);
   }
   ```

3. **Direct Import** (For special cases)
   ```typescript
   import { colors } from '@/lib/colors';
   
   const buttonStyle = {
     backgroundColor: colors.brand.primary
   };
   ```

## Building the App

After changing colors:
```bash
npm run build
```

If successful, colors are ready. No other changes needed.

## Quick Reference

**To change app theme to a different color:**
1. Modify `src/lib/colors.ts` - specifically the `brand` object
2. Run `npm run build`
3. Done! 🎨

The entire app will reflect the new colors instantly across:
- Buttons and CTAs
- Links and interactive elements
- Form controls
- Badges and labels
- Hover states
- Borders and shadows
- All UI components

---

**Last Updated:** 2026-03-19  
**System:** Centralized Color Configuration  
**One-Prompt Capable:** ✅ YES
