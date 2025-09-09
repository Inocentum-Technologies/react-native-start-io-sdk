//
//  RNStartIoNativeAd.swift
//  RNStartIoSdk
//
//  Created by Abhijit Dey on 08/09/25.
//

import Foundation
import StartApp
import NitroModules
import UIKit

class RNStartIoNativeAd: HybridRNStartIoNativeAdSpec {
    
    private var isNativeAdLoading = false
    var currentLoadShowDelegate: LoadShowAdDelegate?

    var onLoadAd: (NativeAdDetails) -> Void = { _ in }
    
    var onLoadError: ((String) -> Void)? = nil
    
    var view: UIView = UIView()
    
    override init() {
        super.init()
        requestNativeAd()
    }
    
    private func requestNativeAd(){
        guard !isNativeAdLoading else { return }
        isNativeAdLoading = true
        
        let loadShowAdDelegate = LoadShowAdDelegate()
        let startAppNativeAd = STAStartAppNativeAd()
        currentLoadShowDelegate = loadShowAdDelegate
        
        loadShowAdDelegate.loadPromise.then({
            guard let adDetails = startAppNativeAd.adsDetails,
                  !(adDetails.count < 1),
                  let nativeAdDetails = adDetails[0] as? STANativeAdDetails else {
                self.onLoadError?("No ads available")
                self.isNativeAdLoading = false
                return
            }
            nativeAdDetails.registerView(forImpressionAndClick: self.view)
            self.onLoadAd(
                NativeAdDetails(
                    title: nativeAdDetails.title ?? "",
                    description: nativeAdDetails.description ?? "",
                    rating: nativeAdDetails.rating != nil ? nativeAdDetails.rating.doubleValue : 0,
                    imageUrl: nativeAdDetails.imageUrl,
                    secondaryImageUrl: nativeAdDetails.secondaryImageUrl,
                    installs: "",
                    category: nativeAdDetails.category ?? "",
                    packageName: "",
                    campaignAction: nativeAdDetails.clickToInstall == "install" ?
                                        CampaignAction.openMarket :
                                        CampaignAction.launchApp,
                    callToAction: nativeAdDetails.callToAction ?? ""
                )
            )
            self.isNativeAdLoading = false
        }).catch({error in
            self.onLoadError?(error.localizedDescription)
            self.isNativeAdLoading = true;
        })
        
        startAppNativeAd.load(withDelegate: loadShowAdDelegate)
    }
    
}
