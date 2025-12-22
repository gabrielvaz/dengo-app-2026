import appConfig from '../../app.json';

type LegalConfig = {
  privacyPolicyUrl?: string;
  termsOfUseUrl?: string;
  supportEmail?: string;
};

const legalConfig = (appConfig?.expo?.extra?.legal || {}) as LegalConfig;

export const legalLinks = {
  privacyPolicyUrl: legalConfig.privacyPolicyUrl || '',
  termsOfUseUrl: legalConfig.termsOfUseUrl || '',
  supportEmail: legalConfig.supportEmail || '',
};
