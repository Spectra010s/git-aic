const siteUrl = 'https://git-aic.pages.dev';
const creator = {
  '@type': 'Person',
  name: 'Spectra010s',
  url: 'https://spectra010s.biuld.app',
  image: {
    '@type': 'ImageObject',
    url: 'https://mycampuslib.vercel.app/spectra010s.jpg',
  },
};

type SchemaNode = {
  '@type': string;
  [key: string]: unknown;
};

type BreadcrumbItem = {
  name: string;
  path: string;
};

const toAbsoluteUrl = (path: string) => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

export const createSchema = (nodes: SchemaNode[]) => ({
  '@context': 'https://schema.org',
  '@graph': nodes,
});

export const createHomeSchema = () =>
  createSchema([
    {
      '@type': 'WebSite',
      name: 'Git-AIC',
      url: siteUrl,
      description:
        'A Git CLI utility that uses AI to format recent work into clear and readable commit logs.',
      creator,
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Git-AIC',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Windows, macOS, Linux, Android',
      description:
        'An AI-powered Git terminal tool that automates the commit workflow for developers.',
      author: creator,
      creator,
      codeRepository: 'https://github.com/Spectra010s/git-aic',
      downloadUrl: 'https://www.npmjs.com/package/git-aic',
      sameAs: ['https://github.com/Spectra010s/git-aic', 'https://spectra010s.biuld.app'],
    },
    {
      '@type': 'HowTo',
      name: 'How to use Git-AIC',
      step: [
        {
          '@type': 'HowToStep',
          name: 'Stage',
          text: 'Add your code changes to the Git staging area.',
        },
        {
          '@type': 'HowToStep',
          name: 'Generate',
          text: 'Run git-aic to generate a commit message.',
        },
        {
          '@type': 'HowToStep',
          name: 'Review',
          text: 'Review, edit, and approve the generated commit.',
        },
      ],
    },
    {
      '@type': 'Organization',
      name: 'Hiverra',
      url: 'https://github.com/hiverra',
      logo: `${siteUrl}/favicon.png`,
      sameAs: ['https://github.com/Spectra010s/git-aic', 'https://x.com/Spectra010s'],
    },
  ]);

export const createBreadcrumbSchema = (items: BreadcrumbItem[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: 'Home', path: '/' }, ...items].map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: toAbsoluteUrl(item.path),
  })),
});

export const createDocsSchema = ({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) => {
  const isDocsIndex = path === '/docs/';
  const pageUrl = toAbsoluteUrl(path);

  return createSchema([
    {
      '@type': isDocsIndex ? 'CollectionPage' : 'TechArticle',
      name: title,
      headline: title,
      description,
      url: pageUrl,
      isPartOf: {
        '@type': 'WebSite',
        name: 'Git-AIC',
        url: siteUrl,
      },
      about: {
        '@type': 'SoftwareApplication',
        name: 'Git-AIC',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Windows, macOS, Linux, Android',
      },
    },
    createBreadcrumbSchema(
      isDocsIndex
        ? [{ name: 'Docs', path: '/docs/' }]
        : [
            { name: 'Docs', path: '/docs/' },
            { name: title, path },
          ]
    ),
  ]);
};
