package com.rnstartiosdk

import android.util.Log
import android.view.View
import com.facebook.react.uimanager.ThemedReactContext
import com.margelo.nitro.rnstartiosdk.CampaignAction
import com.margelo.nitro.rnstartiosdk.HybridRNStartIoNativeAdSpec
import com.margelo.nitro.rnstartiosdk.NativeAdDetails
import com.startapp.sdk.ads.nativead.StartAppNativeAd
import com.startapp.sdk.adsbase.Ad
import com.startapp.sdk.adsbase.adlisteners.AdEventListener

class RNStartIoNativeAd(val context: ThemedReactContext): HybridRNStartIoNativeAdSpec() {
    private companion object {
        val LOG_TAG: String = RNStartIoNativeAd::class.java.simpleName
    }

    override val view: View = View(context)
    override var onLoadAd: (NativeAdDetails) -> Unit = {}
    override var onLoadError: ((String) -> Unit)? = {}

    init {
        val nativeAd = StartAppNativeAd(context)
        nativeAd.loadAd(object : AdEventListener {
            override fun onReceiveAd(ad: Ad) {
                Log.v(LOG_TAG, "loadNative: onReceiveAd")

                val nativeAds = nativeAd.nativeAds
                if (nativeAds != null && nativeAds.isNotEmpty()) {
                    val nativeAdDetails = nativeAds[0]
                    if (nativeAdDetails != null) {
                        nativeAdDetails.registerViewForInteraction(view)
                        onLoadAd(
                            NativeAdDetails(
                                nativeAdDetails.title,
                                nativeAdDetails.description,
                                nativeAdDetails.rating.toDouble(),
                                nativeAdDetails.imageUrl,
                                nativeAdDetails.secondaryImageUrl,
                                nativeAdDetails.installs,
                                nativeAdDetails.category,
                                nativeAdDetails.packageName,
                                if (nativeAdDetails.campaignAction.name == CampaignAction.LAUNCH_APP.name)
                                    CampaignAction.LAUNCH_APP
                                else CampaignAction.OPEN_MARKET,
                                nativeAdDetails.callToAction
                            )
                        )
                    } else {
                        onLoadError?.invoke("No ads available")
                    }
                } else {
                    onLoadError?.invoke("No ads available")
                }
            }

            override fun onFailedToReceiveAd(ad: Ad?) {
                Log.v(LOG_TAG, "loadNative: onFailedToReceiveAd: " + (ad?.errorMessage))
                onLoadError?.invoke(ad?.errorMessage ?: "Failed to load error")
            }
        })
    }
}