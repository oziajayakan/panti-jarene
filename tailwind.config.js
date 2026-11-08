/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "primary": "#0D6B41",
                "primary-hover": "#0A5232",
                "primary-dark": "#063720",
                "primary-light": "#E8F5EE",
                "secondary": "#B45309",
                "secondary-light": "#FEF3C7",
                "surface": "#F8FAFC",
                "mint": "#F4FBF7",
            },
            fontFamily: {
                "sans": ["Plus Jakarta Sans", "Inter", "sans-serif"],
                "heading": ["Plus Jakarta Sans", "Inter", "sans-serif"],
                "mono": ["JetBrains Mono", "monospace"],
            },
            boxShadow: {
                "card": "0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)",
                "card-hover": "0 10px 25px -5px rgba(13, 107, 65, 0.06), 0 4px 10px -2px rgba(15, 23, 42, 0.03)",
                "elevated": "0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)",
            }
        },
    },
    plugins: [],
}
