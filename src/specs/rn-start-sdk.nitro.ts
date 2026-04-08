import type { HybridObject } from "react-native-nitro-modules";
import type { NativeAdDetails } from "../views/rn-start-io-native-ad.nitro";

export enum AdPreferenceGender {
    MALE = 'male',
    FEMALE = 'female',
}

export enum AdType {
    AUTOMATIC,
    FULLPAGE,
    /** @deprecated */
    OFFERWALL,
    REWARDED_VIDEO,
    VIDEO,
    /** @deprecated */
    OVERLAY
}

export enum AdResultType {
    AdDisPlayed,
    AdClicked,
    AdHidden,
    AdNotDisplayed,
    /** User gained a reward */
    AdRewarded
}

export interface AdInitPreferences {
    age?: number;
    gender?: AdPreferenceGender;
}

export interface InitializeSdkParams {
    androidAppId?: string;
    iOSAppId?: string;
    adPreferences?: AdInitPreferences;
    testAd?: boolean;
    /** @deprecated */
    returnAd?: boolean;
}

export enum NativeAdImageSize {
    SIZE_72X72,
    SIZE_100X100,
    /** Default size */
    SIZE_150X150,
    SIZE_340X340,
    /** Not supported by secondaryImageSize, default will be used instead */
    SIZE_1200X628
}

export interface RNStartIoSdk extends HybridObject<{ ios: 'swift', android: 'kotlin' }> {
    initializeSdk(params: InitializeSdkParams): void;
    setUserConsent(currentTimeMillis: number, userConsent: boolean): void;
    setIABUSPrivacyString(iabusPrivacyString: string): void;
    loadAd(adType: AdType): Promise<void>;
    showAd(adResultCallback?: (adResult: AdResultType) => void): void;
    loadNativeAds(numberOfAds: number, primaryImageSize?: number, secondaryImageSize?: number): Promise<NativeAdDetails[]>;
}