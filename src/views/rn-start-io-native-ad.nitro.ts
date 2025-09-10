import type { HybridView, HybridViewMethods, HybridViewProps } from "react-native-nitro-modules";

/**
 * Enum representing possible campaign actions for the ad.
 */
export type CampaignAction = "LAUNCH_APP" | "OPEN_MARKET";

/**
 * Interface representing the details of a native ad.
 */
export interface NativeAdDetails {
    /** Title of the ad */
    title: string;

    /** Description of the ad */
    description: string;

    /** Rating of the ad in the Google Play / iOS App Store (range: 1–5) */
    rating: number;

    /** URL of the ad's main image, based on selected size */
    imageUrl?: string;

    /** URL of the ad's secondary icon image */
    secondaryImageUrl?: string;

    /** 
     * Number of installs in the Google Play store 
     * 
     * **Android Only**
     */
    installs: string;

    /** Category of the ad in the Google Play / iOS App Store */
    category: string;

    /** 
     * Package name of the advertised app (e.g., "com.startapp.quicksearchbox") 
     * 
     * **Android Only**
     */
    packageName: string;

    /** Action to perform when the ad is clicked (e.g., Launch app or open Google Play / App Store) */
    campaignAction: CampaignAction;

    /** Text to display on the "call to action" button or area */
    callToAction: string;
}

export interface RNStartIoNativeAdProps extends HybridViewProps {
    onLoadAd: (adData: NativeAdDetails) => void;
    onLoadError?: (message: string) => void;
}

export interface RNStartIoNativeAdMethods extends HybridViewMethods { }

export type RNStartIoNativeAd = HybridView<RNStartIoNativeAdProps, RNStartIoNativeAdMethods, { android: 'kotlin', ios: 'swift' }>;