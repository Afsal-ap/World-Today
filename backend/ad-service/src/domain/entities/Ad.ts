 import { AdPlacement } from "../../domain/types";

export class Ad {
    constructor(
      public id: string,
      public advertiserId: string,
      public title: string,
      public description: string,
      public imageUrl: string,
      public placement: AdPlacement,
      public price: number,
      public status: "pending" | "approved" | "rejected",
      public createdAt: Date,
      public updatedAt: Date
    ) {}
  }
  