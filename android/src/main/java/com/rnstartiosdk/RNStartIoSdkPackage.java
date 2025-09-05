package com.rnstartiosdk;

import androidx.annotation.Nullable;
import androidx.annotation.NonNull;

import com.facebook.react.BaseReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.uimanager.ViewManager;
import com.margelo.nitro.rnstartiosdk.RNStartIoSdkOnLoad;
import com.margelo.nitro.rnstartiosdk.views.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class RNStartIoSdkPackage extends BaseReactPackage {
  @Nullable
  @Override
  public NativeModule getModule(@NonNull String name, @NonNull ReactApplicationContext reactContext) {
    return null;
  }

  @NonNull
  @Override
  public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
    List<ViewManager> viewManagers = new ArrayList<>();
    viewManagers.add(new HybridRNStartIoBannerManager());
    viewManagers.add(new HybridRNStartIoNativeAdManager());
    return viewManagers;
  }

  @NonNull
  @Override
  public ReactModuleInfoProvider getReactModuleInfoProvider() {
    return HashMap::new;
  }

  static {
    RNStartIoSdkOnLoad.initializeNative();
  }
}
