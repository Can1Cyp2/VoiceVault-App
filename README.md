# VoiceVault App Download Site

Static React and TypeScript site for the `Can1Cyp2/VoiceVault-App` GitHub Pages QR destination.

Visitors choose iPhone or Android. On matching mobile devices, the button first tries to open the native app store app:

- iPhone and iPad: `itms-apps://itunes.apple.com/app/id6741833897`
- Android: `market://details?id=com.can1cyp2.VoiceVault` or a Play Store intent URL

If the native store app does not open, the page falls back to the public web store page.

## Store Links

- App Store: https://apps.apple.com/ca/app/voicevault/id6741833897
- Google Play: https://play.google.com/store/apps/details?id=com.can1cyp2.VoiceVault

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The Vite base path is set to `/VoiceVault-App/` for GitHub Pages at:

https://can1cyp2.github.io/VoiceVault-App/

If the repository uses a custom domain, update `base` in `vite.config.ts` before deploying.
