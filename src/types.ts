export interface ProductDetailedInfo {
  aboutTitle?: string;
  aboutParagraphs?: string[];
  activeIngredientLabel?: string;
  activeIngredientValue?: string;
  activeIngredientDesc?: string;
  advantagesTitle?: string;
  advantagesList?: string[];
  advantagesNotice?: string;
  pestTargetLabel?: string;
  pestTargetList?: string[];
  stepsLabel?: string;
  stepsList?: string[];
  tipsLabel?: string;
  tipsList?: string[];
  whyUsLabel?: string;
  whyUsList?: string[];
  shippingLabel?: string;
  shippingDesc?: string;
  shippingListText?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  image: string;
  shopeeUrl?: string;
  tokopediaUrl?: string;
  lazadaUrl?: string;
  whatsappUrl?: string;
  pestTarget?: string;
  formulation?: string;
  packaging?: string;
  price: number;
  detailedInfo?: ProductDetailedInfo;
  stok: number; 
}

export interface ProcessStep {
  id: number;
  title: string;
  description: string;
  iconName: string;
}

export interface CompanyAdvantage {
  id: number;
  title: string;
  description: string;
  iconName: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  publishedAt: string;
  author: string;
  category: string;
  image: string;
}
