import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = 'Sweat Equity Hub',
  description = 'Connect talent with equity-based opportunities. Find your next startup adventure or discover passionate team members.',
  keywords = 'startup jobs, equity compensation, remote work, tech jobs, startup careers',
  image = '/logoLight.jpg',
  url = window.location.href,
  type = 'website'
}) => {
  const fullTitle = title === 'Sweat Equity Hub' ? title : `${title} | Sweat Equity Hub`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;