//
//  RNStartIoSdk.swift
//  Pods
//
//  Created by Abhijit Dey on 8/9/2025.
//

import Foundation
import NitroModules
import StartApp

class RNStartIoSdk: HybridRNStartIoSdkSpec {

    lazy private var sdkInstance: STAStartAppSDK? = nil
    lazy var adLoader = STAStartAppAd()
    var currentLoadShowDelegate: LoadShowAdDelegate?
    var currentLoadNativeAdDelegate: LoadShowAdDelegate?

    func initializeSdk(params: InitializeSdkParams) throws {
        if sdkInstance == nil {
            guard let sdk = STAStartAppSDK.sharedInstance() else {
                fatalError("StartAppSDK initialization failed!")
            }
            sdk.appID = params.iOSAppId
            if params.testAd == true {
                sdk.testAdsEnabled = true
            }
            sdkInstance = sdk
            print("✅ StartIo SDK initialized successfully")
        }
    }

    func setUserConsent(currentTimeMillis: Double, userConsent: Bool) throws {
        sdkInstance?.setUserConsent(
            userConsent,
            forConsentType: "pas",
            withTimestamp: Int(currentTimeMillis)
        )
        print("StartIo SDK \"pas\" consent set to \(userConsent)")
    }

    func setIABUSPrivacyString(iabusPrivacyString: String) throws {
        sdkInstance?.handleExtras { extras in
            extras?.setValue(iabusPrivacyString, forKey: "IABUSPrivacy_String")
        }
        print(
            "StartIo SDK \"IABUS Privacy String\" set to \(iabusPrivacyString)"
        )
    }

    func loadAd(adType: AdType) throws -> Promise<Void> {
        let loadAdDelegate = LoadShowAdDelegate()
        currentLoadShowDelegate = loadAdDelegate

        DispatchQueue.main.async {
            switch adType {
            case .video:
                self.adLoader?.loadVideoAd(withDelegate: loadAdDelegate)
            case .rewardedVideo:
                self.adLoader?.loadRewardedVideoAd(withDelegate: loadAdDelegate)
            default:
                self.adLoader?.load(withDelegate: loadAdDelegate)
            }
        }
        return loadAdDelegate.loadPromise
    }

    func showAd(adResultCallback: ((AdResultType) -> Void)?) throws {
        currentLoadShowDelegate?.adResultCallback = adResultCallback
        DispatchQueue.main.async {
            self.adLoader?.show()
        }
    }

    func loadNativeAds(
        numberOfAds: Double,
        primaryImageSize: Double?,
        secondaryImageSize: Double?
    ) throws -> Promise<[NativeAdDetails]> {
        let nativeAdsPromise = Promise<[NativeAdDetails]>()

        let loadNativeAdDelegate = LoadShowAdDelegate()
        let startAppNativeAd = STAStartAppNativeAd()
        currentLoadNativeAdDelegate = loadNativeAdDelegate

        let pref: STANativeAdPreferences = STANativeAdPreferences()
        pref.adsNumber = Int(numberOfAds)
        if let unwrappedPrimaryImageSize = primaryImageSize,
            let bitmapSize = STANativeAdBitmapSize(
                rawValue: Int(unwrappedPrimaryImageSize)
            )
        {
            pref.primaryImageSize = bitmapSize
        }
        if let unwrappedSecondaryImageSize = secondaryImageSize,
            let bitmapSize = STANativeAdBitmapSize(
                rawValue: Int(unwrappedSecondaryImageSize)
            )
        {
            pref.secondaryImageSize = bitmapSize
        }

        loadNativeAdDelegate.loadPromise.then({
            if let adDetails = startAppNativeAd.adsDetails
                as? [STANativeAdDetails],
                adDetails.count > 0
            {
                NativeAdState.shared.updateState(adDetails)

                var nativeAds: [NativeAdDetails] = []
                for nativeAdDetails in adDetails {
                    nativeAds.append(
                        NativeAdDetails(
                            title: nativeAdDetails.title ?? "",
                            description: nativeAdDetails.description ?? "",
                            rating: nativeAdDetails.rating != nil
                                ? nativeAdDetails.rating.doubleValue : 0,
                            imageUrl: nativeAdDetails.imageUrl,
                            secondaryImageUrl: nativeAdDetails
                                .secondaryImageUrl,
                            installs: "",
                            category: nativeAdDetails.category ?? "",
                            packageName: "",
                            campaignAction: nativeAdDetails.clickToInstall
                                == "install"
                                ? CampaignAction.openMarket
                                : CampaignAction.launchApp,
                            callToAction: nativeAdDetails.callToAction ?? ""
                        )
                    )
                }
                nativeAdsPromise.resolve(withResult: nativeAds)
            } else {
                nativeAdsPromise.reject(
                    withError: RuntimeError.error(
                        withMessage: "Unable to load native ads"
                    )
                )
            }
        }).catch({ error in
            nativeAdsPromise.reject(
                withError: RuntimeError.error(
                    withMessage: error.localizedDescription
                )
            )
        })

        DispatchQueue.main.async {
            startAppNativeAd.load(
                withDelegate: loadNativeAdDelegate,
                with: pref
            )
        }
        return nativeAdsPromise
    }

}
