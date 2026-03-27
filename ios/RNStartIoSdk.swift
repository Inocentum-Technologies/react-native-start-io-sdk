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
    
    func initializeSdk(params: InitializeSdkParams) throws {
        if(sdkInstance == nil){
            guard let sdk = STAStartAppSDK.sharedInstance() else {
                        fatalError("StartAppSDK initialization failed!")
                    }
            sdk.appID = params.iOSAppId
            if(params.testAd == true){
                sdk.testAdsEnabled = true
            }
            sdkInstance = sdk
            print("✅ StartIo SDK initialized successfully")
        }
    }
    
    func setUserConsent(currentTimeMillis: Double, userConsent: Bool) throws {
        sdkInstance?.setUserConsent(userConsent, forConsentType: "pas", withTimestamp: Int(currentTimeMillis))
        print("StartIo SDK \"pas\" consent set to \(userConsent)")
    }
    
    func setIABUSPrivacyString(iabusPrivacyString: String) throws {
        sdkInstance?.handleExtras { extras in
            extras?.setValue(iabusPrivacyString, forKey: "IABUSPrivacy_String")
        }
        print("StartIo SDK \"IABUS Privacy String\" set to \(iabusPrivacyString)")
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
    
}
