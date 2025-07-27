// src/data/products.js

export const sampleProducts = [
    {
      id: 101,
      name: "22K Temple Gold Necklace",
      category: "Necklace",
      description: "Intricately carved with Lakshmi motifs and antique finish.",
      image: "/products/necklace-22k.png",
      netWeight: 14.2,
      grossWeight: 15.0,
      discountedPrice: 96700,
      originalPrice: 102000,
      fullPrice: 96700,
      partialPercent: 40,
      metalType: "Gold",
      metalColor: "Yellow",
      securePlan: true,
      inStock: true,
      combo: true,
      badges: ["BIS", "Trending", "Fast Delivery"]
    },
    {
      id: 102,
      name: "Rose Gold Diamond Ring",
      category: "Ring",
      description: "Elegant solitaire with diamond-studded band.",
      image: "/products/ring-rose-gold.png",
      netWeight: 3.1,
      grossWeight: 3.5,
      discountedPrice: 18700,
      originalPrice: 20000,
      fullPrice: 18700,
      partialPercent: 40,
      metalType: "Diamond",
      metalColor: "Rose",
      securePlan: true,
      inStock: true,
      combo: false,
      badges: ["BIS", "Bestseller"]
    },

    {
      components: [
        {
          name: "Gold Value",
          rate: "₹5850/g",
          weight: "14.2g",
          value: 83070,
          discount: "₹2000",
          finalValue: 81070
        },
        {
          name: "Making Charges",
          rate: "-",
          weight: "-",
          value: 5000,
          discount: "-",
          finalValue: 5000
        }
      ],
      total: 86070,
      gst: 2582,
      grandTotal: 88652
    },
    


  ];
  
  