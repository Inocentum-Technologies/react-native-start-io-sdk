#include <jni.h>
#include "StartIoSdkOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::nitro::startiosdk::initialize(vm);
}
