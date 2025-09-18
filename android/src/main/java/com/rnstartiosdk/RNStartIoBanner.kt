package com.rnstartiosdk

import android.util.Log
import android.view.View
import com.facebook.react.uimanager.ThemedReactContext
import com.margelo.nitro.rnstartiosdk.BannerFormat
import com.margelo.nitro.rnstartiosdk.HybridRNStartIoBannerSpec
import com.startapp.sdk.ads.banner.BannerCreator
import com.startapp.sdk.ads.banner.BannerListener
import com.startapp.sdk.ads.banner.BannerRequest
import com.startapp.sdk.ads.banner.BannerFormat as StartIOBannerFormat
import com.startapp.sdk.adsbase.model.AdPreferences
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.launch

class RNStartIoBanner(val context: ThemedReactContext) : HybridRNStartIoBannerSpec() {
    private companion object {
        val LOG_TAG: String = RNStartIoBanner::class.java.simpleName
    }

    private val isAdLoading = MutableStateFlow(false)
    private val uiScope = CoroutineScope(Dispatchers.Main)
    private val bannerRequest = BannerRequest(context)
    private var customView = CustomView(context) { visible ->
        if (visible) onViewAppear()
        else onViewDisappear()
    }

    override var view = customView

    override var format: BannerFormat = BannerFormat.BANNER
        set(value) {
            field = value
            uiScope.launch {
                updateFormat()
            }
        }
    override var adTag: String? = null
        set(value) {
            field = value
            uiScope.launch {
                updateAdTag()
            }
        }

    override var onLoadError: ((String?) -> Unit)? = {}
    override var onReceiveAd: (() -> Unit)? = {}
    override var onFailedToReceiveAd: (() -> Unit)? = {}
    override var onImpression: (() -> Unit)? = {}
    override var onClick: (() -> Unit)? = {}
    override var onDisappear: () -> Unit = {}

    private fun updateFormat() {
        bannerRequest.setAdFormat(convertBannerFormatEnumSafe(format))
    }

    private fun updateAdTag() {
        val adPreferences = AdPreferences()
        if (adTag != null) {
            adPreferences.adTag = adTag
        }
        bannerRequest.setAdPreferences(adPreferences)
        onViewAppear()
    }

    private fun convertBannerFormatEnumSafe(source: BannerFormat): StartIOBannerFormat {
        return StartIOBannerFormat.entries.find {
            it.name == source.name
        } ?: StartIOBannerFormat.BANNER
    }

    private fun onViewAppear() {
        try {
            bannerRequest.load { creator: BannerCreator?, error: String? ->
                if (creator != null) {
                    val adView = creator.create(context, object : BannerListener {
                        override fun onReceiveAd(banner: View) {
                            Log.v(LOG_TAG, "loadAdView: onReceiveAd")
                            onReceiveAd?.invoke()
                        }

                        override fun onFailedToReceiveAd(banner: View) {
                            Log.v(LOG_TAG, "loadAdView: onFailedToReceiveAd")
                            onFailedToReceiveAd?.invoke()
                        }

                        override fun onImpression(banner: View) {
                            Log.v(LOG_TAG, "loadAdView: onImpression")
                            onImpression?.invoke()
                        }

                        override fun onClick(banner: View) {
                            Log.v(LOG_TAG, "loadAdView: onClick")
                            onClick?.invoke()
                        }
                    })

                    uiScope.launch {
                        customView.addView(adView)
                    }
                } else {
                    Log.e(LOG_TAG, "loadAdView: error: $error")
                    onViewDisappear()
                    onLoadError?.invoke(error)
                    isAdLoading.value = false
                }
            }
        } catch (e: Throwable) {
            Log.e(LOG_TAG, "Failed to request banner ad!", e)
        }
    }

    private fun onViewDisappear() {
        uiScope.launch {
            try {
                customView.removeAllViews()
                onDisappear()
            } catch (e: Throwable) {
                Log.e(LOG_TAG, "Failed to drop banner ad!", e)
            }
        }
    }
}