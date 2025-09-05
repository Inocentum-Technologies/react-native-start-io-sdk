package com.rnstartiosdk

import android.util.Log
import android.view.View
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.viewinterop.AndroidView
import com.facebook.react.uimanager.ThemedReactContext
import com.margelo.nitro.rnstartiosdk.BannerFormat
import com.margelo.nitro.rnstartiosdk.HybridRNStartIoBannerSpec
import com.startapp.sdk.ads.banner.BannerCreator
import com.startapp.sdk.ads.banner.BannerListener
import com.startapp.sdk.ads.banner.BannerRequest
import com.startapp.sdk.ads.banner.BannerFormat as StartIOBannerFormat
import com.startapp.sdk.adsbase.model.AdPreferences
import kotlinx.coroutines.flow.MutableStateFlow

class RNStartIoBanner(val context: ThemedReactContext): HybridRNStartIoBannerSpec() {
    private companion object {
        val LOG_TAG: String = RNStartIoBanner::class.java.simpleName
    }

    private val isAdLoading = MutableStateFlow(false)
    private var composeView = ComposeView(context)

    override var view = composeView

    override var format: BannerFormat = BannerFormat.BANNER
        set(value) {
            field = value
            requestBanner()
        }
    override var adTag: String? = null
        set(value) {
            field = value
            requestBanner()
        }

    override var onLoadError: ((String?) -> Unit)? = {}
    override var onReceiveAd: (() -> Unit)? = {}
    override var onFailedToReceiveAd: (() -> Unit)? = {}
    override var onImpression: (() -> Unit)? = {}
    override var onClick: (() -> Unit)? = {}


    private fun requestBanner() {
        if (isAdLoading.value) return
        isAdLoading.value = true
        val adPreferences = AdPreferences()

        if (adTag != null) {
            adPreferences.adTag = adTag
        }

        BannerRequest(context)
            .setAdFormat(convertBannerFormatEnumSafe(format))
            .setAdPreferences(adPreferences)
            .load { creator: BannerCreator?, error: String? ->
                if (creator != null) {
                    val adView = creator.create(context, object : BannerListener {
                        override fun onReceiveAd(banner: View) {
                            Log.v(LOG_TAG, "loadAdView: onReceiveAd")
                            onReceiveAd?.invoke()
                            isAdLoading.value = false
                            composeView.invalidate() // Needed for react-native to detect changes
                        }

                        override fun onFailedToReceiveAd(banner: View) {
                            Log.v(LOG_TAG, "loadAdView: onFailedToReceiveAd")
                            onFailedToReceiveAd?.invoke()
                            isAdLoading.value = false
                        }

                        override fun onImpression(banner: View) {
                            Log.v(LOG_TAG, "loadAdView: onImpression")
                            onImpression?.invoke()
                            isAdLoading.value = false
                        }

                        override fun onClick(banner: View) {
                            Log.v(LOG_TAG, "loadAdView: onClick")
                            onClick?.invoke()
                            isAdLoading.value = false
                        }
                    })

                    renderView(adView)
                    isAdLoading.value = false
                } else {
                    Log.e(LOG_TAG, "loadAdView: error: $error")
                    removeAllViews()
                    onLoadError?.invoke(error)
                    isAdLoading.value = false
                }
            }
    }

    private fun renderView(view: View) {
        composeView.setContent {
            AndroidView(
                modifier = Modifier.fillMaxWidth(),
                factory = { view }
            )
        }
    }

    private fun removeAllViews() {
        composeView.removeAllViews()
    }

    private fun convertBannerFormatEnumSafe(source: BannerFormat): StartIOBannerFormat {
        return StartIOBannerFormat.entries.find {
            it.name == source.name
        } ?: StartIOBannerFormat.BANNER
    }
}