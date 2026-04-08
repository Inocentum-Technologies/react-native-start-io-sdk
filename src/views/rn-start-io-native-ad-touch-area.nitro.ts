import type { HybridView, HybridViewMethods, HybridViewProps } from "react-native-nitro-modules";

export interface RNStartIoNativeAdTouchAreaProps extends HybridViewProps {
    adIndex: number;
}

export interface RNStartIoNativeAdTouchAreaMethods extends HybridViewMethods { }

export type RNStartIoNativeAdTouchArea = HybridView<RNStartIoNativeAdTouchAreaProps, RNStartIoNativeAdTouchAreaMethods, { android: 'kotlin', ios: 'swift' }>;