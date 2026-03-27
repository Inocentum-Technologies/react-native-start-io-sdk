import type { HybridObject } from "react-native-nitro-modules";

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

export interface InitializeSdkParams {
    androidAppId: string;
    iOSAppId: string;
    testAd?: boolean;
    /** @deprecated */
    returnAd?: boolean;
}

export interface RNStartIoSdk extends HybridObject<{ ios: 'swift', android: 'kotlin' }> {
    initializeSdk(params: InitializeSdkParams): void;
    setUserConsent(currentTimeMillis: number, userConsent: boolean): void;
    setIABUSPrivacyString(iabusPrivacyString: string): void;
    loadAd(adType: AdType): Promise<void>;
    showAd(adResultCallback?: (adResult: AdResultType) => void): void;
}