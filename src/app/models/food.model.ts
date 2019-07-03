
export class Food {
  photo: string;
  price: number;
  categoryName: string;
  chargeGlycemique: number;
  carboHydratPercent: number;
  isFavorite: boolean;


  constructor(public foodName: string, public glycemicIndex: number, public pralIndex: number) {}
}
