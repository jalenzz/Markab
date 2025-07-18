import { useSettings } from '../hooks';

export function Background() {
    const { settings } = useSettings();

    if (!settings.backgroundImage) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-0">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${settings.backgroundImage})`,
                    opacity: settings.backgroundOpacity,
                }}
            />

            {/* Gradient overlay for better text contrast */}
            <div
                className="absolute inset-0"
                style={{
                    background: `linear-gradient(
                        135deg,
                        rgba(0, 0, 0, 0.15) 0%,
                        rgba(0, 0, 0, 0.05) 30%,
                        rgba(0, 0, 0, 0.05) 70%,
                        rgba(0, 0, 0, 0.15) 100%
                    )`,
                }}
            />

            {/* Subtle blur overlay */}
            <div className="absolute inset-0 backdrop-blur-[2px]" />
        </div>
    );
}
