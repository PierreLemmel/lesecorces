import { Area } from "react-easy-crop";
import { mergeClasses } from "../../lib/utils";
import { Timestamp } from "firebase/firestore";

export const uiBreakPoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536
} as const;

export type EcorcesBreakPoints = "none"|keyof typeof uiBreakPoints;

export function getBreakpoint(width: number): EcorcesBreakPoints {

    if (width < uiBreakPoints.sm) {
        return "sm";
    }
    else if (width < uiBreakPoints.md) {
        return "md";
    }
    else if (width < uiBreakPoints.lg) {
        return "lg";
    }
    else if (width < uiBreakPoints.xl) {
        return "xl";
    }
    else {
        return "xxl";
    }
}

export const mainMenuItems = [
    {
        href: "/",
        label: "Accueil",
    },
    {
        href: "/spectacles",
        label: "Spectacles",
    },
    {
        href: "/compagnie",
        label: "Compagnie",
    },
    {
        href: "/ecole",
        label: "Offre pédagogique",
    },
    {
        href: "/espace-pro",
        label: "Espace Professionnels",
    },
]

const roundArea = (area: Area): Area => ({
    x: Math.round(area.x),
    y: Math.round(area.y),
    width: Math.round(area.width),
    height: Math.round(area.height)
});
export const croppedImageUrl = (url: string, cropArea: Area) => url + "?crop=" + encodeURIComponent(JSON.stringify(roundArea(cropArea)));

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

export const ecorcesColor = {
    golden: '#F3BC77',
    golden2: '#FA5B17',
    flower: '#150808',
    water: '#081215',
    trunk: '#151108',
    leaves: '#0C1508',
    bark: '#0A0A0A'
} as const;

export const layoutClasses = {
    mainColumnPadding: "px-2 sm:px-6 md:px-12",
    heading1: "uppercase font-extrabold text-xl md:text-2xl lg:text-3xl mb-1",
    heading2: "font-semibold text-lg lg:text-xl",
} as const;