//
//  RNStartIoNativeAdTouchArea.swift
//  RNStartIoSdk
//
//  Created by Abhijit Dey on 07/04/26.
//

import Foundation
import StartApp
import NitroModules
import UIKit

class RNStartIoNativeAdTouchArea: HybridRNStartIoNativeAdTouchAreaSpec {
    
    var adIndex: Double = -1.0
    
    var view: UIView = UIView()
    
    func afterUpdate() {
        if adIndex >= 0 {
            DispatchQueue.main.async {
                NativeAdState.shared.registerView(self.adIndex, view: self.view)
            }
        }
     }
    
}
