//
//  RNStartIoNativeAd.swift
//  RNStartIoSdk
//
//  Created by Abhijit Dey on 08/09/25.
//

import Foundation

class RNStartIoNativeAd: HybridRNStartIoNativeAdSpec {
    
    var onLoadAd: (NativeAdDetails) -> Void = { _ in }
    
    var onLoadError: ((String) -> Void)? = nil
    
    var view: UIView = UIView()
    
}
