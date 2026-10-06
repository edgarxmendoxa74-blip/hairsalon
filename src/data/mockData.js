// Default mock data for Salon Management System (GlowStudio Spa & Salon)

export const initialStaff = [
  {
    id: "STF-001",
    name: "Maria Santos",
    role: "Senior Hair Stylist & Colorist",
    phone: "0917-555-0101",
    email: "maria.santos@glowsalon.ph",
    commissionRate: 15, // 15%
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    specialties: ["Balayage", "Hair Rebonding", "Precision Cut"],
    status: "Active"
  },
  {
    id: "STF-002",
    name: "Chef Jhonn Cruz",
    role: "Master Barber & Stylist",
    phone: "0918-555-0102",
    email: "jhonn.cruz@glowsalon.ph",
    commissionRate: 15, // 15%
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    specialties: ["Men's Fade", "Beard Styling", "Hair Spa Treatment"],
    status: "Active"
  },
  {
    id: "STF-003",
    name: "Ana Reyes",
    role: "Senior Nail Artist & Spa Specialist",
    phone: "0920-555-0103",
    email: "ana.reyes@glowsalon.ph",
    commissionRate: 12, // 12%
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    specialties: ["Gel Manicure", "Spa Pedicure", "Nail Extensions"],
    status: "Active"
  },
  {
    id: "STF-004",
    name: "Grace Lim",
    role: "Facial Therapist & Aesthetician",
    phone: "0922-555-0104",
    email: "grace.lim@glowsalon.ph",
    commissionRate: 12, // 12%
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80",
    specialties: ["Hydra Facial", "Eyelash Extension", "Eyebrow Microblading"],
    status: "Active"
  }
];

export const initialServices = [
  {
    id: "SRV-001",
    name: "Signature Haircut & Blowdry",
    category: "Hair Care",
    price: 850,
    duration: 45, // mins
    description: "Consultation, shampoo, precision haircut, and salon blowdry finish.",
    assignedStaff: ["STF-001", "STF-002"]
  },
  {
    id: "SRV-002",
    name: "Full Balayage & Toning",
    category: "Hair Color",
    price: 3500,
    duration: 150,
    description: "Hand-painted highlight balayage technique with custom gloss toner.",
    assignedStaff: ["STF-001"]
  },
  {
    id: "SRV-003",
    name: "Brazilian Keratin Treatment",
    category: "Hair Treatment",
    price: 2800,
    duration: 120,
    description: "Deep smoothing therapy to eliminate frizz and restore hair shine.",
    assignedStaff: ["STF-001", "STF-002"]
  },
  {
    id: "SRV-004",
    name: "Gentleman's Executive Grooming",
    category: "Barber",
    price: 650,
    duration: 40,
    description: "Scalp massage, customized haircut, razor lineup, and hot towel shave.",
    assignedStaff: ["STF-002"]
  },
  {
    id: "SRV-005",
    name: "Luxury Gel Manicure & Pedicure Spa",
    category: "Nail Care",
    price: 1200,
    duration: 75,
    description: "Exfoliating foot soak, nail shaping, gel polish coating, and massage.",
    assignedStaff: ["STF-003"]
  },
  {
    id: "SRV-006",
    name: "Glowing Deep Hydration Facial",
    category: "Skin & Spa",
    price: 1800,
    duration: 60,
    description: "Deep pore extraction, ultrasonic rejuvenation, and hyaluronic mask.",
    assignedStaff: ["STF-004"]
  }
];

export const initialClients = [
  {
    id: "CLT-001",
    name: "Camille Gonzales",
    phone: "0917-123-4567",
    email: "camille.g@gmail.com",
    notes: "Prefers organic hair dye, allergic to strong ammonia.",
    vip: true,
    totalVisits: 8,
    totalSpent: 18400,
    registeredDate: "2025-08-15"
  },
  {
    id: "CLT-002",
    name: "Mark Villanueva",
    phone: "0918-987-6543",
    email: "mark.v@yahoo.com",
    notes: "Regular every 3 weeks for Executive Fade.",
    vip: false,
    totalVisits: 5,
    totalSpent: 3900,
    registeredDate: "2025-11-02"
  },
  {
    id: "CLT-003",
    name: "Sofia Mendoza",
    phone: "0920-456-7890",
    email: "sofia.m@gmail.com",
    notes: "Loves gel nail art with glitter accents.",
    vip: true,
    totalVisits: 12,
    totalSpent: 22600,
    registeredDate: "2025-05-20"
  },
  {
    id: "CLT-004",
    name: "Patricia Aquino",
    phone: "0922-333-4455",
    email: "patricia.a@outlook.com",
    notes: "First time customer, interested in Keratin.",
    vip: false,
    totalVisits: 1,
    totalSpent: 2800,
    registeredDate: "2026-02-10"
  }
];

export const initialInventory = [
  {
    id: "INV-001",
    name: "L'Oreal Professional Blond Studio Bleach Powder (500g)",
    category: "Hair Color & Bleach",
    unit: "Tub",
    currentStock: 3,
    minStockThreshold: 5, // LOW STOCK TRIGGERED
    unitCost: 1850,
    retailPrice: 0, // In-salon use
    supplier: "L'Oreal PH Distribution",
    lastRestocked: "2026-09-15"
  },
  {
    id: "INV-002",
    name: "Olalaplex No. 1 & No. 2 Bond Multiplier Set",
    category: "Hair Treatments",
    unit: "Bottle Set",
    currentStock: 2,
    minStockThreshold: 4, // LOW STOCK TRIGGERED
    unitCost: 4500,
    retailPrice: 0,
    supplier: "BeautySupply Co.",
    lastRestocked: "2026-09-01"
  },
  {
    id: "INV-003",
    name: "Keratin Complex Smoothing Shampoo 1000ml",
    category: "Shampoo & Conditioner",
    unit: "Bottle",
    currentStock: 14,
    minStockThreshold: 6,
    unitCost: 1200,
    retailPrice: 1800,
    supplier: "Keratin Care PH",
    lastRestocked: "2026-09-28"
  },
  {
    id: "INV-004",
    name: "OPI Gel Color Base & Top Coat Duo",
    category: "Nail Products",
    unit: "Box",
    currentStock: 1,
    minStockThreshold: 3, // LOW STOCK TRIGGERED
    unitCost: 950,
    retailPrice: 0,
    supplier: "Nail World Distributors",
    lastRestocked: "2026-08-20"
  },
  {
    id: "INV-005",
    name: "Argan Oil Intense Serum 100ml (Retail)",
    category: "Retail Products",
    unit: "Piece",
    currentStock: 18,
    minStockThreshold: 5,
    unitCost: 450,
    retailPrice: 790,
    supplier: "Organic Beauty Inc.",
    lastRestocked: "2026-10-01"
  },
  {
    id: "INV-006",
    name: "Hydra Facial Rejuvenating Serum Pack",
    category: "Facial Care",
    unit: "Pack",
    currentStock: 8,
    minStockThreshold: 4,
    unitCost: 1600,
    retailPrice: 0,
    supplier: "Aesthetic Med Supplies",
    lastRestocked: "2026-09-22"
  }
];

export const initialInventoryLogs = [
  {
    id: "LOG-101",
    date: "2026-10-01T10:30:00",
    productId: "INV-005",
    productName: "Argan Oil Intense Serum 100ml (Retail)",
    type: "STOCK_IN",
    quantity: 15,
    previousStock: 3,
    newStock: 18,
    staffName: "Manager Admin",
    reason: "Monthly Retail Restock Purchase"
  },
  {
    id: "LOG-102",
    date: "2026-10-04T14:15:00",
    productId: "INV-001",
    productName: "L'Oreal Professional Blond Studio Bleach Powder (500g)",
    type: "STOCK_OUT",
    quantity: 1,
    previousStock: 4,
    newStock: 3,
    staffName: "Maria Santos",
    reason: "Used for Balayage Service (Client: Camille Gonzales)"
  },
  {
    id: "LOG-103",
    date: "2026-10-05T11:00:00",
    productId: "INV-004",
    productName: "OPI Gel Color Base & Top Coat Duo",
    type: "STOCK_OUT",
    quantity: 1,
    previousStock: 2,
    newStock: 1,
    staffName: "Ana Reyes",
    reason: "Depleted during Gel Manicure Services"
  }
];

export const initialAppointments = [
  {
    id: "APT-1001",
    clientId: "CLT-001",
    clientName: "Camille Gonzales",
    clientPhone: "0917-123-4567",
    serviceId: "SRV-002",
    serviceName: "Full Balayage & Toning",
    staffId: "STF-001",
    staffName: "Maria Santos",
    date: "2026-10-06",
    time: "10:00",
    duration: 150,
    amount: 3500,
    status: "Completed",
    notes: "User loves light ash blonde tone."
  },
  {
    id: "APT-1002",
    clientId: "CLT-002",
    clientName: "Mark Villanueva",
    clientPhone: "0918-987-6543",
    serviceId: "SRV-004",
    serviceName: "Gentleman's Executive Grooming",
    staffId: "STF-002",
    staffName: "Chef Jhonn Cruz",
    date: "2026-10-06",
    time: "13:30",
    duration: 40,
    amount: 650,
    status: "In-Progress",
    notes: "Low skin fade on sides."
  },
  {
    id: "APT-1003",
    clientId: "CLT-003",
    clientName: "Sofia Mendoza",
    clientPhone: "0920-456-7890",
    serviceId: "SRV-005",
    serviceName: "Luxury Gel Manicure & Pedicure Spa",
    staffId: "STF-003",
    staffName: "Ana Reyes",
    date: "2026-10-06",
    time: "15:00",
    duration: 75,
    amount: 1200,
    status: "Scheduled",
    notes: "Nail art design request."
  },
  {
    id: "APT-1004",
    clientId: "CLT-004",
    clientName: "Patricia Aquino",
    clientPhone: "0922-333-4455",
    serviceId: "SRV-003",
    serviceName: "Brazilian Keratin Treatment",
    staffId: "STF-001",
    staffName: "Maria Santos",
    date: "2026-10-07",
    time: "11:00",
    duration: 120,
    amount: 2800,
    status: "Scheduled",
    notes: "First time client."
  }
];

export const initialStaffServiceTracking = [
  {
    id: "TRK-501",
    date: "2026-10-06T10:00:00",
    staffId: "STF-001",
    staffName: "Maria Santos",
    clientId: "CLT-001",
    clientName: "Camille Gonzales",
    serviceId: "SRV-002",
    serviceName: "Full Balayage & Toning",
    serviceAmount: 3500,
    tipAmount: 200,
    commissionRate: 15,
    commissionEarned: 525, // 3500 * 0.15
    totalEarnings: 725, // 525 + 200
    notes: "Excellent result, client gave cash tip."
  },
  {
    id: "TRK-502",
    date: "2026-10-05T14:00:00",
    staffId: "STF-002",
    staffName: "Chef Jhonn Cruz",
    clientId: "CLT-002",
    clientName: "Mark Villanueva",
    serviceId: "SRV-004",
    serviceName: "Gentleman's Executive Grooming",
    serviceAmount: 650,
    tipAmount: 100,
    commissionRate: 15,
    commissionEarned: 97.5,
    totalEarnings: 197.5,
    notes: "Regular beard trim and hot towel."
  },
  {
    id: "TRK-503",
    date: "2026-10-04T16:00:00",
    staffId: "STF-003",
    staffName: "Ana Reyes",
    clientId: "CLT-003",
    clientName: "Sofia Mendoza",
    serviceId: "SRV-005",
    serviceName: "Luxury Gel Manicure & Pedicure Spa",
    serviceAmount: 1200,
    tipAmount: 150,
    commissionRate: 12,
    commissionEarned: 144,
    totalEarnings: 294,
    notes: "Gel pedicure with custom art."
  },
  {
    id: "TRK-504",
    date: "2026-10-03T11:30:00",
    staffId: "STF-004",
    staffName: "Grace Lim",
    clientId: "CLT-001",
    clientName: "Camille Gonzales",
    serviceId: "SRV-006",
    serviceName: "Glowing Deep Hydration Facial",
    serviceAmount: 1800,
    tipAmount: 200,
    commissionRate: 12,
    commissionEarned: 216,
    totalEarnings: 416,
    notes: "Hydra facial treatment."
  }
];

export const initialSales = [
  {
    id: "INV-2026-001",
    date: "2026-10-06T12:30:00",
    clientId: "CLT-001",
    clientName: "Camille Gonzales",
    items: [
      { name: "Full Balayage & Toning", type: "Service", price: 3500, qty: 1, staff: "Maria Santos" },
      { name: "Argan Oil Intense Serum 100ml", type: "Product", price: 790, qty: 1, productId: "INV-005" }
    ],
    subtotal: 4290,
    discount: 290, // VIP discount
    tax: 0,
    total: 4000,
    paymentMethod: "GCash",
    recordedBy: "Maria Santos",
    status: "Paid"
  },
  {
    id: "INV-2026-002",
    date: "2026-10-05T15:00:00",
    clientId: "CLT-002",
    clientName: "Mark Villanueva",
    items: [
      { name: "Gentleman's Executive Grooming", type: "Service", price: 650, qty: 1, staff: "Chef Jhonn Cruz" }
    ],
    subtotal: 650,
    discount: 0,
    tax: 0,
    total: 650,
    paymentMethod: "Cash",
    recordedBy: "Chef Jhonn Cruz",
    status: "Paid"
  },
  {
    id: "INV-2026-003",
    date: "2026-10-04T17:15:00",
    clientId: "CLT-003",
    clientName: "Sofia Mendoza",
    items: [
      { name: "Luxury Gel Manicure & Pedicure Spa", type: "Service", price: 1200, qty: 1, staff: "Ana Reyes" }
    ],
    subtotal: 1200,
    discount: 100,
    tax: 0,
    total: 1100,
    paymentMethod: "Card",
    recordedBy: "Ana Reyes",
    status: "Paid"
  }
];
