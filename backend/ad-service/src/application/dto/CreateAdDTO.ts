
import { AdPlacement } from "../../domain/types";

export interface CreateAdDTO {
    advertiserId: string;
    title: string;
    description: string;
    imageUrl: string;
    placement: AdPlacement;
    status: "pending" | "approved" | "rejected"
  }
  