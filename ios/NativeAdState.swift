//
//  NativeAdState.swift
//  RNStartIoSdk
//
//  Created by Abhijit Dey on 07/04/26.
//

import Foundation
import StartApp
import UIKit

class NativeAdState {
    static let shared = NativeAdState()
    private init() {}

    var nativeAds: [STANativeAdDetails]?

    func updateState(_ nativeAds: [STANativeAdDetails]) {
        self.nativeAds = nativeAds
    }

    func registerView(_ index: Double, view: UIView) {
        let adIndex = Int(index)
        if let unwrappedNativeAds = nativeAds,
            unwrappedNativeAds.indices.contains(adIndex)
        {
            unwrappedNativeAds[adIndex].registerView(
                forImpressionAndClick: view
            )
        }
    }
}
