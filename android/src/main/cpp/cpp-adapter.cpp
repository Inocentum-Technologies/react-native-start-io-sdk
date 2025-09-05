#include <jni.h>
#include "RNStartIoSdkOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::nitro::rnstartiosdk::initialize(vm);
}
