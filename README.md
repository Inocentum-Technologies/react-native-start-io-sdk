# react-native-start-io-sdk

Start.io (Formerly StartApp) ad SDK for react-native

[![Version](https://img.shields.io/npm/v/react-native-start-io-sdk.svg)](https://www.npmjs.com/package/react-native-start-io-sdk)
[![Downloads](https://img.shields.io/npm/dm/react-native-start-io-sdk.svg)](https://www.npmjs.com/package/react-native-start-io-sdk)
[![License](https://img.shields.io/npm/l/react-native-start-io-sdk.svg)](https://github.com/patrickkabwe/react-native-start-io-sdk/LICENSE)

> **Android only, for now (iOS integration WIP).**

## Requirements

- React Native v0.76.0 or higher
- Node 18.0.0 or higher

> [!IMPORTANT]  
> To Support `Nitro Views` you need to install React Native version v0.78.0 or higher.

## Installation

```bash
npm install react-native-start-io-sdk react-native-nitro-modules
```
or
```bash
yarn add react-native-start-io-sdk react-native-nitro-modules
```
or
```bash
pnpm add react-native-start-io-sdk react-native-nitro-modules
```

## Usage Guide

### 1. SDK Initialization

Initializes the Start.io SDK with your application IDs for **both Android and iOS**.  
This must be called **once** before loading or showing any ads.

**Parameters (`InitializeSdkParams`):**
- `androidAppId` (**required**) — Your Start.io application ID for Android.
- `iOSAppId` (**required**) — Your Start.io application ID for iOS.
- `testAd?` — Optional. Set to `true` to load test ads instead of live ads. Default: `false`.
- `returnAd?` — Optional. Set to `false` to disable return ads (ads shown when returning to the app). Default: `true`.

**Example:**
```tsx
import { initializeStartIoSdk } from 'react-native-start-io-sdk';

// Initialize with live ads and return ads enabled
initializeStartIoSdk({
  androidAppId: 'ANDROID_APP_ID',
  iOSAppId: 'IOS_APP_ID'
});

// Initialize with test ads enabled and return ads disabled
initializeStartIoSdk({
  androidAppId: 'ANDROID_APP_ID',
  iOSAppId: 'IOS_APP_ID',
  testAd: true,
  returnAd: false
});
```

### 2. Loading and Showing Ads

You must **load** an ad before you can **show** it. The `loadAd` function accepts an `AdType` to specify which ad format to request. Supported (non-deprecated) types are:

-   `AdType.AUTOMATIC` — Let the SDK choose the best ad type.
    
-   `AdType.FULLPAGE` — Fullscreen interstitial ad.
    
-   `AdType.VIDEO` — Standard video ad.
    
-   `AdType.REWARDED_VIDEO` — Rewarded video ad (grants a reward on completion).
    

#### **Async/Await Example — Rewarded Video**


```ts
await loadAd(AdType.REWARDED_VIDEO);

showAd((result) => {
  if (result === AdResultType.AdRewarded) {
    console.log('User earned a reward!');
  }
});
```

#### **Promise Example — Rewarded Video**

```ts
loadAd(AdType.REWARDED_VIDEO).then(() => {
  showAd((result) => {
    if (result === AdResultType.AdRewarded) {
      console.log('User earned a reward!');
    }
  });
});
```

#### **Automatic Ad Selection**

```ts
loadAd(AdType.AUTOMATIC).then(() => {
  showAd((result) => {
    console.log('Ad finished with result:', result);
  });
});
```

#### **Fullscreen Interstitial**

```ts
loadAd(AdType.FULLPAGE).then(() => {
  showAd((result) => {
    if (result === AdResultType.AdClicked) {
      console.log('User clicked the interstitial ad');
    }
  });
});
```

#### **Standard Video Ad**

```ts
loadAd(AdType.VIDEO).then(() => {
  showAd((result) => {
    if (result === AdResultType.AdHidden) {
      console.log('Video ad closed by user');
    }
  });
});
```

### 3. Banner Ads

#### `StartIoBannerAd` — 320x50 Banner

```tsx
<StartIoBannerAd
  adTag="home_banner"
  onReceiveAd={() => console.log('Banner loaded')}
  onClick={() => console.log('Banner clicked')}
  style={{ marginBottom: 10 }}
/>
```

#### `StartIoMrecAd` — 300x250 Medium Rectangle

```tsx
<StartIoMrecAd
  adTag="article_mrec"
  onReceiveAd={() => console.log('MREC loaded')}
  style={{ alignSelf: 'center', marginVertical: 20 }}
/>
```

#### `StartIoCoverAd` — 300x157 Cover

```tsx
<StartIoCoverAd
  adTag="landing_cover"
  onReceiveAd={() => console.log('Cover loaded')}
  style={{ marginTop: 15 }}
/>
```

### 4. Native Ads

The `StartIoNativeAd` component **does not render UI** — it overlays your custom layout to handle native click events.

**Example:**

```tsx
import React, { useState } from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { StartIoNativeAd, NativeAdDetails } from 'react-native-start-io-sdk';

export const NativeAdExample = () => {
  const [adData, setAdData] = useState<NativeAdDetails | null>(null);

  return (
    <View style={{ position: 'relative', width: 300, height: 250 }}>
      {adData && (
        <View style={styles.adContainer}>
          {adData.imageUrl && (
            <Image source={{ uri: adData.imageUrl }} style={styles.image} />
          )}
          <Text style={styles.title}>{adData.title}</Text>
          <Text style={styles.description}>{adData.description}</Text>
          <Button title={adData.callToAction} onPress={() => {}} />
        </View>
      )}
      <StartIoNativeAd
        onLoadAd={(data) => setAdData(data)}
        onLoadError={(err) => console.error('Native ad error:', err)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  adContainer: { flex: 1, padding: 8, backgroundColor: '#fff' },
  image: { width: '100%', height: 150, resizeMode: 'cover' },
  title: { fontWeight: 'bold', fontSize: 16, marginTop: 8 },
  description: { fontSize: 14, color: '#555', marginVertical: 4 },
});

```

## API Reference

### Functions

-   `initializeStartIoSdk(appId, testAd?, returnAd?)` — Initialize SDK.
    
-   `loadAd(adType?)` — Load an ad.
    
-   `showAd(callback?)` — Show a loaded ad.
    

### Components

-   `StartIoBannerAd` — 320x50 banner.
    
-   `StartIoMrecAd` — 300x250 medium rectangle.
    
-   `StartIoCoverAd` — 300x157 cover banner.
    
-   `StartIoNativeAd` — Native ad click handler overlay.
    

### Types

-   `AdType` — AUTOMATIC, FULLPAGE, REWARDED_VIDEO, VIDEO, etc.
    
-   `AdResultType` — AdDisplayed, AdClicked, AdHidden, AdNotDisplayed, AdRewarded.
    
-   `NativeAdDetails` — Data for building native ad UI.
    

## Credits

Bootstrapped with create-nitro-module.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.