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
import androidx.core.content.edit
import com.margelo.nitro.rnstartiosdk.AdPreferenceGender
import com.margelo.nitro.rnstartiosdk.CampaignAction
import com.margelo.nitro.rnstartiosdk.NativeAdDetails
import com.startapp.sdk.ads.nativead.NativeAdPreferences
import com.startapp.sdk.ads.nativead.StartAppNativeAd
import com.startapp.sdk.adsbase.SDKAdPreferences
import kotlin.collections.isNotEmpty

class RNStartIoSdk : HybridRNStartIoSdkSpec() {
    private companion object {
        val LOG_TAG: String = RNStartIoSdk::class.java.simpleName
        val initializedFlow = MutableStateFlow<Boolean?>(false)
    }

    private val interstitialAdFlow = MutableStateFlow<StartAppAd?>(null)

    override fun initializeSdk(params: InitializeSdkParams) {
        StartAppSDK.setTestAdsEnabled(params.testAd == true)
        if (initializedFlow.value != true && params.androidAppId != null) {
            applicationContext?.applicationContext?.let {
                val sdkAdPreferences = SDKAdPreferences()
                if(params.adPreferences != null) {
                    if(params.adPreferences.age != null)
                        sdkAdPreferences.age = params.adPreferences.age.toString()
                    if(params.adPreferences.gender != null)
                        sdkAdPreferences.gender = if (params.adPreferences.gender == AdPreferenceGender.MALE)
                            SDKAdPreferences.Gender.MALE
                        else
                            SDKAdPreferences.Gender.FEMALE
                }
                StartAppSDK.initParams(it, params.androidAppId)
                    .setReturnAdsEnabled(params.returnAd == true)
                    .setSdkAdPrefs(sdkAdPreferences)
                    .setCallback {
                        initializedFlow.value = true
                        Log.d(LOG_TAG, "Start.io SDK Initialized")
                    }
                    .init()
            }
        }
    }

    override fun setUserConsent(currentTimeMillis: Double, userConsent: Boolean) {
        applicationContext?.applicationContext?.let { context ->
            StartAppSDK.setUserConsent(
                context,
                "pas",
                currentTimeMillis.toLong(),
                userConsent
            )
        }
        Log.d(LOG_TAG, "Start.io SDK user consent set to $userConsent")
    }

    override fun setIABUSPrivacyString(iabusPrivacyString: String) {
        applicationContext?.applicationContext?.let { context ->
            StartAppSDK.getExtras(context)
                .edit {
                    putString("IABUSPrivacy_String", iabusPrivacyString)
                }
        }
        Log.d(LOG_TAG, "Start.io SDK IABUSPrivacy String set to $iabusPrivacyString")
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

    override fun loadNativeAds(
        numberOfAds: Double,
        primaryImageSize: Double?,
        secondaryImageSize: Double?
    ): Promise<Array<NativeAdDetails>> {
        val promise = Promise<Array<NativeAdDetails>>()

        val nativeAd = StartAppNativeAd(applicationContext!!)
        val nativeAdPreferences = NativeAdPreferences()
        nativeAdPreferences.adsNumber = numberOfAds.toInt()
        if (primaryImageSize != null)
            nativeAdPreferences.primaryImageSize = primaryImageSize.toInt()
        if (secondaryImageSize != null)
            nativeAdPreferences.secondaryImageSize = secondaryImageSize.toInt()

        nativeAd.setPreferences(nativeAdPreferences)
        nativeAd.loadAd(object : AdEventListener {
            override fun onReceiveAd(ad: Ad) {
                Log.v(LOG_TAG, "loadNative: onReceiveAds")

                val nativeAds = nativeAd.nativeAds
                if (nativeAds != null && nativeAds.isNotEmpty()) {
                    var adsArray = emptyArray<NativeAdDetails>()
                    for (nativeAd in nativeAds) {
                        val nativeAdDetails = nativeAd
                        adsArray += NativeAdDetails(
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
                    }
                    NativeAdState.updateState(nativeAds)
                    promise.resolve(adsArray)
                } else {
                    promise.reject(Throwable("No ads available"))
                }
            }

            override fun onFailedToReceiveAd(ad: Ad?) {
                Log.v(LOG_TAG, "loadNative: onFailedToReceiveAds: " + (ad?.errorMessage))
                promise.reject(
                    Throwable("Failed to load native ads")
                )
            }
        })
        return promise
    }

    private fun convertAdTypeEnumSafe(source: AdType): StartAppAd.AdMode {
        return StartAppAd.AdMode.entries.find { it.name == source.name }
            ?: StartAppAd.AdMode.AUTOMATIC
    }
}