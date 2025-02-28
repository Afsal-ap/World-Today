export interface CreateAdDTO {
    advertiserId: string;
    title: string;
    description: string;
    imageUrl: string;
    targetUrl: string;
    placement: "sidebar" | "topbar" | "popup";
  }
  