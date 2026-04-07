/**
 * OttoIA Design System - Tailwind Configuration
 * ================================================
 * Extracted from ottoia-reference MVP (React 19 + FastAPI + MongoDB)
 * Source: github.com/gutierrezbj/OttoIA (branch conflict_060426_1515)
 *
 * DUAL-WORLD INTERFACE:
 *   - Child Theme: Claymorphism - playful, tactile, cartoon-like
 *   - Parent Theme: Clean Swiss - professional, data-focused
 *
 * Usage: Import this config in your tailwind.config.js
 *   const ottoiaTheme = require('./tailwind.config.ottoia');
 *   module.exports = { ...ottoiaTheme, content: [...] };
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  theme: {
    extend: {
      // ============================================================
      // COLORS
      // ============================================================
      colors: {
        // --- Child Theme (Claymorphism) ---
        child: {
          bg:        "#FFFDF5",   // warm cream background
          primary:   "#4CC9F0",   // cyan - main CTA, tutor icon, math
          secondary: "#FFD60A",   // golden yellow - lengua, secondary buttons
          accent:    "#F72585",   // hot pink - inglés, accent buttons
          success:   "#10B981",   // emerald - ciencias, correct answers
          text: {
            main:    "#2B2D42",   // dark navy - headings, body text
            muted:   "#8D99AE",   // steel gray - secondary text, placeholders
          },
          card:      "#FFFFFF",
          border:    "#2B2D42",   // thick black borders (claymorphism)
        },
        // --- Parent Theme (Clean Swiss) ---
        parent: {
          bg:        "#F8FAFC",   // cool slate background
          primary:   "#0F172A",   // slate-900
          secondary: "#334155",   // slate-700
          accent:    "#3B82F6",   // blue-500
          success:   "#10B981",   // emerald-500
          warning:   "#F59E0B",   // amber-500
          error:     "#EF4444",   // red-500
          text: {
            main:    "#0F172A",
            muted:   "#64748B",   // slate-500
          },
          card:      "#FFFFFF",
          border:    "#E2E8F0",   // slate-200
        },
        // --- Subject Colors (shared) ---
        subject: {
          matematicas: "#4CC9F0",
          lengua:      "#FFD60A",
          ciencias:    "#10B981",
          ingles:      "#F72585",
        },
        // --- Status Semaphore ---
        status: {
          green:  "#10B981",
          yellow: "#F59E0B",
          red:    "#EF4444",
        },
        // --- Mood Colors ---
        mood: {
          happy:      "#10B981",
          neutral:    "#F59E0B",
          tired:      "#8D99AE",
          frustrated: "#EF4444",
        },
        // --- Shadcn/ui CSS Variable Tokens ---
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input:  "hsl(var(--input))",
        ring:   "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },

      // ============================================================
      // TYPOGRAPHY
      // ============================================================
      fontFamily: {
        // Child
        "fredoka":      ["Fredoka", "sans-serif"],        // headings child
        "varela":       ["Varela Round", "sans-serif"],    // body child
        // Parent
        "outfit":       ["Outfit", "sans-serif"],          // headings parent
        "inter":        ["Inter", "sans-serif"],           // body parent
      },

      // ============================================================
      // BORDER RADIUS
      // ============================================================
      borderRadius: {
        // Shadcn tokens
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        // OttoIA custom
        "clay":     "24px",     // card-clay
        "clay-btn": "9999px",   // pill buttons (child)
        "clay-icon": "16px",    // subject icons, small cards
      },

      // ============================================================
      // SHADOWS (Claymorphism)
      // ============================================================
      boxShadow: {
        "clay-lg":   "6px 6px 0px 0px rgba(0,0,0,0.1)",   // card-clay
        "clay-md":   "4px 4px 0px 0px rgba(0,0,0,1)",      // btn-clay primary
        "clay-sm":   "3px 3px 0px 0px rgba(0,0,0,1)",      // btn-clay secondary
        "clay-none": "none",                                 // hover state
        // Parent
        "parent-sm": "0 1px 2px 0 rgba(0,0,0,0.05)",
      },

      // ============================================================
      // SPACING / LAYOUT
      // ============================================================
      spacing: {
        "clay-border": "4px",     // standard child border width
        "clay-border-sm": "3px",  // thinner child border
      },
      maxWidth: {
        "child-container": "1200px",
        "chat-container":  "768px",  // max-w-3xl
        "map-container":   "896px",  // max-w-4xl
      },

      // ============================================================
      // GRADIENTS (used as bg-gradient-to-* classes)
      // ============================================================
      // These are documented as reference - use Tailwind gradient utilities:
      //
      // Adventure Map Background:
      //   bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-900
      //
      // World Gradients (subject backgrounds):
      //   matematicas: bg-gradient-to-b from-cyan-400 to-blue-500
      //   lengua:      bg-gradient-to-b from-yellow-400 to-orange-500
      //   ciencias:    bg-gradient-to-b from-emerald-400 to-teal-500
      //   ingles:      bg-gradient-to-b from-pink-400 to-purple-500
      //
      // Landing Page:
      //   background: linear-gradient(135deg, #FFFDF5 0%, #FEF3C7 100%)
      //
      // Streak Badge:
      //   background: linear-gradient(135deg, #FFD60A, #F59E0B)
      //
      // Adventure Map CTA (ChildDashboard):
      //   bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
      //
      // Parent Avatar Gradient:
      //   bg-gradient-to-br from-blue-500 to-purple-500

      // ============================================================
      // ANIMATIONS / KEYFRAMES
      // ============================================================
      keyframes: {
        "bounce-in": {
          "0%":   { transform: "scale(0.8)", opacity: "0" },
          "50%":  { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(76, 201, 240, 0.5)" },
          "50%":      { boxShadow: "0 0 20px rgba(76, 201, 240, 0.8)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
      },
      animation: {
        "bounce-in":      "bounce-in 0.5s ease forwards",
        "fade-in":        "fade-in 0.3s ease forwards",
        "pulse-glow":     "pulse-glow 2s ease-in-out infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
      },
    },
  },
  // NOTE: plugins moved to consuming project's tailwind.config.js
  // so require() resolves from the correct node_modules
  plugins: [],
};
