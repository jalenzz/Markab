// 动画配置
export const ANIMATION_CONFIG = {
    // 基础过渡配置
    transitions: {
        ease: { duration: 0.15, ease: [0.42, 0, 0.58, 1] as const },
    },

    // 延迟配置
    delays: {
        page: 0.1, // 页面入场延迟
        stagger: 0.03, // 书签项错开动画延迟
        empty: 0.2, // 空状态显示延迟
    },
} as const;

export type AnimationConfig = typeof ANIMATION_CONFIG;
