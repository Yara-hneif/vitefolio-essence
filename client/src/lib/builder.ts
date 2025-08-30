import { builder, Builder } from "@builder.io/react";

const builderPublicKey = import.meta.env.VITE_BUILDER_PUBLIC_KEY as string;
builder.init(builderPublicKey);

export const siteTargetFields = (userId: string, siteSlug: string) => ({
  data: { userId, siteSlug },
});

export { Builder };