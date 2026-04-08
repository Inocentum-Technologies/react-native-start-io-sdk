import React from "react";
import { getHostComponent } from "react-native-nitro-modules";
import RNStartIoNativeAdTouchAreaConfig from "../nitrogen/generated/shared/json/RNStartIoNativeAdTouchAreaConfig.json";
import type { RNStartIoNativeAdTouchAreaMethods, RNStartIoNativeAdTouchAreaProps } from "./views/rn-start-io-native-ad-touch-area.nitro";
import { StyleSheet, type ViewStyle } from "react-native";

const RNStartIoNativeAdTouchArea = getHostComponent<
    RNStartIoNativeAdTouchAreaProps,
    RNStartIoNativeAdTouchAreaMethods
>("RNStartIoNativeAdTouchArea", () => RNStartIoNativeAdTouchAreaConfig);

/**
 * Renders a Start.io **Native Ad** container that handles its own native click events.
 *
 * This component does **not** render any visible UI by itself — instead, it occupies
 * an absolute position over your custom ad layout. You must use the `nativeAds` provided
 * by the `loadNativeAds` function to build and display your own UI elements (title, image,
 * call-to-action button, etc.).
 *
 * ### How it works
 * - When the native ads are loaded using `loadNativeAds` function, the `nativeAds` array is populated with `NativeAdDetails` objects.
 * - You create your own UI using that data.
 * - Place `<StartIoNativeAdTouchArea />` as an absolutely positioned overlay inside a relatively
 *   positioned container so it can capture clicks and handle them natively.
 *
 * ### Props
 * Extends `RNStartIoNativeAdTouchAreaProps` and accepts:
 * - `adIndex`: Index of the ad to handle clicks for.
 * - `style?`: Optional style overrides for the overlay container (default is full stretch).
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
 * import { StartIoNativeAdTouchArea, NativeAdDetails } from './StartIoNativeAdTouchArea';
 *
 * export const NativeAdExample = () => {
 *   const [nativeAds, setNativeAds] = useState<NativeAdDetails[]>([]);
 * 
 *   const loadNativeAds = async () => {
 *     const nativeAds = await loadNativeAds();
 *     setNativeAds(nativeAds);
 *   };
 *
 *   return (
 *     <View>
 *       <Button title="Load Native Ads" onPress={() => loadNativeAds()} />
 *       {nativeAds.map((adData, index) => (
 *         {% Position set to relative for overlaying the touch area %}
 *         <View style={{ position: 'relative', width: 300, height: 250 }}>
 *           <View style={styles.adContainer}>
 *             {adData.imageUrl && (
 *               <Image source={{ uri: adData.imageUrl }} style={styles.image} />
 *             )}
 *             <Text style={styles.title}>{adData.title}</Text>
 *             <Text style={styles.description}>{adData.description}</Text>
 *             <Button title={adData.callToAction} onPress={() => { handled natively }} />
 *           </View>
 *           <StartIoNativeAdTouchArea
 *             adIndex={index}
 *           />
 *         </View>
 *       ))}
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
const StartIoNativeAdTouchArea = (
    props: RNStartIoNativeAdTouchAreaProps & { style?: ViewStyle; }
) => {
    return <RNStartIoNativeAdTouchArea
        adIndex={props.adIndex}
        style={{
            ...StyleSheet.absoluteFill,
            ...props.style
        }}
    />
}

export { StartIoNativeAdTouchArea };