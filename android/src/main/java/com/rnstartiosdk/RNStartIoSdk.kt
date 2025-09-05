package com.rnstartiosdk

import android.util.Log
import com.margelo.nitro.NitroModules.Companion.applicationContext
import com.margelo.nitro.core.Promise
import com.margelo.nitro.rnstartiosdk.AdResultType
import com.margelo.nitro.rnstartiosdk.AdType
import com.margelo.nitro.rnstartiosdk.HybridRNStartIoSdkSpec
import com.margelo.nitro.rnstartiosdk.InitializeSdkParams
import com.startapp.sdk.adsbase.Ad
import com.startapp.sdk.adsbase.StartAppAd
import com.startapp.sdk.adsbase.StartAppSDK
import com.startapp.sdk.adsbase.adlisteners.AdDisplayListener
import com.startapp.sdk.adsbase.adlisteners.AdEventListener
import kotlinx.coroutines.flow.MutableStateFlow

class RNStartIoSdk : HybridRNStartIoSdkSpec() {
    private companion object {
        val LOG_TAG: String = RNStartIoSdk::class.java.simpleName
        val initializedFlow = MutableStateFlow<Boolean?>(false)
    }

    private val interstitialAdFlow = MutableStateFlow<StartAppAd?>(null)

    override fun initializeSdk(params: InitializeSdkParams) {
        StartAppSDK.setTestAdsEnabled(params.testAd == true)
        if (initializedFlow.value != true) {
            applicationContext?.applicationContext?.let {
                StartAppSDK.initParams(it, params.androidAppId)
                    .setReturnAdsEnabled(params.returnAd == true)
                    .setCallback {
                        initializedFlow.value = true
                        Log.d(LOG_TAG, "Start.io SDK Initialized")
                    }
                    .init()
            }
        }
    }

    override fun loadAd(adType: AdType): Promise<Unit> {
        val promise = Promise<Unit>()
        applicationContext?.applicationContext?.let { context ->
            StartAppAd(context).let {
                it.loadAd(convertAdTypeEnumSafe(adType), object : AdEventListener {
                    override fun onReceiveAd(ad: Ad) {
                        Log.v(LOG_TAG, "loadInterstitial: onReceiveAd")

                        interstitialAdFlow.value = it
                        promise.resolve(Unit)
                    }

                    override fun onFailedToReceiveAd(ad: Ad?) {
                        Log.v(LOG_TAG, "loadInterstitial: onFailedToReceiveAd: ${ad?.errorMessage}")

                        interstitialAdFlow.value = null
                        promise.reject(Throwable("Ad load failed"))
                    }
                })
            }
        } ?: run {
            initializedFlow.value = null
            promise.reject(
                Throwable("Ad load failed, unable to get application context")
            )
        }
        return promise
    }

    override fun showAd(adResultCallback: ((AdResultType) -> Unit)?) {
        interstitialAdFlow.value?.let {
            interstitialAdFlow.value = null

            it.setVideoListener {
                Log.v(LOG_TAG, "showInterstitial: User gained a reward")
                adResultCallback?.invoke(AdResultType.ADREWARDED)
            }

            it.showAd(object : AdDisplayListener {
                override fun adHidden(ad: Ad) {
                    Log.v(LOG_TAG, "showInterstitial: adHidden")
                    adResultCallback?.invoke(AdResultType.ADHIDDEN)
                }

                override fun adDisplayed(ad: Ad) {
                    Log.v(LOG_TAG, "showInterstitial: adDisplayed")
                    adResultCallback?.invoke(AdResultType.ADDISPLAYED)
                }

                override fun adClicked(ad: Ad) {
                    Log.v(LOG_TAG, "showInterstitial: adClicked")
                    adResultCallback?.invoke(AdResultType.ADCLICKED)
                }

                override fun adNotDisplayed(ad: Ad) {
                    Log.v(LOG_TAG, "showInterstitial: adNotDisplayed")
                    adResultCallback?.invoke(AdResultType.ADNOTDISPLAYED)
                }
            })
        } ?: run {
            adResultCallback?.invoke(AdResultType.ADNOTDISPLAYED)
        }
    }

    private fun convertAdTypeEnumSafe(source: AdType): StartAppAd.AdMode {
        return StartAppAd.AdMode.entries.find { it.name == source.name }
            ?: StartAppAd.AdMode.AUTOMATIC
    }
}