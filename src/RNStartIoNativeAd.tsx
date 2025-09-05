import React from "react";
import { getHostComponent } from "react-native-nitro-modules";
import type { ViewStyle } from "react-native";
import RNStartIoNativeAdConfig from "../nitrogen/generated/shared/json/RNStartIoNativeAdConfig.json";
import type { RNStartIoNativeAdMethods, RNStartIoNativeAdProps, NativeAdDetails } from "./views/rn-start-io-native-ad.nitro";
export type { NativeAdDetails };

const RNStartIoNativeAd = getHostComponent<
    RNStartIoNativeAdProps,
    RNStartIoNativeAdMethods
>("RNStartIoNativeAd", () => RNStartIoNativeAdConfig);

/**
 * Renders a Start.io **Native Ad** container that handles its own native click events.
 *
 * This component does **not** render any visible UI by itself — instead, it occupies
 * an absolute position over your custom ad layout. You must use the `adData` provided
 * by the `onLoadAd` callback to build and display your own UI elements (title, image,
 * call-to-action button, etc.).
 *
 * ### How it works
 * - When the ad loads, `onLoadAd` is called with a `NativeAdDetails` object containing
 *   all the data needed to render the ad.
 * - You create your own UI using that data.
 * - Place `<StartIoNativeAd />` as an absolutely positioned overlay inside a relatively
 *   positioned container so it can capture clicks and handle them natively.
 *
 * ### Props
 * Extends `RNStartIoNativeAdProps` and accepts:
 * - `style?`: Optional style overrides for the overlay container (default is full stretch).
 * - `onLoadAd(adData: NativeAdDetails)`: **Required** — called when the ad successfully loads.
 * - `onLoadError?(message: string)`: Optional — called when the ad fails to load.
 *
 * ### `NativeAdDetails` structure
 * - `title`: Title of the ad.
 * - `description`: Description text.
 * - `rating`: App rating (1–5).
 * - `imageUrl?`: URL of the main image.
 * - `secondaryImageUrl?`: URL of the secondary icon image.
 * - `installs`: Number of installs.
 * - `category`: App category.
 * - `packageName`: Package name of the advertised app.
 * - `campaignAction`: `"LAUNCH_APP"` or `"OPEN_MARKET"`.
 * - `callToAction`: Text for the call-to-action button.
 *
 * @example
 * ```tsx
 * import React, { useState } from 'react';
 * import { View, Text, Image, Button, StyleSheet } from 'react-native';
 * import { StartIoNativeAd, NativeAdDetails } from './StartIoNativeAd';
 *
 * export const NativeAdExample = () => {
 *   const [adData, setAdData] = useState<NativeAdDetails | null>(null);
 *
 *   return (
 *     <View style={{ position: 'relative', width: 300, height: 250 }}>
 *       {adData && (
 *         <View style={styles.adContainer}>
 *           {adData.imageUrl && (
 *             <Image source={{ uri: adData.imageUrl }} style={styles.image} />
 *           )}
 *           <Text style={styles.title}>{adData.title}</Text>
 *           <Text style={styles.description}>{adData.description}</Text>
 *           <Button title={adData.callToAction} onPress={() => { handled natively }} />
 *         </View>
 *       )}
 *       <StartIoNativeAd
 *         onLoadAd={(data) => setAdData(data)}
 *         onLoadError={(err) => console.error('Native ad error:', err)}
 *       />
 *     </View>
 *   );
 * };
 *
 * const styles = StyleSheet.create({
 *   adContainer: { flex: 1, padding: 8, backgroundColor: '#fff' },
 *   image: { width: '100%', height: 150, resizeMode: 'cover' },
 *   title: { fontWeight: 'bold', fontSize: 16, marginTop: 8 },
 *   description: { fontSize: 14, color: '#555', marginVertical: 4 },
 * });
 * ```
 *
 * ### Placement Notes
 * - Always wrap this component in a container with `position: "relative"`.
 * - The overlay will stretch to cover the container by default.
 * - All click handling is managed natively — you do not need to attach `onPress` to your UI.
 */
const StartIoNativeAd = (
    props: RNStartIoNativeAdProps & { style?: ViewStyle }
) => {
    return <RNStartIoNativeAd
        style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            ...props.style
        }}
        onLoadAd={{ f: props.onLoadAd }}
    />
}

export { StartIoNativeAd };