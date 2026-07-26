import { useMemo, useState } from "react";
import { SiAppstore, SiGoogleplay } from "react-icons/si";

type StorePlatform = "ios" | "android";
type DevicePlatform = StorePlatform | "desktop";

const IOS_WEB_URL = "https://apps.apple.com/ca/app/voicevault/id6741833897";
const IOS_NATIVE_URL = "itms-apps://itunes.apple.com/app/id6741833897";
const ANDROID_WEB_URL =
  "https://play.google.com/store/apps/details?id=com.can1cyp2.VoiceVault";
const ANDROID_MARKET_URL = "market://details?id=com.can1cyp2.VoiceVault";
const ANDROID_INTENT_URL = `intent://details?id=com.can1cyp2.VoiceVault#Intent;scheme=market;package=com.android.vending;S.browser_fallback_url=${encodeURIComponent(
  ANDROID_WEB_URL,
)};end`;

const storeChoices: Record<
  StorePlatform,
  {
    platformName: string;
    storeName: string;
    actionLabel: string;
    detail: string;
    className: string;
    webUrl: string;
  }
> = {
  ios: {
    platformName: "iPhone",
    storeName: "App Store",
    actionLabel: "Open App Store",
    detail: "For iPhone and iPad",
    className: "ios",
    webUrl: IOS_WEB_URL,
  },
  android: {
    platformName: "Android",
    storeName: "Google Play",
    actionLabel: "Open Google Play",
    detail: "For Android phones",
    className: "android",
    webUrl: ANDROID_WEB_URL,
  },
};

function detectPlatform(): DevicePlatform {
  const userAgent = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const maxTouchPoints = navigator.maxTouchPoints || 0;

  if (/android/i.test(userAgent)) {
    return "android";
  }

  const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent);
  const isIPadOS = platform === "MacIntel" && maxTouchPoints > 1;

  if (isIOSDevice || isIPadOS) {
    return "ios";
  }

  return "desktop";
}

function openStore(platform: StorePlatform, detectedPlatform: DevicePlatform) {
  const isMatchingMobileDevice = detectedPlatform === platform;
  const webUrl = storeChoices[platform].webUrl;

  if (!isMatchingMobileDevice) {
    window.location.assign(webUrl);
    return;
  }

  const nativeUrl =
    platform === "ios"
      ? IOS_NATIVE_URL
      : /chrome|crios|edga|samsungbrowser/i.test(navigator.userAgent)
        ? ANDROID_INTENT_URL
        : ANDROID_MARKET_URL;

  const fallbackTimer = window.setTimeout(() => {
    if (!document.hidden) {
      window.location.assign(webUrl);
    }
  }, 1200);

  const stopFallback = () => {
    if (document.hidden) {
      window.clearTimeout(fallbackTimer);
    }
  };

  document.addEventListener("visibilitychange", stopFallback, { once: true });
  window.location.href = nativeUrl;
}

function StoreLogo({ platform }: { platform: StorePlatform }) {
  return (
    <span
      className={`store-logo store-logo--${platform}`}
      aria-hidden="true"
    >
      {platform === "ios" ? <SiAppstore /> : <SiGoogleplay />}
    </span>
  );
}

function App() {
  const detectedPlatform = useMemo(detectPlatform, []);
  const [openingPlatform, setOpeningPlatform] = useState<StorePlatform | null>(
    null,
  );

  const orderedPlatforms = useMemo<StorePlatform[]>(() => {
    if (detectedPlatform === "android") {
      return ["android", "ios"];
    }

    return ["ios", "android"];
  }, [detectedPlatform]);

  const handleStoreOpen = (platform: StorePlatform) => {
    setOpeningPlatform(platform);
    openStore(platform, detectedPlatform);
  };

  return (
    <main className="page-shell">
      <section className="hero" aria-labelledby="page-title">
        <div className="hero-copy">
          <img
            className="brand-banner"
            src={`${import.meta.env.BASE_URL}voicevault-banner.png`}
            alt="VoiceVault"
          />
          <p className="eyebrow">QR download link</p>
          <h1 id="page-title">Get VoiceVault on your phone</h1>
          <p className="intro">
            Choose your device and the correct store page will open so you can
            download the app.
          </p>
        </div>

        <div className="app-preview" aria-hidden="true">
          <div className="phone-frame">
            <div className="phone-speaker" />
            <img
              className="app-icon"
              src={`${import.meta.env.BASE_URL}voicevault-icon.png`}
              alt=""
            />
            <div className="preview-copy">
              <span>VoiceVault</span>
              <strong>Find songs that fit your voice.</strong>
            </div>
            <div className="range-meter">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </section>

      <section className="store-grid" aria-label="Choose your app store">
        {orderedPlatforms.map((platform) => {
          const choice = storeChoices[platform];
          const isRecommended = detectedPlatform === platform;
          const isOpening = openingPlatform === platform;

          return (
            <article
              className={`store-card store-card--${choice.className}`}
              key={platform}
            >
              <div className="store-card__topline">
                <StoreLogo platform={platform} />
                {isRecommended ? (
                  <span className="recommendation">Recommended</span>
                ) : null}
              </div>
              <h2>{choice.platformName}</h2>
              <p>{choice.detail}</p>
              <button
                className="store-button"
                type="button"
                onClick={() => handleStoreOpen(platform)}
                aria-label={`${choice.actionLabel} for ${choice.platformName}`}
              >
                <StoreLogo platform={platform} />
                <span>{isOpening ? "Opening..." : choice.actionLabel}</span>
              </button>
              <a className="fallback-link" href={choice.webUrl}>
                Open {choice.storeName} in browser
              </a>
            </article>
          );
        })}
      </section>

      <noscript>
        <section className="noscript-links" aria-label="Direct store links">
          <a href={IOS_WEB_URL}>Open VoiceVault on the App Store</a>
          <a href={ANDROID_WEB_URL}>Open VoiceVault on Google Play</a>
        </section>
      </noscript>
    </main>
  );
}

export default App;
