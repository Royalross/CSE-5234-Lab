export type OrderItem = {
  itemNumber: number;
  quantity: number;
  itemName?: string;
};

export type PaymentInfo = {
  holderName: string;
  cardNum: string;
  expDate: string;
  cvv: string;
};

export type ShippingInfo = {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  email?: string;
};

export type OrderPayload = {
  customerName: string;
  customerEmail?: string;
  status?: string;
  paymentInfo: PaymentInfo;
  shippingInfo: ShippingInfo;
  items: OrderItem[];
};

export type OrderResult = {
  id: number;
  orderId: number;
  customerName: string;
  customerEmail: string | null;
  status: string;
  paymentInfoId: number;
  shippingInfoId: number;
  lineItemsCount: number;

  totalAmount: number;
  paymentToken: string;
  shippingDetail: {
    businessId: string;
    orderId: number;
    shipmentAddress: string;
    packetCount: number;
    packets: { itemNumber: number; packetWeight: number }[];
  };
};
