import { SentryComponent } from '@gitroom/frontend/components/layout/sentry.component';

export const dynamic = 'force-dynamic';
import '../global.scss';
import 'react-tooltip/dist/react-tooltip.css';
import '@copilotkit/react-ui/styles.css';
import LayoutContext from '@gitroom/frontend/components/layout/layout.context';
import { ReactNode } from 'react';
import { jakartaSans } from '@gitroom/frontend/fonts/plus-jakarta-sans/plus.jakarta.sans.font';
import PlausibleProvider from 'next-plausible';
import clsx from 'clsx';
import { VariableContextComponent } from '@gitroom/react/helpers/variable.context';
import { ifSet } from '@gitroom/react/helpers/if.set';
import { Fragment } from 'react';
import UtmSaver from '@gitroom/helpers/utils/utm.saver';
import { DubAnalytics } from '@gitroom/frontend/components/layout/dubAnalytics';
import { FacebookComponent } from '@gitroom/frontend/components/layout/facebook.component';
import { GoogleTagManagerComponent } from '@gitroom/frontend/components/layout/gtm.component';
import { cookies } from 'next/headers';
import {
  cookieName,
  fallbackLng,
} from '@gitroom/react/translation/i18n.config';
import { HtmlComponent } from '@gitroom/frontend/components/layout/html.component';
import Script from 'next/script';
import { ChangeDirClient } from '@gitroom/frontend/components/new-layout/change.dir.client';

export default async function AppLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const language = cookieStore.get(cookieName)?.value || fallbackLng;
  const Plausible = !!process.env.STRIPE_PUBLISHABLE_KEY
    ? PlausibleProvider
    : Fragment;
  return (
    <html>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {!!process.env.DATAFAST_WEBSITE_ID && (
          <Script
            data-website-id={process.env.DATAFAST_WEBSITE_ID}
            data-domain="postiz.com"
            src="https://datafa.st/js/script.js"
            strategy="afterInteractive"
          />
        )}
      </head>
      <ChangeDirClient />
      <body
        className={clsx(jakartaSans.className, 'dark text-primary !bg-primary')}
      >
        <VariableContextComponent
          storageProvider={
            process.env.STORAGE_PROVIDER! as 'local' | 'cloudflare'
          }
          environment={process.env.NODE_ENV!}
          backendUrl={process.env.NEXT_PUBLIC_BACKEND_URL!}
          {...ifSet('plontoKey', process.env.NEXT_PUBLIC_POLOTNO!)}
          {...ifSet('stripeClient', process.env.STRIPE_PUBLISHABLE_KEY!)}
          {...ifSet('isChatBase', !!process.env.CHATBASE_TOKEN)}
          billingEnabled={!!process.env.STRIPE_PUBLISHABLE_KEY}
          {...ifSet('discordUrl', process.env.NEXT_PUBLIC_DISCORD_SUPPORT!)}
          frontEndUrl={process.env.FRONTEND_URL!}
          isGeneral={!!process.env.IS_GENERAL}
          {...ifSet('genericOauth', !!process.env.POSTIZ_GENERIC_OAUTH)}
          {...ifSet('oauthLogoUrl', process.env.NEXT_PUBLIC_POSTIZ_OAUTH_LOGO_URL!)}
          {...ifSet('oauthDisplayName', process.env.NEXT_PUBLIC_POSTIZ_OAUTH_DISPLAY_NAME!)}
          uploadDirectory={process.env.NEXT_PUBLIC_UPLOAD_STATIC_DIRECTORY!}
          cloudflareUrl={process.env.CLOUDFLARE_BUCKET_URL || ''}
          mainUrl={process.env.MAIN_URL || ''}
          {...ifSet('mcpUrl', process.env.MCP_URL)}
          {...ifSet('dub', !!process.env.STRIPE_PUBLISHABLE_KEY)}
          {...ifSet('facebookPixel', process.env.NEXT_PUBLIC_FACEBOOK_PIXEL!)}
          {...ifSet('telegramBotName', process.env.TELEGRAM_BOT_NAME!)}
          {...ifSet('neynarClientId', process.env.NEYNAR_CLIENT_ID!)}
          {...ifSet('appleClientId', process.env.APPLE_CLIENT_ID!)}
          isSecured={!process.env.NOT_SECURED}
          disableImageCompression={!!process.env.DISABLE_IMAGE_COMPRESSION}
          {...ifSet('disableXAnalytics', !!process.env.DISABLE_X_ANALYTICS)}
          {...ifSet('sentryDsn', process.env.NEXT_PUBLIC_SENTRY_DSN!)}
          {...ifSet('extensionId', process.env.EXTENSION_ID || '')}
          {...ifSet('googleAdsId', process.env.NEXT_PUBLIC_GTM_ID)}
          {...ifSet('googleAdsTrialTracking', process.env.NEXT_PUBLIC_TRACKING_TRIAL)}
          language={language}
          {...ifSet('recaptchaSiteKey', process.env.RECAPTCHA_SITE_KEY || '')}
          mediaProcessing={
            process.env.STORAGE_PROVIDER === 'cloudflare' &&
            !!process.env.RUNPOD_API_KEY &&
            !!process.env.RUNPOD_ENDPOINT_ID
          }
          transloadit={
            process.env.TRANSLOADIT_AUTH && process.env.TRANSLOADIT_TEMPLATE
              ? [
                  process.env.TRANSLOADIT_AUTH!,
                  process.env.TRANSLOADIT_TEMPLATE!,
                ]
              : []
          }
        >
          <SentryComponent>
            <HtmlComponent />
            <DubAnalytics />
            <FacebookComponent />
            <GoogleTagManagerComponent gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
            <Plausible
              domain={!!process.env.IS_GENERAL ? 'postiz.com' : 'gitroom.com'}
            >
              <LayoutContext>
                <UtmSaver />
                {children}
              </LayoutContext>
            </Plausible>
          </SentryComponent>
        </VariableContextComponent>
      </body>
    </html>
  );
}
