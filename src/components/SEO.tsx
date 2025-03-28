import React from 'react';
import { Helmet } from 'react-helmet';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  pathname?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  ogImage = 'https://vizitor.hu/vizitor-logo.min.svg',
  ogType = 'website',
  pathname,
}) => {
  const defaultTitle = 'Vizitor.hu - Professzionális Weboldalkészítés és Marketing Szolgáltatások';
  const defaultDescription = 'Professzionális weboldalkészítés és digitális marketing. Modern, reszponzív weboldalak, SEO optimalizálás és hatékony online marketing megoldások.';
  const defaultKeywords = 'webfejlesztés, weboldalkészítés, marketing szolgáltatások, SEO, webtervezés, webdesign, digitális marketing, online marketing, honlapkészítés';
  
  const siteUrl = 'https://vizitor.hu';
  const fullUrl = pathname ? `${siteUrl}${pathname}` : siteUrl;
  
  const metaTitle = title ? `${title} | Vizitor.hu` : defaultTitle;
  const metaDescription = description || defaultDescription;
  const metaKeywords = keywords || defaultKeywords;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      
      {/* OpenGraph Meta Tags */}
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Vizitor.hu" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
    </Helmet>
  );
};

export default SEO;