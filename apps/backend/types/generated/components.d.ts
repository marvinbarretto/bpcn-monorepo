import type { Struct, Schema } from '@strapi/strapi';

export interface SharedSharedImage extends Struct.ComponentSchema {
  collectionName: 'components_shared_shared_images';
  info: {
    displayName: 'SharedImage';
    icon: 'brush';
  };
  attributes: {
    alt: Schema.Attribute.String;
    media: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'Seo';
    icon: 'eye';
  };
  attributes: {
    metaTitle: Schema.Attribute.String;
    metaDescription: Schema.Attribute.String;
    sharedImage: Schema.Attribute.Component<'shared.shared-image', false>;
    keywords: Schema.Attribute.String;
    preventIndexing: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.shared-image': SharedSharedImage;
      'shared.seo': SharedSeo;
    }
  }
}
