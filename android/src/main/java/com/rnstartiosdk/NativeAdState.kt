package com.rnstartiosdk

import android.view.View
import androidx.annotation.Keep
import com.facebook.common.internal.DoNotStrip
import com.startapp.sdk.ads.nativead.NativeAdDetails

@DoNotStrip
@Keep
object NativeAdState {
    var nativeAdDetails: ArrayList<NativeAdDetails>? = null

    fun updateState(nativeAdDetails: ArrayList<NativeAdDetails>) {
        this.nativeAdDetails = nativeAdDetails
    }

    fun registerView(index: Double, view: View) {
        nativeAdDetails?.getOrNull(index.toInt())?.registerViewForInteraction(view)
    }
}