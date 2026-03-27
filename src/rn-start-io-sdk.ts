import { NitroModules } from "react-native-nitro-modules";
import { AdType, type AdResultType, type InitializeSdkParams, type RNStartIoSdk } from "./specs/rn-start-sdk.nitro";
export type { InitializeSdkParams };
export { AdResultType, AdType } from "./specs/rn-start-sdk.nitro";

const RNStartIoNativeSdk = NitroModules.createHybridObject<RNStartIoSdk>("RNStartIoSdk");

/**
 * Initializes the Start.io SDK with your application IDs for Android and iOS.
 *
 * This must be called **once** before loading or showing any ads.
 * Pass in both `androidAppId` and `iOSAppId` so the SDK can initialize
 * correctly on each platform.
 *
 * @param params - Initialization parameters:
 * - `androidAppId` (**required**) — Your Start.io application ID for Android.
 * - `iOSAppId` (**required**) — Your Start.io application ID for iOS.
 * - `testAd?` — Optional. Set to `true` to load test ads instead of live ads. Default: `false`.
 * - `returnAd?` — (**deprecated**) Optional. Set to `false` to disable return ads (ads shown when returning to the app). Default: `true`.
 *
 * @example
 * ```tsx
 * import { initializeStartIoSdk } from 'react-native-start-io-sdk';
 *
 * // Initialize with live ads and return ads enabled
 * initializeStartIoSdk({
 *   androidAppId: 'ANDROID_APP_ID',
 *   iOSAppId: 'IOS_APP_ID'
 * });
 *
 * // Initialize with test ads enabled and return ads disabled
 * initializeStartIoSdk({
 *   androidAppId: 'ANDROID_APP_ID',
 *   iOSAppId: 'IOS_APP_ID',
 *   testAd: true,
 *   returnAd: false
 * });
 * ```
 */
export function initializeStartIoSdk(params: InitializeSdkParams) {
  return RNStartIoNativeSdk.initializeSdk(params);
}

/**
 * Sets the user consent for personalized ads.
 * https://support.start.io/hc/en-us/articles/360014774799-Integration-via-Maven?_gl=1*fgtxlu*_gcl_au*MTkwMzY3NDE5MS4xNzc0NjA2NDU2#h_01HF6J2VHPB2PS1HFY5WME0DY7
 * 
 * @param currentTimeMillis - The current time in milliseconds.
 * @param userConsent - The user consent for personalized ads.
 * 
 * @example
 * ```tsx
 * import { setUserConsent } from 'react-native-start-io-sdk';
 * 
 * // Set user consent for personalized ads
 * setUserConsent(Date.now(), true);
 * ```
 */
export function setUserConsent(currentTimeMillis: number, userConsent: boolean) {
  return RNStartIoNativeSdk.setUserConsent(currentTimeMillis, userConsent);
}

/**
 * Sets the IAB US Privacy String for personalized ads.
 * https://support.start.io/hc/en-us/articles/360014774799-Integration-via-Maven?_gl=1*fgtxlu*_gcl_au*MTkwMzY3NDE5MS4xNzc0NjA2NDU2#h_01HF6J2VHP4QZH8MX40J7CPH25
 * 
 * @param iabusPrivacyString - The IAB US Privacy String.
 * 
 * @example
 * ```tsx
 * import { setIABUSPrivacyString } from 'react-native-start-io-sdk';
 * 
 * // Set IAB US Privacy String
 * setIABUSPrivacyString('1YNY');
 * ```
 */
export function setIABUSPrivacyString(iabusPrivacyString: string) {
  return RNStartIoNativeSdk.setIABUSPrivacyString(iabusPrivacyString);
}

/**
 * Loads an ad into memory so it can be shown later.
 *
 * @param adType - Optional. The type of ad to load. Defaults to `AdType.AUTOMATIC`.
 *   - `AdType.AUTOMATIC` — Let the SDK choose the best ad type.
 *   - `AdType.FULLPAGE` — Fullscreen interstitial ad.
 *   - `AdType.REWARDED_VIDEO` — Rewarded video ad.
 *   - `AdType.VIDEO` — Standard video ad.
 *
 * @example
 * ```tsx
 * import { loadAd, AdType } from 'react-native-start-io-sdk';
 *
 * // Load an automatic ad
 * loadAd();
 *
 * // Load a rewarded video ad
 * loadAd(AdType.REWARDED_VIDEO);
 * ```
 */
export function loadAd(adType: AdType = AdType.AUTOMATIC) {
  return RNStartIoNativeSdk.loadAd(adType);
}

/**
 * Displays a previously loaded ad.
 *
 * You must call `loadAd()` before calling `showAd()`.  
 * Optionally, provide a callback to handle the ad result.
 *
 * @param callback - Optional. Called with an `AdResultType` indicating the ad outcome:
 *   - `AdResultType.AdDisPlayed` — Ad was displayed.
 *   - `AdResultType.AdClicked` — Ad was clicked.
 *   - `AdResultType.AdHidden` — Ad was closed/hidden.
 *   - `AdResultType.AdNotDisplayed` — Ad failed to display.
 *   - `AdResultType.AdRewarded` — User earned a reward (rewarded ads only).
 *
 * @example
 * ```tsx
 * import { loadAd, showAd, AdType, AdResultType } from 'react-native-start-io-sdk';
 *
 * // Load and show a video ad
 * loadAd(AdType.VIDEO).then(() => {
 *   showAd((result) => {
 *     if (result === AdResultType.AdRewarded) {
 *       console.log('User earned a reward!');
 *     }
 *   });
 * });
 * ```
 */
export function showAd(callback?: (adResult: AdResultType) => void) {
  return RNStartIoNativeSdk.showAd(callback);
}
