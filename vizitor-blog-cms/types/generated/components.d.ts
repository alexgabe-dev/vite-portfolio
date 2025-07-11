import type { Attribute, Schema } from '@strapi/strapi';

export interface BlogQuoteBlock extends Schema.Component {
  collectionName: 'components_blog_quote_blocks';
  info: {
    displayName: 'QuoteBlock';
    icon: 'brush';
  };
  attributes: {
    author: Attribute.String;
    text: Attribute.String & Attribute.Required;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'blog.quote-block': BlogQuoteBlock;
    }
  }
}
