import type { HybridView, HybridViewMethods, HybridViewProps } from "react-native-nitro-modules";

export enum BannerFormat {
    BANNER,
    MREC,
    COVER
}

export interface RNStartIoBannerProps extends HybridViewProps {
    format: BannerFormat;
    adTag?: string;
    onDisappear: () => void;
    onLoadError?: (message?: string) => void;
    onReceiveAd?: () => void;
    onFailedToReceiveAd?: () => void;
    onImpression?: () => void;
    onClick?: () => void;
}

export interface RNStartIoBannerMethods extends HybridViewMethods { }

export type RNStartIoBanner = HybridView<RNStartIoBannerProps, RNStartIoBannerMethods, { android: 'kotlin', ios: 'swift' }>;