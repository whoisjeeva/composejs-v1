package ‗PACKAGE_NAME‗.integarate

import android.annotation.SuppressLint
import android.view.ViewGroup
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.runtime.Composable
import androidx.compose.ui.viewinterop.AndroidView

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun Integration() {
    AndroidView(factory = { context ->
        val hook: Hook = Hook(context)
        WebView(context).apply {
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
            settings.apply {
                javaScriptEnabled = true
            }
            webViewClient = WebViewClient()

            hook.webView = this
            addJavascriptInterface(hook, "Android")
            loadUrl("file:///android_asset/index.html")

        }
    }, update = {
        it.loadUrl("file:///android_asset/index.html")
    })
}