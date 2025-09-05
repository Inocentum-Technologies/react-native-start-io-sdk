import React from "react";
import { getHostComponent } from "react-native-nitro-modules";
import RNStartIoBannerConfig from "../nitrogen/generated/shared/json/RNStartIoBannerConfig.json";
import { BannerFormat, type RNStartIoBannerMethods, type RNStartIoBannerProps } from "./views/rn-start-io-banner.nitro";
import type { ViewStyle } from "react-native";

const RNStartIoBanner = getHostComponent<
    RNStartIoBannerProps,
    RNStartIoBannerMethods
>("RNStartIoBanner", () => RNStartIoBannerConfig);

type PropsType = Omit<RNStartIoBannerProps, "format"> & { style?: ViewStyle };

/**
 * Displays a Start.io **Banner** ad with a fixed size of **320x50** pixels.
 *
 * Ideal for placement at the top or bottom of a screen, or within layouts
 * where a standard banner fits naturally.
 *
 * ### Props
 * Inherits all props from `PropsType`, including:
 * - `adTag?`: Optional identifier for targeting or tracking the ad placement.
 * - `style?`: Custom style overrides for the ad container.
 * - `onLoadError?`: Callback when the ad fails to load.
 * - `onClick?`: Callback when the ad is clicked.
 * - `onFailedToReceiveAd?`: Callback when the ad request fails.
 * - `onImpression?`: Callback when the ad impression is recorded.
 * - `onReceiveAd?`: Callback when the ad is successfully received.
 *
 * @example
 * ```tsx
 * <StartIoBannerAd
 *   adTag="home_banner"
 *   onReceiveAd={() => console.log('Banner ad loaded')}
 *   onClick={() => console.log('Banner ad clicked')}
 *   style={{ marginBottom: 10 }}
 * />
 * ```
 */
const StartIoBannerAd = (props: PropsType) => {
    return (
        <RNStartIoBanner
            format={BannerFormat.BANNER}
            {...props}
            style={{
                width: 320,
                height: 50,
                ...props.style,
            }}
            onLoadError={{ f: props.onLoadError }}
            onClick={{ f: props.onClick }}
            onFailedToReceiveAd={{ f: props.onFailedToReceiveAd }}
            onImpression={{ f: props.onImpression }}
            onReceiveAd={{ f: props.onReceiveAd }}
        />
    );
};

/**
 * Displays a Start.io **MREC (Medium Rectangle)** ad with a fixed size of **300x250** pixels.
 *
 * Commonly used within scrollable content, between sections of a feed, or in
 * layouts where a larger rectangular ad fits naturally.
 *
 * ### Props
 * Inherits all props from `PropsType`, including:
 * - `adTag?`: Optional identifier for targeting or tracking the ad placement.
 * - `style?`: Custom style overrides for the ad container.
 * - `onLoadError?`: Callback when the ad fails to load.
 * - `onClick?`: Callback when the ad is clicked.
 * - `onFailedToReceiveAd?`: Callback when the ad request fails.
 * - `onImpression?`: Callback when the ad impression is recorded.
 * - `onReceiveAd?`: Callback when the ad is successfully received.
 *
 * @example
 * ```tsx
 * <StartIoMrecAd
 *   adTag="article_mrec"
 *   onReceiveAd={() => console.log('MREC ad loaded')}
 *   onClick={() => console.log('MREC ad clicked')}
 *   style={{ alignSelf: 'center', marginVertical: 20 }}
 * />
 * ```
 */
const StartIoMrecAd = (props: PropsType) => {
    return (
        <RNStartIoBanner
            format={BannerFormat.MREC}
            {...props}
            style={{
                width: 300,
                height: 250,
                ...props.style,
            }}
            onLoadError={{ f: props.onLoadError }}
            onClick={{ f: props.onClick }}
            onFailedToReceiveAd={{ f: props.onFailedToReceiveAd }}
            onImpression={{ f: props.onImpression }}
            onReceiveAd={{ f: props.onReceiveAd }}
        />
    );
};

/**
 * Displays a Start.io **Cover** ad with a fixed size of **300x157** pixels.
 *
 * Suitable for panoramic-style placements, such as above-the-fold sections,
 * splash screens, or between major content blocks.
 *
 * ### Props
 * Inherits all props from `PropsType`, including:
 * - `adTag?`: Optional identifier for targeting or tracking the ad placement.
 * - `style?`: Custom style overrides for the ad container.
 * - `onLoadError?`: Callback when the ad fails to load.
 * - `onClick?`: Callback when the ad is clicked.
 * - `onFailedToReceiveAd?`: Callback when the ad request fails.
 * - `onImpression?`: Callback when the ad impression is recorded.
 * - `onReceiveAd?`: Callback when the ad is successfully received.
 *
 * @example
 * ```tsx
 * <StartIoCoverAd
 *   adTag="landing_cover"
 *   onReceiveAd={() => console.log('Cover ad loaded')}
 *   onClick={() => console.log('Cover ad clicked')}
 *   style={{ marginTop: 15 }}
 * />
 * ```
 */
const StartIoCoverAd = (props: PropsType) => {
    return (
        <RNStartIoBanner
            format={BannerFormat.MREC}
            {...props}
            style={{
                width: 300,
                height: 157,
                ...props.style,
            }}
            onLoadError={{ f: props.onLoadError }}
            onClick={{ f: props.onClick }}
            onFailedToReceiveAd={{ f: props.onFailedToReceiveAd }}
            onImpression={{ f: props.onImpression }}
            onReceiveAd={{ f: props.onReceiveAd }}
        />
    );
};

export { StartIoBannerAd, StartIoCoverAd, StartIoMrecAd };