package com.startiosdk

import com.margelo.nitro.startiosdk.HybridStartIoSdkSpec

class HybridStartIoSdk: HybridStartIoSdkSpec() {    
    override fun sum(num1: Double, num2: Double): Double {
        return num1 + num2
    }
}
