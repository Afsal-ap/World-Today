export interface Ad {
  id: string;
  title: string; // Change from string | undefined to string
  description?: string;
  imageUrl?: string;
  placement: 'card' | 'popup';
  status: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  spent?: number;
  impressions?: number;
  clicks?: number;
}

export interface CreateAdDTO {
  advertiserId: string;
  title: string; // Ensure title is required here too
  description?: string;
  imageUrl?: string;
  placement: string;
  price: number;
  startDate?: string;
  endDate?: string;
}