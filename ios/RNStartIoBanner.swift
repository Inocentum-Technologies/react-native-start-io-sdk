//
//  RNStartIoBanner.swift
//  RNStartIoSdk
//
//  Created by Abhijit Dey on 08/09/25.
//

import Foundation

class RNStartIoBanner: HybridRNStartIoBannerSpec {
    
    var format: BannerFormat = BannerFormat.banner
    
    var adTag: String? = nil
    
    var onLoadError: ((String?) -> Void)? = nil
    
    var onReceiveAd: (() -> Void)? = nil
    
    var onFailedToReceiveAd: (() -> Void)? = nil
    
    var onImpression: (() -> Void)? = nil
    
    var onClick: (() -> Void)? = nil
    
    var view: UIView = UIView()
        
}
