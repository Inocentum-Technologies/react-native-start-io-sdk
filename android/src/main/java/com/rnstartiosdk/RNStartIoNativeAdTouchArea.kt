package com.rnstartiosdk

import android.view.View
import com.facebook.react.uimanager.ThemedReactContext
import com.margelo.nitro.rnstartiosdk.HybridRNStartIoNativeAdTouchAreaSpec
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class RNStartIoNativeAdTouchArea(val context: ThemedReactContext) : HybridRNStartIoNativeAdTouchAreaSpec() {
    private companion object {
        val LOG_TAG: String = RNStartIoNativeAdTouchArea::class.java.simpleName
    }
    private val uiScope = CoroutineScope(Dispatchers.Main)

    override val view: View = View(context)
    override var adIndex: Double = -1.0
        set(value) {
            field = value
            uiScope.launch {
                if(adIndex >= 0) {
                    NativeAdState.registerView(adIndex, view)
                }
            }
        }
}