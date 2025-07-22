import { useRef } from 'react';

import type { ImageUploadSettingConfig } from '../../../types';

interface ImageUploadControlProps {
    config: ImageUploadSettingConfig;
    value: string | null;
    onChange: (value: string | null) => void;
}

export function ImageUploadControl({ config, value, onChange }: ImageUploadControlProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageData = event.target?.result as string;
                onChange(imageData);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = () => {
        onChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-3">
            <label className="text-body font-medium text-newtab-text-primary-light dark:text-newtab-text-primary-dark">
                {config.label}
            </label>

            <div className="space-y-2">
                {value ? (
                    <div className="relative">
                        <img
                            src={value}
                            alt="Background preview"
                            className="h-24 w-full rounded-default object-cover"
                        />
                        <button
                            onClick={handleRemove}
                            className="absolute right-2 top-2 rounded-full bg-black/50 px-2 py-1 text-xs text-white hover:bg-black/70"
                        >
                            Remove
                        </button>
                    </div>
                ) : (
                    <div className="border-newtab-border-light dark:border-newtab-border-dark flex flex-col items-center justify-center rounded-default border-2 border-dashed p-6 text-center">
                        <svg
                            className="mb-2 h-8 w-8 text-newtab-text-secondary-light dark:text-newtab-text-secondary-dark"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <span className="text-sm text-newtab-text-secondary-light dark:text-newtab-text-secondary-dark">
                            Upload background image
                        </span>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                />

                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="hover:bg-newtab-active-light dark:hover:bg-newtab-active-dark w-full rounded-default bg-newtab-hover-light px-4 py-2 text-body text-newtab-text-primary-light transition-colors duration-default dark:bg-newtab-hover-dark dark:text-newtab-text-primary-dark"
                >
                    {value ? 'Change Image' : 'Upload Image'}
                </button>
            </div>
        </div>
    );
}
