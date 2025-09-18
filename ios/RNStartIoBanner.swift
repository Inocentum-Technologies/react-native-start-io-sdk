//
//  RNStartIoBanner.swift
//  RNStartIoSdk
//
//  Created by Abhijit Dey on 08/09/25.
//

import Foundation
import StartApp
import NitroModules
import UIKit

class RNStartIoBanner: HybridRNStartIoBannerSpec {
    
    private var isBannerAdLoading = false
    var currentBannerDelegate: BannerDelegate?
    
    var format: BannerFormat = BannerFormat.banner
    var adTag: String?
    
    var onLoadError: ((String?) -> Void)?
    var onReceiveAd: (() -> Void)?
    var onFailedToReceiveAd: (() -> Void)?
    var onImpression: (() -> Void)?
    var onClick: (() -> Void)?
    var onDisappear: (() -> Void) = {}
    
    var view: UIView = UIView()
    
    func afterUpdate() {
        requestBanner()
    }
    
    private func requestBanner(){
        guard !isBannerAdLoading else { return }
        isBannerAdLoading = true
        
        let bannerDelegate = BannerDelegate()
        bannerDelegate.onReceiveAd = onReceiveAd
        bannerDelegate.onFailedToReceiveAd = onFailedToReceiveAd
        bannerDelegate.onImpression = onImpression
        bannerDelegate.onClick = onClick
        bannerDelegate.loadingComplete = {
            self.isBannerAdLoading = false
        }
        currentBannerDelegate = bannerDelegate
        
        let adPreferences = STAAdPreferences()
        if(adTag != nil){
            adPreferences.adTag = adTag
        }
        
        let bannerSize: STABannerSize = {
            switch format {
            case .mrec:
                return STA_MRecAdSize_300x250
            case .cover:
                return STA_CoverAdSize
            default:
                return STA_PortraitAdSize_320x50
            }
        }()
        
        let bannerView = STABannerView(
                size: bannerSize,
                autoOrigin: STAAdOrigin_Top,
                adPreferences: adPreferences,
                withDelegate: bannerDelegate
            )
        
        guard let bannerView = bannerView else {
            isBannerAdLoading = false
            onLoadError?("Banner ad load error")
            return
        }

        view.addSubview(bannerView)
    }
        
}
