# Android release

This project uses Capacitor to package the React app for Google Play.

## Local setup

1. Install Android Studio with the Android SDK and platform tools.
2. Install a supported JDK through Android Studio.
3. From this directory, run:

```bash
npm install
npm run mobile:sync
npm run mobile:open
```

4. In Android Studio, wait for Gradle sync and test the app on an emulator or Android phone.

## Play Store bundle

In Android Studio:

1. Select **Build > Generate Signed Bundle / APK**.
2. Choose **Android App Bundle**.
3. Create or select a release keystore and keep the keystore and passwords private.
4. Build the release bundle.
5. Upload the resulting `.aab` file to Google Play Console.

The application ID is `com.joysamul.bgremoval`. Increase `versionCode` in `android/app/build.gradle` for every new Play Store upload.

## Required Play Console items

- App icon, screenshots, feature graphic, and store description
- Privacy policy explaining image processing
- Data Safety form describing uploaded images and the remove.bg processor
- Content rating and target audience
- Closed testing or other testing requirements shown by Play Console

The remove.bg API key stays on the Vercel backend and is never bundled into the Android app.
