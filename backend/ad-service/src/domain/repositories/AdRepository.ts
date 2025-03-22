import { Ad } from '../entities/Ad';

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed'
}

export interface IAdRepository {
  create(ad: Omit<Ad, 'id'>): Promise<Ad>;
  update(id: string, ad: Partial<Ad>): Promise<Ad>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<Ad | null>;
  getByAdvertiserId(advertiserId: string): Promise<Ad[]>;
  updatePaymentStatus(id: string, status: PaymentStatus): Promise<Ad>;

}
