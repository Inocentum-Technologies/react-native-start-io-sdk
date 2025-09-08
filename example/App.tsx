import React, { useState, useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';

import {
  // SDK
  initializeStartIoSdk,
  loadAd,
  showAd,
  AdType,
  AdResultType,

  // Banners
  StartIoBannerAd,
  StartIoMrecAd,
  StartIoCoverAd,

  // Native
  StartIoNativeAd,
  NativeAdDetails
} from 'react-native-start-io-sdk';

const ANDROID_APP_ID = '205489527';
const IOS_APP_ID = '205489527';

// ✅ Initialize SDK
initializeStartIoSdk({
  androidAppId: ANDROID_APP_ID,
  iOSAppId: IOS_APP_ID,
  testAd: __DEV__, // use test ads in dev
  returnAd: true,  // show return ads by default
});

const App: React.FC = () => {
  const [nativeAdData, setNativeAdData] = useState<NativeAdDetails | null>(null);
  const [lastInterstitialResult, setLastInterstitialResult] = useState<AdResultType | null>(null);

  // Helper to load + show any ad type
  const loadAndShow = useCallback(async (type: AdType) => {
    try {
      await loadAd(type);
      showAd((result) => {
        setLastInterstitialResult(result);
        if (result === AdResultType.AdRewarded) {
          Alert.alert('Rewarded', 'User earned a reward!');
        }
      });
    } catch (e) {
      Alert.alert('Ad Error', 'Failed to load/show ad.');
    }
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>react-native-start-io-sdk — Example</Text>
        <Text style={styles.subheader}>
          Platform: {Platform.OS.toUpperCase()}
        </Text>

        {/* Interstitial / Video / Rewarded Controls */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Load & Show Interstitial/Video Ads</Text>

          <View style={styles.row}>
            <View style={styles.button}>
              <Button
                title="Automatic"
                onPress={() => loadAndShow(AdType.AUTOMATIC)}
              />
            </View>
            <View style={styles.button}>
              <Button
                title="Fullpage"
                onPress={() => loadAndShow(AdType.FULLPAGE)}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.button}>
              <Button
                title="Video"
                onPress={() => loadAndShow(AdType.VIDEO)}
              />
            </View>
            <View style={styles.button}>
              <Button
                title="Rewarded"
                onPress={() => loadAndShow(AdType.REWARDED_VIDEO)}
                color="#0A7"
              />
            </View>
          </View>

          <Text style={styles.result}>
            Last result: {lastInterstitialResult ? AdResultType[lastInterstitialResult] : '—'}
          </Text>
        </View>

        {/* MREC Ad Example */}
        {/* <View style={styles.card}>
          <Text style={styles.cardTitle}>MREC (300x250)</Text>
          <StartIoMrecAd
            adTag="example_mrec"
            onReceiveAd={() => console.log('MREC received')}
            onImpression={() => console.log('MREC impression')}
            onClick={() => console.log('MREC clicked')}
            onLoadError={(err) => console.log('MREC load error', err)}
            onFailedToReceiveAd={() => console.log('MREC failed')}
            style={{ alignSelf: 'center', marginVertical: 8 }}
          />
        </View> */}

        {/* Cover Ad Example */}
        {/* <View style={styles.card}>
          <Text style={styles.cardTitle}>Cover (300x157)</Text>
          <StartIoCoverAd
            adTag="example_cover"
            onReceiveAd={() => console.log('Cover received')}
            onImpression={() => console.log('Cover impression')}
            onClick={() => console.log('Cover clicked')}
            onLoadError={(err) => console.log('Cover load error', err)}
            onFailedToReceiveAd={() => console.log('Cover failed')}
            style={{ alignSelf: 'center', marginVertical: 8 }}
          />
        </View> */}

        {/* Native Ad Example */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Native Ad (overlay + custom UI)</Text>
          <View style={styles.nativeContainer}>
            {nativeAdData ? (
              <View style={styles.nativeContent}>
                {nativeAdData.imageUrl ? (
                  <Image
                    source={{ uri: nativeAdData.imageUrl }}
                    style={styles.nativeImage}
                  />
                ) : null}
                <Text style={styles.nativeTitle} numberOfLines={1}>
                  {nativeAdData.title}
                </Text>
                <Text style={styles.nativeDesc} numberOfLines={2}>
                  {nativeAdData.description}
                </Text>
                <Text style={styles.nativeMeta}>
                  {nativeAdData.category} • ⭐ {nativeAdData.rating} • {nativeAdData.installs} installs
                </Text>
                <View style={styles.ctaButton}>
                  <Text style={styles.ctaText}>{nativeAdData.callToAction}</Text>
                </View>
              </View>
            ) : (
              <View style={[styles.nativeContent, styles.nativePlaceholder]}>
                <Text style={styles.nativeTitle}>Loading native ad…</Text>
                <Text style={styles.nativeDesc}>
                  Your UI renders here using adData from onLoadAd.
                </Text>
              </View>
            )}

            {/* Absolutely-positioned overlay to capture native clicks */}
            {/* <StartIoNativeAd
              onLoadAd={(data) => {
                setNativeAdData(data);
                console.log('Native ad loaded', data);
              }}
              onLoadError={(err) => {
                console.log('Native ad error', err);
              }}
            /> */}
          </View>
        </View>

        {/* Spacer */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed Banner at bottom */}
      <View style={styles.bannerBar}>
        {/* <StartIoBannerAd
          adTag="example_banner_bottom"
          onReceiveAd={() => console.log('Banner received')}
          onImpression={() => console.log('Banner impression')}
          onClick={() => console.log('Banner clicked')}
          onLoadError={(err) => console.log('Banner load error', err)}
          onFailedToReceiveAd={() => console.log('Banner failed')}
        /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', paddingVertical: 40 },
  scroll: { padding: 16, paddingBottom: 32 },
  header: { color: '#e2e8f0', fontSize: 20, fontWeight: '700' },
  subheader: { color: '#94a3b8', marginBottom: 16, marginTop: 4 },

  card: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#1f2937',
  },
  cardTitle: { color: '#f1f5f9', fontWeight: '700', marginBottom: 8 },

  row: { flexDirection: 'row', gap: 12, marginTop: 8 },
  button: { flex: 1 },

  result: { color: '#94a3b8', marginTop: 12 },

  bannerBar: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  nativeContainer: {
    position: 'relative',
    width: 300,
    height: 250,
    alignSelf: 'center',
  },
  nativeContent: {
    flex: 1,
    backgroundColor: '#0b1220',
    borderRadius: 10,
    padding: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#23324a',
    overflow: 'hidden',
  },
  nativePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  nativeImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  nativeTitle: { color: '#e2e8f0', fontWeight: '700', fontSize: 16 },
  nativeDesc: { color: '#94a3b8', marginTop: 4 },
  nativeMeta: { color: '#64748b', marginTop: 6, fontSize: 12 },
  ctaButton: {
    marginTop: 10,
    backgroundColor: '#22c55e',
    borderRadius: 8,
  },
  ctaText: { color: '#052e16', fontWeight: '800' },
});

export default App;
