//
//  CustomView.swift
//  Pods
//
//  Created by Abhijit Dey on 18/09/25.
//

import UIKit

class CustomView: UIView {

    private var didAppearCallback: (() -> Void)?
    private var hasAppeared = false

    func didAppear(_ callback: @escaping () -> Void) {
        didAppearCallback = callback
        // If already appeared, fire immediately
        if hasAppeared {
            callback()
        }
    }

    override func didMoveToWindow() {
        super.didMoveToWindow()
        if window != nil && !hasAppeared {
            hasAppeared = true
            didAppearCallback?()
        }
    }
}
