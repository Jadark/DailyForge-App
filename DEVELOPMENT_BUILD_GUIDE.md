# Development Build Guide for Native Confetti

This guide explains how to create a development build so you can use the native Swift confetti animations.

## What is a Development Build?

A development build is a custom version of your app that includes native modules (like `expo-any-confetti`). Unlike Expo Go, it can run any native code your app needs.

## Option 1: EAS Build (Recommended - Cloud Build)

This is the easiest option - Expo builds your app in the cloud. No local setup needed!

### Prerequisites
- Expo account (free)
- EAS CLI installed: `npm install -g eas-cli`

### Steps

1. **Install EAS CLI** (if not already installed):
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**:
   ```bash
   eas login
   ```

3. **Configure EAS Build** (first time only):
   ```bash
   eas build:configure
   ```
   This creates an `eas.json` file.

4. **Build for iOS Simulator** (for testing):
   ```bash
   eas build --profile development --platform ios
   ```
   
   Or build for a physical device:
   ```bash
   eas build --profile development --platform ios --profile development
   ```

5. **Install the build**:
   - EAS will provide a download link when the build completes
   - Download and install on your device/simulator
   - Or scan the QR code with your device

6. **Run your app**:
   ```bash
   npx expo start --dev-client
   ```
   Then press `i` to open in the iOS simulator, or scan the QR code with your device.

### Build Profiles

The `eas.json` file will have different profiles. For development builds, use the `development` profile.

## Option 2: Local Build (Requires Xcode)

If you have a Mac with Xcode installed, you can build locally.

### Prerequisites
- macOS with Xcode installed
- CocoaPods: `sudo gem install cocoapods`
- iOS Simulator or physical device

### Steps

1. **Generate native code**:
   ```bash
   npx expo prebuild
   ```
   This creates `ios/` and `android/` folders.

2. **Install iOS dependencies**:
   ```bash
   cd ios
   pod install
   cd ..
   ```

3. **Build and run**:
   ```bash
   npx expo run:ios
   ```
   
   Or open in Xcode:
   ```bash
   npx expo run:ios --no-build
   ```
   Then open `ios/dailyforge.xcworkspace` in Xcode and run from there.

4. **Start the dev server**:
   ```bash
   npx expo start --dev-client
   ```

## After Building

Once you have a development build installed:

1. The native Swift confetti will automatically be used on iOS
2. The app will detect the native module and use it instead of the Reanimated fallback
3. You'll see the beautiful native Swift animations!

## Production Builds

When you're ready to release:

1. **Build for App Store**:
   ```bash
   eas build --profile production --platform ios
   ```

2. **Submit to App Store**:
   ```bash
   eas submit --platform ios
   ```

## Troubleshooting

- **"Unimplemented component" error**: You're still using Expo Go. Install a development build.
- **Build fails**: Check that `expo-any-confetti` is in your `package.json` dependencies
- **Native module not found**: Make sure you ran `npx expo prebuild` (local) or the EAS build completed successfully

## Notes

- Development builds are larger than Expo Go (~50-100MB)
- You need to rebuild if you add new native modules
- JavaScript changes still hot-reload instantly (no rebuild needed)
- Native confetti only works on iOS (Android will use Reanimated fallback)

