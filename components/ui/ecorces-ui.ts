import { Area } from "react-easy-crop";
import { mergeClasses } from "../../lib/utils";
import { Timestamp } from "firebase/firestore";

export const uiBreakPoints = {
    md: 768,
} as const;

export const croppedImageUrl = (url: string, cropArea: Area) => url + "?crop=" + encodeURIComponent(JSON.stringify(cropArea));

export const backgroundUrl = (url: string) => `url(${url})`;

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const baseUiInputClasses = mergeClasses(
    "border border-golden/50 focus:border-golden/70 focus:border-2 outline-0 focus:ring-0",
    "text-white/80 placeholder-white/60 bg-white/20",
    "rounded-md"
);

export const getButtonClasses = (size: ButtonSize, enabled: boolean = true): string => mergeClasses(
    getButtonSizeClasses(size),
    enabled ? "cursor-pointer" : "cursor-not-allowed",
    "bg-golden text-black",
    "rounded px-4 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-opacity-50",
)

export type ButtonSize = "Normal"|"Small";

export function getButtonSizeClasses(size: ButtonSize): string {
    
    switch (size) {
        case "Small":
            return mergeClasses(
                "px-1 py-1",
                "text-sm"
            );

        case "Normal":
            return mergeClasses(
                "px-4 py-2",
                "text-normal"
            );
    }
}

export const getImageData = (src: string, area: Area, onImageDataReady: (data: string) => void) => {

    const image = new Image();
    image.src = src;
    image.crossOrigin = "anonymous";
    image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (ctx) {
            canvas.width = area.width;
            canvas.height = area.height;
            ctx.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, area.width, area.height);
            
            onImageDataReady(canvas.toDataURL());
        }
    }
}

export function cardDateFormat(date: Timestamp, endDate?: Timestamp) {

    const year = (endDate ?? date).toDate().getFullYear()

    const formatter = new Intl.DateTimeFormat('fr-FR', {
        month: 'long',
        day: 'numeric'
    })

    if (endDate) {
        return `Du ${formatter.format(date.toDate())} au ${formatter.format(endDate.toDate())} ${year}`;
    }
    else {
        return `Le ${formatter.format(date.toDate())} ${year}`;
    }
}

export const loremIpsumMedium = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."