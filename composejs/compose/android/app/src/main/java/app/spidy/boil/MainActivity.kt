package app.spidy.boil

import android.annotation.SuppressLint
import android.content.res.Configuration
import android.os.Bundle
import android.util.Log
import android.view.ViewGroup
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Surface
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.viewinterop.AndroidView
import androidx.webkit.WebSettingsCompat
import androidx.webkit.WebSettingsCompat.FORCE_DARK_OFF
import androidx.webkit.WebSettingsCompat.FORCE_DARK_ON
import androidx.webkit.WebViewFeature
import app.spidy.boil.ui.theme.BoilTheme
import com.google.accompanist.systemuicontroller.rememberSystemUiController

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            BoilTheme {
                // A surface container using the 'background' color from the theme
                Surface(color = MaterialTheme.colors.background) {
                    App()
                }
            }
        }
    }
}

@Composable
fun App() {
    val systemUiController = rememberSystemUiController()

    val boilInterface = BoilInterface(LocalContext.current)
    boilInterface.changeStatusBarColor = { color, darkIcons ->
        Log.d("hello", color.toString())
        systemUiController.setStatusBarColor(Color(color.r, color.g, color.b, color.a), darkIcons)
    }

    Box(modifier = Modifier.fillMaxSize()) {
        WebPage(url = "file:///android_asset/index.html", boilInterface)
    }
}

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun WebPage(url: String, coreInterface: BoilInterface) {
    AndroidView(factory = { context ->
        WebView(context).apply {
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
            settings.apply {
                javaScriptEnabled = true
            }
            webViewClient = WebViewClient()

            coreInterface.webView = this
            addJavascriptInterface(coreInterface, "Android")
            loadUrl(url)

        }
    }, update = {
        it.loadUrl(url)
    })
}
