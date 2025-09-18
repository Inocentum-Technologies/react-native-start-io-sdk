//
//  BannerDelegate.swift
//  Pods
//
//  Created by Abhijit Dey on 09/09/25.
//

import Foundation
import StartApp

class BannerDelegate: NSObject, STABannerDelegateProtocol {
    
    var onReceiveAd: (() -> Void)?
    var onFailedToReceiveAd: (() -> Void)?
    var onImpression: (() -> Void)?
    var onClick: (() -> Void)?
    var loadingComplete: (() -> Void)?
    
    func didDisplayBannerAd(_ banner: STABannerViewBase) {
        print("✅ Banner Ad loaded successfully")
        onReceiveAd?()
        loadingComplete?()
    }
    
    func didClickBannerAd(_ banner: STABannerViewBase) {
        print("✅ Banner Ad clicked")
        onClick?()
    }
    
    func didSendImpression(forBannerAd banner: STABannerViewBase) {
        print("✅ Banner Ad send impression")
        onImpression?()
    }
    
    func failedLoadBannerAd(_ banner: STABannerViewBase, withError error: any Error) {
        print("❌ Banner Ad failed to load: \(error.localizedDescription)")
        onFailedToReceiveAd?()
        loadingComplete?()
    }
}
