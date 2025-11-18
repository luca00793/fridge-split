export interface Fridge {
    id: number;
    name: string;
    color: string;
    avatar: string;
    // Ces champs sont calculés côté client ou via une jointure
    item_count?: number;
  }
  
  export interface Item {
    id: number;
    fridge_id: number;
    name: string;
    quantity: string;
    expiry_date: string;
    category: string;
    // Statut calculé (ex: "urgent")
    status?: 'good' | 'warning' | 'urgent';
  }