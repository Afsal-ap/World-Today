export type AdPlacement = 'sidebar' | 'topbar' | 'popup';

export interface CreateAdDTO {
  title: string;
  description: string;
  imageUrl: string;
  targetUrl: string;
  placement: AdPlacement;
}

export interface Ad extends CreateAdDTO {
  id: string;
  advertiserId: string;
  status: 'pending' | 'approved' | 'rejected';
  price: number;
  createdAt: Date;
  updatedAt: Date;
}
