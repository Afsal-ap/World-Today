export class Ad {
    constructor(
      public id: string,
      public advertiserId: string,
      public title: string,
      public description: string,
      public imageUrl: string,
      public targetUrl: string,
      public placement: "sidebar" | "topbar" | "popup",
      public price: number,
      public status: "pending" | "approved" | "rejected",
      public createdAt: Date,
      public updatedAt: Date
    ) {}
  }
  