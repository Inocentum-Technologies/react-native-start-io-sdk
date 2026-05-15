package com.rnstartiosdk

import android.annotation.SuppressLint
import android.content.Context
import android.widget.LinearLayout
import androidx.annotation.Keep
import com.facebook.common.internal.DoNotStrip

@DoNotStrip
@Keep
@SuppressLint("ViewConstructor")
class CustomView(
    context: Context,
    private val visibilityChanged: (Boolean) -> Unit
): LinearLayout(context) {

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        visibilityChanged(true)
    }

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        visibilityChanged(false)
    }
}