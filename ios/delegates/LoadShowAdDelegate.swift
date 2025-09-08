//
//  LoadAdDelegate.swift
//  Pods
//
//  Created by Abhijit Dey on 08/09/25.
//

import StartApp
import NitroModules

class LoadShowAdDelegate: NSObject, STADelegateProtocol {
    var loadPromise = Promise<Void>()
    var adResultCallback: ((AdResultType) -> Void)?

    func didLoad(_ ad: STAAbstractAd!) {
        print("✅ StartApp Ad loaded successfully")
        loadPromise.resolve(withResult: ())
    }

    func failedLoad(_ ad: STAAbstractAd!, withError error: (any Error)!) {
        print("❌ StartApp Ad failed to load: \(error.localizedDescription)")
        loadPromise.reject(withError: error)
    }
    
    func didShow(_ ad: STAAbstractAd!) {
        print("✅ StartApp Ad displayed successfully")
        adResultCallback?(AdResultType.addisplayed)
    }
    
    func failedShow(_ ad: STAAbstractAd!, withError error: (any Error)!) {
        print("❌ StartApp Ad failed to show: \(error.localizedDescription)")
        adResultCallback?(AdResultType.adnotdisplayed)
    }
    
    func didClose(_ ad: STAAbstractAd) {
        print("✅ StartApp Ad closed")
        adResultCallback?(AdResultType.adhidden)
    }

    func didClick(_ ad: STAAbstractAd) {
        print("✅ StartApp Ad clicked")
        adResultCallback?(AdResultType.adclicked)
    }
    
    func didCompleteVideo(_ ad: STAAbstractAd) {
        print("✅ StartApp rewarded video had been completed")
        adResultCallback?(AdResultType.adrewarded)
    }
}
