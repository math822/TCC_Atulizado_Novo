# Como gerar o APK do "Lá da Vendinha" (celular Android)

Este projeto já está configurado com o **Capacitor**: o app é uma "casca"
(WebView) que abre o site ao vivo **https://ladavendinha-tcc.vercel.app**.
Ou seja, o app mostra sempre a versão mais recente do site — mas **precisa de
internet** para funcionar.

O único passo que ainda NÃO dá para fazer automaticamente aqui é compilar o
`.apk`, porque isso exige o **Android Studio** (que traz o Java + Android SDK).
Sua máquina ainda não tem isso. Instale uma vez e depois é só repetir o
"Gerar o APK".

---

## 1) Instalar o Android Studio (uma vez só)

1. Baixe em https://developer.android.com/studio (botão **Download Android Studio**).
2. Instale aceitando o padrão. Ele já baixa o **Android SDK** junto no primeiro
   início (siga o "Setup Wizard" e clique *Finish* até terminar).
3. Pronto — isso já instala o Java (JDK 17) e o SDK que a compilação precisa.

> Peso: ~1–2 GB. É normal demorar um pouco na primeira vez.

---

## 2) Abrir o projeto do app

1. Abra o **Android Studio**.
2. **File > Open**.
3. Selecione a pasta **`android`** que está dentro do projeto
   (`C:\Users\User\Documents\TCC\TCC_Atulizado_Novo\android`) e clique **OK**.
4. Espere o Gradle sincronizar (barra embaixo, "Gradle sync finished").
   Na primeira vez ele baixa mais algumas dependências — deixe terminar.

---

## 3) Gerar o APK

**Jeito mais fácil (pelo menu):**

1. Menu **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
2. Espere terminar. Vai aparecer um aviso **"APK(s) generated successfully"**.
3. Clique em **locate** — o arquivo fica em:
   `android/app/build/outputs/apk/debug/app-debug.apk`

Esse `app-debug.apk` é o que você manda para o celular (por cabo, Drive,
WhatsApp etc.), toca nele e instala. Como é versão "de teste", o Android vai
avisar "app de fonte desconhecida" — é só autorizar.

**Jeito por linha de comando (alternativa):**

Abra o terminal (PowerShell) dentro da pasta `android` e rode:

```
.\gradlew assembleDebug
```

O APK sai no mesmo caminho: `app\build\outputs\apk\debug\app-debug.apk`.

---

## 4) Testar direto no celular (opcional, sem gerar arquivo)

Conecte o celular por USB com **Opções de desenvolvedor + Depuração USB**
ativadas e clique no botão verde **Run ▶** no Android Studio. O app instala e
abre sozinho.

---

## Depois de mudar o site

O app abre o site ao vivo, então **não precisa recompilar** para atualizar
conteúdo — basta publicar o site na Vercel como já fazemos. Recompilar o APK
só se mudar algo no próprio app (ícone, nome, permissões).

---

## Avisos importantes (leia antes de apresentar)

- **Login com Google**: dentro do WebView o Google costuma bloquear o pop-up de
  login. Para o app, prefira o **login tradicional (e-mail + senha)**. No site
  normal (navegador) o Google continua funcionando.
- **Localização**: já deixei o app com permissão de GPS. Na primeira vez que
  tocar em "Usar minha localização" o celular pede autorização — aceite.
- **Ícone**: por enquanto o app usa o ícone padrão do Capacitor. Se quiser um
  ícone com a cara do Lá da Vendinha, me avisa que eu gero a imagem e troco os
  arquivos `mipmap`.
- **Internet**: sem conexão o app mostra a tela "Sem conexão" (fiz um fallback).

---

## Se você quiser um APK "de loja" (release, assinado)

O `app-debug.apk` já serve para instalar e demonstrar. Um APK de **release**
assinado só é necessário para publicar na Play Store. Se um dia precisar, me
avisa que eu configuro a assinatura (keystore) e o `build release`.
