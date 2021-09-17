package ‗PACKAGE_NAME‗.integarate

import android.content.Context
import android.content.res.Configuration
import android.graphics.Color
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.widget.Toast
import ‗PACKAGE_NAME‗.integarate.Rgba
import com.google.android.material.snackbar.Snackbar
import org.json.JSONObject

class Hook(private val context: Context) {
    var webView: WebView? = null
    var changeStatusBarColor: ((color: Rgba, darkIcons: Boolean) -> Unit)? = null

    @JavascriptInterface
    fun toast(s: String) {
        val json = JSONObject(s)
        var duration = Toast.LENGTH_SHORT

        if (json.has("duration")) {
            duration = when (json.getInt("duration")) {
                0 -> Toast.LENGTH_SHORT
                1 -> Toast.LENGTH_LONG
                else -> Toast.LENGTH_SHORT
            }
        }
        Toast.makeText(context, json.getString("text"), duration).show()
    }

    @JavascriptInterface
    fun snackbar(s: String) {
        val json = JSONObject(s)
        var duration = Snackbar.LENGTH_LONG

        webView?.also { webView ->
            if (json.has("duration")) {
                duration = when (json.getInt("duration")) {
                    0 -> Snackbar.LENGTH_SHORT
                    1 -> Snackbar.LENGTH_LONG
                    2 -> Snackbar.LENGTH_INDEFINITE
                    else -> Snackbar.LENGTH_LONG
                }
            }

            val snack = Snackbar.make(webView, json.getString("text"), duration)
            snack.setActionTextColor(Color.parseColor("#7986CB"))

            if (json.has("action") && json.getString("action") != "null") {
                val action = json.getJSONObject("action")
                snack.setAction(action.getString("text")) {
                    webView.evaluateJavascript("""
                    (${action.getString("onClick")})()
                """.trimIndent()) {}
                    snack.dismiss()
                }
            }

            snack.show()
        }
    }


    @JavascriptInterface
    fun isDarkMode(): String {
        val json = JSONObject()
        when (context.resources?.configuration?.uiMode?.and(Configuration.UI_MODE_NIGHT_MASK)) {
            Configuration.UI_MODE_NIGHT_YES -> json.put("data", true)
            Configuration.UI_MODE_NIGHT_NO -> json.put("data", false)
            else -> json.put("data", false)
        }
        return json.toString()
    }


    @JavascriptInterface
    fun setStatusBarColor(data: String) {
        val json = JSONObject(data)
        val color = json.getJSONObject("color")
        val rgba = Rgba(
            r = color.getInt("r"),
            g = color.getInt("g"),
            b = color.getInt("b"),
            a = color.getInt("a")
        )
        changeStatusBarColor?.invoke(rgba, json.getBoolean("darkIcons"))
    }
}