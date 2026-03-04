import { env } from '@/config/config';

type OrganizationData = {
  description: string;
  lang: string;
};

type WebPageData = {
  title: string;
  description: string;
  lang: string;
};

type JsonLDProps =
  | { type: 'Organization'; data: OrganizationData }
  | { type: 'WebPage'; data: WebPageData };

async function buildOrganization({ description }: OrganizationData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: env.NEXT_PUBLIC_APP_NAME,
    url: env.NEXT_PUBLIC_APP_URL,
    description,
    email: env.NEXT_PUBLIC_MAIL,
  };
}

function buildWebPage({ title, description, lang }: WebPageData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    inLanguage: lang,
    url: `${env.NEXT_PUBLIC_APP_URL}/${lang}`,
    isPartOf: {
      '@type': 'WebSite',
      name: env.NEXT_PUBLIC_APP_NAME,
      url: env.NEXT_PUBLIC_APP_URL,
    },
  };
}

export function JsonLD({ type, data }: JsonLDProps) {
  const structuredData = type === 'Organization' ? buildOrganization(data) : buildWebPage(data);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

export default JsonLD;
