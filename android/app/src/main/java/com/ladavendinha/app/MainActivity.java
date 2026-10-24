package com.ladavendinha.app;

import android.webkit.WebView;

import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    // Sem isso o botão voltar do sistema fecha o app em vez de voltar no histórico do site.
    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        Bridge bridge = getBridge();
        WebView web = bridge == null ? null : bridge.getWebView();

        if (web != null && web.canGoBack()) {
            web.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
