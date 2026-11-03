'use client';

import React from 'react';
import { useT } from '@gitroom/react/translation/get.transation.service.client';

// AGPL-3.0 §13: Nutzer im Netz bekommen den Quelltext der laufenden Fassung angeboten.
// Steht nur in der angemeldeten App (Einstellungen), nicht in der Seitenleiste und nicht vor der Anmeldung (I12, I14a).
const SOURCE_URL =
  'https://github.com/hagelitservices/kaido-publish-app/tree/kaido/main';

const AboutComponent = () => {
  const t = useT();
  return (
    <section
      aria-labelledby="settings-about"
      className="my-[16px] mt-[16px] bg-sixth border-fifth border rounded-[4px] p-[24px] flex flex-col gap-[12px]"
    >
      <h4 id="settings-about" className="mt-[4px]">
        {t('settings_about', 'About')}
      </h4>
      <div className="text-[14px] text-customColor18">
        {t(
          'settings_about_license',
          'This app is free software under the GNU Affero General Public License 3.0. You can get the complete source code of the running version.'
        )}
      </div>
      <a
        href={SOURCE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="self-start text-[14px] underline underline-offset-2 rounded-[4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {t('source_code_agpl', 'Source code (AGPL-3.0)')}
      </a>
    </section>
  );
};

export default AboutComponent;
