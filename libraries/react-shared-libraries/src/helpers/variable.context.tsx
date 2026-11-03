'use client';

import { createContext, FC, ReactNode, useContext, useEffect } from 'react';
interface VariableContextInterface {
  stripeClient: string;
  billingEnabled: boolean;
  isChatBase: boolean;
  isGeneral: boolean;
  genericOauth: boolean;
  oauthLogoUrl: string;
  oauthDisplayName: string;
  mcpUrl?: string;
  cloudflareUrl: string;
  mainUrl: string;
  frontEndUrl: string;
  plontoKey: string;
  storageProvider: 'local' | 'cloudflare';
  backendUrl: string;
  environment: string;
  discordUrl: string;
  uploadDirectory: string;
  facebookPixel: string;
  telegramBotName: string;
  neynarClientId: string;
  appleClientId: string;
  isSecured: boolean;
  disableImageCompression: boolean;
  disableXAnalytics: boolean;
  language: string;
  dub: boolean;
  transloadit: string[];
  mediaProcessing: boolean;
  sentryDsn: string;
  extensionId: string;
  googleAdsId?: string;
  googleAdsTrialTracking?: string;
  recaptchaSiteKey?: string;
}
const variableDefaults = {
  stripeClient: '',
  billingEnabled: false,
  isGeneral: true,
  genericOauth: false,
  isChatBase: false,
  oauthLogoUrl: '',
  googleAdsId: '',
  googleAdsTrialTracking: '',
  oauthDisplayName: '',
  mcpUrl: '',
  cloudflareUrl: '',
  mainUrl: '',
  frontEndUrl: '',
  storageProvider: 'local',
  plontoKey: '',
  backendUrl: '',
  discordUrl: '',
  uploadDirectory: '',
  isSecured: false,
  telegramBotName: '',
  facebookPixel: '',
  neynarClientId: '',
  appleClientId: '',
  disableImageCompression: false,
  disableXAnalytics: false,
  language: '',
  dub: false,
  transloadit: [],
  mediaProcessing: false,
  sentryDsn: '',
  extensionId: '',
  recaptchaSiteKey: '',
} as VariableContextInterface;
const VariableContext = createContext(variableDefaults);
// Kaido (I14b): Layouts reichen ungesetzte Werte gar nicht erst durch (ifSet), damit die Seite keine
// Schlüssel ungenutzter Dienste ausliefert; hier kommen die Vorgabewerte wieder dazu.
export const VariableContextComponent: FC<
  Partial<VariableContextInterface> & {
    children: ReactNode;
  }
> = (props) => {
  const { children, ...given } = props;
  const otherProps = { ...variableDefaults, ...given } as VariableContextInterface;
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.vars = otherProps;
    }
  }, []);
  return (
    <VariableContext.Provider value={otherProps}>
      {children}
    </VariableContext.Provider>
  );
};
export const useVariables = () => {
  return useContext(VariableContext);
};
export const loadVars = () => {
  // @ts-ignore
  return window.vars as VariableContextInterface;
};
