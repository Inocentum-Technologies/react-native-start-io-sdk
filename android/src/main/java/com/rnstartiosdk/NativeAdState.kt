package com.rnstartiosdk

import android.view.View
import com.startapp.sdk.ads.nativead.NativeAdDetails

object NativeAdState {
    var nativeAdDetails: ArrayList<NativeAdDetails>? = null

    fun updateState(nativeAdDetails: ArrayList<NativeAdDetails>) {
        this.nativeAdDetails = nativeAdDetails
    }

    fun registerView(index: Double, view: View) {
        nativeAdDetails?.getOrNull(index.toInt())?.registerViewForInteraction(view)
    }
}