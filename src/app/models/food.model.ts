
export class Food {
  photo: string;
  price: number;
  categoryName: string;
  chargeGlycemique: number;
  carboHydratPercent: number;
  favorite: boolean;

  constructor(
    public foodName: string, public glycemicIndex: number, public pralIndex: number) {
    this.favorite = false;
  }

}
