# react-native-start-io-sdk

Start.io (Formerly StartApp) ad SDK for react-native

[![Version](https://img.shields.io/npm/v/react-native-start-io-sdk.svg)](https://www.npmjs.com/package/react-native-start-io-sdk)
[![Downloads](https://img.shields.io/npm/dm/react-native-start-io-sdk.svg)](https://www.npmjs.com/package/react-native-start-io-sdk)
[![License](https://img.shields.io/npm/l/react-native-start-io-sdk.svg)](https://github.com/Inocentum-Technologies/react-native-start-io-sdk/blob/main/LICENSE)

## Requirements

- React Native v0.78.0 or higher
- Node 18.0.0 or higher

> [!note]
> Since **react-native-start-io-sdk** is built with [Nitro Views](https://nitro.margelo.com/docs/hybrid-views), it requires the [new architecture](https://reactnative.dev/architecture/landing-page) to be enabled.

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
then
```
cd ios && pod install
```

## Usage Guide

### 1. SDK Initialization

Initializes the Start.io SDK with your application IDs for **both Android and iOS**.  
This must be called **once** before loading or showing any ads.

**Parameters (`InitializeSdkParams`):**
- `androidAppId` (**required**) — Your Start.io application ID for Android.
- `iOSAppId` (**required**) — Your Start.io application ID for iOS.
- `testAd?` — Optional. Set to `true` to load test ads instead of live ads. Default: `false`.
- `returnAd?` — (**deprecated**) Optional. Set to `false` to disable return ads. Default: `true`.
- `adPreferences?` — Optional. Target ads by user demographics:
  - `age?` — User's age.
  - `gender?` — `AdPreferencesGender.MALE` or `AdPreferencesGender.FEMALE`.

> [!note]
> At least one of `androidAppId` or `iOSAppId` is **required**.

**Example:**
```tsx
import { initializeStartIoSdk, AdPreferencesGender } from 'react-native-start-io-sdk';

// Initialize with live ads
initializeStartIoSdk({
  androidAppId: 'ANDROID_APP_ID',
  iOSAppId: 'IOS_APP_ID'
});

// Initialize with test ads and return ads disabled
initializeStartIoSdk({
  androidAppId: 'ANDROID_APP_ID',
  iOSAppId: 'IOS_APP_ID',
  testAd: true,
  returnAd: false
});

// Initialize with ad preferences (demographic targeting)
initializeStartIoSdk({
  androidAppId: 'ANDROID_APP_ID',
  iOSAppId: 'IOS_APP_ID',
  adPreferences: {
    age: 25,
    gender: AdPreferencesGender.MALE
  }
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

Use `loadNativeAds` to fetch native ad data, then render your own UI and overlay `StartIoNativeAdTouchArea` to handle clicks natively.

> [!important]
> Do **not** handle touch/click events from views within your native ad layout. All clicks are managed natively by `StartIoNativeAdTouchArea`.

#### `loadNativeAds` — Fetching Native Ads

```ts
import { loadNativeAds, NativeAdImageSize } from 'react-native-start-io-sdk';

// Load up to 3 native ads with default image sizes
const ads = await loadNativeAds(3);

// Load with custom image sizes
const ads = await loadNativeAds(
  5,
  NativeAdImageSize.SIZE_340X340,
  NativeAdImageSize.SIZE_340X340
);
```

**`NativeAdImageSize` values:** `SIZE_72X72`, `SIZE_100X100`, `SIZE_150X150` *(default)*, `SIZE_340X340`, `SIZE_1200X628`

> [!note]
> `SIZE_1200X628` is only supported for `primaryImageSize`. If used as `secondaryImageSize`, the default (`SIZE_150X150`) will be used instead.

> [!tip]
> Don't reload native ads too frequently — a 45-second interval (matching the default banner refresh rate) is recommended.

#### `StartIoNativeAdTouchArea` — Rendering Native Ads

Place `StartIoNativeAdTouchArea` as an absolutely positioned overlay inside your ad container. Pass the `adIndex` matching the ad's position in the array returned by `loadNativeAds`.

```tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import {
  loadNativeAds,
  StartIoNativeAdTouchArea,
  NativeAdDetails
} from 'react-native-start-io-sdk';

export const NativeAdExample = () => {
  const [nativeAds, setNativeAds] = useState<NativeAdDetails[]>([]);

  useEffect(() => {
    loadNativeAds(3).then(setNativeAds);
  }, []);

  return (
    <View>
      {nativeAds.map((adData, index) => (
        <View key={index} style={{ position: 'relative', width: 300, height: 250 }}>
          <View style={styles.adContainer}>
            {adData.imageUrl && (
              <Image source={{ uri: adData.imageUrl }} style={styles.image} />
            )}
            <Text style={styles.title}>{adData.title}</Text>
            <Text style={styles.description}>{adData.description}</Text>
            {/* Click is handled natively — do not attach onPress */}
            <Button title={adData.callToAction} onPress={() => {}} />
          </View>
          {/* Overlay to capture native clicks */}
          <StartIoNativeAdTouchArea adIndex={index} />
        </View>
      ))}
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

#### `StartIoNativeAd` — *(Deprecated)*

> [!warning]
> `StartIoNativeAd` is deprecated. Use `loadNativeAds` + `StartIoNativeAdTouchArea` instead.

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
          {/* Click is handled natively — do not attach onPress */}
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

### 5. Compliance and Privacy

#### User Consent (GDPR)

Use `setUserConsent` to set the user consent for personalized ads.

```typescript
import { setUserConsent } from 'react-native-start-io-sdk';

// Set user consent for personalized ads
setUserConsent(Date.now(), true);
```

#### IAB US Privacy String (CCPA)

Use `setIABUSPrivacyString` to set the IAB US Privacy String for personalized ads.

```typescript
import { setIABUSPrivacyString } from 'react-native-start-io-sdk';

// Set IAB US Privacy String
setIABUSPrivacyString('1YNY');
```

## API Reference

### Functions

| Function | Description |
|---|---|
| `initializeStartIoSdk(params)` | Initialize the SDK. Must be called once before loading any ads. |
| `loadAd(adType?)` | Load an interstitial/video ad. Defaults to `AdType.AUTOMATIC`. |
| `showAd(callback?)` | Show a previously loaded ad. |
| `loadNativeAds(numberOfAds, primaryImageSize?, secondaryImageSize?)` | Fetch native ad data. Returns `Promise<NativeAdDetails[]>`. |
| `setUserConsent(currentTimeMillis, userConsent)` | Set GDPR user consent. |
| `setIABUSPrivacyString(iabusPrivacyString)` | Set CCPA IAB US Privacy String. |

### Components

| Component | Description |
|---|---|
| `StartIoBannerAd` | 320×50 banner ad. |
| `StartIoMrecAd` | 300×250 medium rectangle ad. |
| `StartIoCoverAd` | 300×157 cover banner ad. |
| `StartIoNativeAdTouchArea` | Overlay to handle native ad clicks (use with `loadNativeAds`). |
| `StartIoNativeAd` | *(Deprecated)* Legacy native ad click overlay. |

### Enums

| Enum | Values |
|---|---|
| `AdType` | `AUTOMATIC`, `FULLPAGE`, `REWARDED_VIDEO`, `VIDEO` *(+ deprecated: `OFFERWALL`, `OVERLAY`)* |
| `AdResultType` | `AdDisPlayed`, `AdClicked`, `AdHidden`, `AdNotDisplayed`, `AdRewarded` |
| `AdPreferencesGender` | `MALE`, `FEMALE` |
| `NativeAdImageSize` | `SIZE_72X72`, `SIZE_100X100`, `SIZE_150X150` *(default)*, `SIZE_340X340`, `SIZE_1200X628` *(primary only)* |

### Types

| Type | Description |
|---|---|
| `InitializeSdkParams` | Params for `initializeStartIoSdk`: `androidAppId`, `iOSAppId`, `testAd`, `returnAd`, `adPreferences`. |
| `AdInitPreferences` | `{ age?: number; gender?: AdPreferencesGender }` |
| `NativeAdDetails` | Data object for building native ad UI: `title`, `description`, `rating`, `imageUrl`, `secondaryImageUrl`, `installs`, `category`, `packageName`, `campaignAction`, `callToAction`. |

## Credits

Bootstrapped with create-nitro-module.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
