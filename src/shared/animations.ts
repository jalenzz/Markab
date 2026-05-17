export const ANIMATION_CONFIG = {
    transitions: {
        ease: { duration: 0.15, ease: [0.42, 0, 0.58, 1] as const },
    },

    delays: {
        stagger: 0.03,
        empty: 0.2,
    },

    presets: {
        slideInLeft: {
            initial: { opacity: 0, x: -5 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -5 },
        },
        slideInUp: {
            initial: { opacity: 0, y: -20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
        },
        fadeIn: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
        },
        slideInRight: {
            initial: { opacity: 0, x: 320 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: 320 },
        },
    },
} as const;

export type AnimationConfig = typeof ANIMATION_CONFIG;
