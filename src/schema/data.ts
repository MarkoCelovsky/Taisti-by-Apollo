/* eslint-disable max-len */
import { Stock } from "./types";

export const sportsStocks: Stock[] = [
    {
        symbol: "NIKE",
        companyName: "Nike, Inc.",
        currentPrice: 123.45,
        priceChanges: [
            { date: 1680920000000, price: 125.1, change: -1.65, changePercent: -1.32 }, // 2024-04-04
            { date: 1680833600000, price: 126.75, change: -0.3, changePercent: -0.24 }, // 2024-04-03
            { date: 1680747200000, price: 127.05, change: 0.5, changePercent: 0.4 }, // 2024-04-02
            { date: 1680660800000, price: 126.55, change: -1.2, changePercent: -0.94 }, // 2024-04-01
            { date: 1679990400000, price: 127.75, change: 1.75, changePercent: 1.38 }, // 2024-03-31
        ],
    },
    {
        symbol: "ADIDAS",
        companyName: "Adidas AG",
        currentPrice: 95.67,
        priceChanges: [
            { date: 1680920000000, price: 97.2, change: -1.53, changePercent: -1.57 },
            { date: 1680833600000, price: 98.75, change: -0.4, changePercent: -0.4 },
            { date: 1680747200000, price: 99.15, change: 0.6, changePercent: 0.61 },
            { date: 1680660800000, price: 98.55, change: -1.25, changePercent: -1.25 },
            { date: 1679990400000, price: 99.8, change: 1.85, changePercent: 1.89 },
        ],
    },
    {
        symbol: "PUMA",
        companyName: "Puma SE",
        currentPrice: 78.32,
        priceChanges: [
            { date: 1680920000000, price: 79.9, change: -1.58, changePercent: -1.98 },
            { date: 1680833600000, price: 80.5, change: -0.6, changePercent: -0.74 },
            { date: 1680747200000, price: 81.1, change: 0.6, changePercent: 0.75 },
            { date: 1680660800000, price: 80.5, change: -1.2, changePercent: -1.47 },
            { date: 1679990400000, price: 81.7, change: 1.2, changePercent: 1.49 },
        ],
    },
    {
        symbol: "UNDERARMOUR",
        companyName: "Under Armour, Inc.",
        currentPrice: 34.89,
        priceChanges: [
            { date: 1680920000000, price: 35.5, change: -0.61, changePercent: -1.72 },
            { date: 1680833600000, price: 36.1, change: -0.5, changePercent: -1.37 },
            { date: 1680747200000, price: 36.6, change: 0.5, changePercent: 1.39 },
            { date: 1680660800000, price: 36.1, change: -0.5, changePercent: -1.37 },
            { date: 1679990400000, price: 36.6, change: 1.1, changePercent: 3.09 },
        ],
    },
    {
        symbol: "REEBOK",
        companyName: "Reebok International Ltd.",
        currentPrice: 45.2,
        priceChanges: [
            { date: 1680920000000, price: 46.8, change: -1.6, changePercent: -3.42 },
            { date: 1680833600000, price: 47.4, change: -0.6, changePercent: -1.25 },
            { date: 1680747200000, price: 47.8, change: 0.4, changePercent: 0.84 },
            { date: 1680660800000, price: 47.1, change: -0.6, changePercent: -1.26 },
            { date: 1679990400000, price: 48.1, change: 1.0, changePercent: 2.12 },
        ],
    },
];

export const gastronomyStocks: Stock[] = [
    {
        symbol: "MCD",
        companyName: "McDonald's Corporation",
        currentPrice: 234.56,
        img: "https://s3-symbol-logo.tradingview.com/mcdonalds--600.png",
        priceChanges: [
            { date: 1680920000000, price: 235.1, change: -0.54, changePercent: -0.23 }, // 2024-04-04
            { date: 1680833600000, price: 236.75, change: -0.3, changePercent: -0.13 }, // 2024-04-03
            { date: 1680747200000, price: 237.05, change: 0.5, changePercent: 0.21 }, // 2024-04-02
            { date: 1680660800000, price: 236.55, change: -0.2, changePercent: -0.08 }, // 2024-04-01
            { date: 1679990400000, price: 237.75, change: 1.75, changePercent: 0.74 }, // 2024-03-31
        ],
    },
    {
        symbol: "SBUX",
        companyName: "Starbucks Corporation",
        img: "https://s3-symbol-logo.tradingview.com/starbucks--600.png",
        currentPrice: 125.67,
        priceChanges: [
            { date: 1680920000000, price: 124.1, change: -1.57, changePercent: -1.26 },
            { date: 1680833600000, price: 126.75, change: -0.3, changePercent: -0.24 },
            { date: 1680747200000, price: 126.95, change: 0.2, changePercent: 0.16 },
            { date: 1680660800000, price: 126.55, change: -0.4, changePercent: -0.32 },
            { date: 1679990400000, price: 127.75, change: 1.2, changePercent: 0.95 },
        ],
    },
    {
        symbol: "YUM",
        companyName: "Yum! Brands, Inc.",
        currentPrice: 178.32,
        img: "https://s3-symbol-logo.tradingview.com/yum-brands--600.png",
        priceChanges: [
            { date: 1680920000000, price: 179.9, change: -1.58, changePercent: -0.88 },
            { date: 1680833600000, price: 180.5, change: -0.6, changePercent: -0.33 },
            { date: 1680747200000, price: 180.1, change: 0.6, changePercent: 0.33 },
            { date: 1680660800000, price: 179.5, change: -0.6, changePercent: -0.33 },
            { date: 1679990400000, price: 180.7, change: 1.2, changePercent: 0.67 },
        ],
    },
    {
        symbol: "DPZ",
        companyName: "Domino's Pizza, Inc.",
        currentPrice: 410.45,
        img: "https://s3-symbol-logo.tradingview.com/dominos-pizza--600.png",
        priceChanges: [
            { date: 1680920000000, price: 415.8, change: -5.35, changePercent: -1.29 },
            { date: 1680833600000, price: 420.75, change: -1.8, changePercent: -0.43 },
            { date: 1680747200000, price: 422.55, change: 0.8, changePercent: 0.19 },
            { date: 1680660800000, price: 421.45, change: -1.1, changePercent: -0.26 },
            { date: 1679990400000, price: 422.55, change: 2.1, changePercent: 0.5 },
        ],
    },
    {
        symbol: "CMG",
        companyName: "Chipotle Mexican Grill, Inc.",
        currentPrice: 1365.2,
        img: "https://s3-symbol-logo.tradingview.com/chipotle-mexican-grill--600.png",
        priceChanges: [
            { date: 1680920000000, price: 1375.8, change: -10.6, changePercent: -0.77 },
            { date: 1680833600000, price: 1380.75, change: -5.95, changePercent: -0.43 },
            { date: 1680747200000, price: 1382.55, change: 1.8, changePercent: 0.13 },
            { date: 1680660800000, price: 1381.45, change: -1.1, changePercent: -0.08 },
            { date: 1679990400000, price: 1382.55, change: 1.1, changePercent: 0.08 },
        ],
    },
];

export const healthcareStocks: Stock[] = [
    {
        symbol: "PFE",
        companyName: "Pfizer Inc.",
        currentPrice: 64.2,
        img: "https://s3-symbol-logo.tradingview.com/pfizer--600.png",
        priceChanges: [
            { date: 1680920000000, price: 65.1, change: -0.9, changePercent: -1.39 }, // 2024-04-04
            { date: 1680833600000, price: 65.75, change: -0.65, changePercent: -0.98 }, // 2024-04-03
            { date: 1680747200000, price: 66.05, change: 0.3, changePercent: 0.46 }, // 2024-04-02
            { date: 1680660800000, price: 65.55, change: -0.5, changePercent: -0.76 }, // 2024-04-01
            { date: 1679990400000, price: 66.75, change: 1.2, changePercent: 1.83 }, // 2024-03-31
        ],
    },
    {
        symbol: "JNJ",
        companyName: "Johnson & Johnson",
        currentPrice: 152.67,
        img: "https://s3-symbol-logo.tradingview.com/johnson-and-johnson--600.png",
        priceChanges: [
            { date: 1680920000000, price: 151.1, change: -1.57, changePercent: -1.03 },
            { date: 1680833600000, price: 153.75, change: -0.3, changePercent: -0.2 },
            { date: 1680747200000, price: 153.95, change: 0.2, changePercent: 0.13 },
            { date: 1680660800000, price: 153.55, change: -0.4, changePercent: -0.26 },
            { date: 1679990400000, price: 154.75, change: 1.2, changePercent: 0.78 },
        ],
    },
    {
        symbol: "GILD",
        companyName: "Gilead Sciences, Inc.",
        currentPrice: 82.32,
        img: "https://s3-symbol-logo.tradingview.com/gilead--600.png",
        priceChanges: [
            { date: 1680920000000, price: 83.9, change: -1.58, changePercent: -1.89 },
            { date: 1680833600000, price: 84.5, change: -0.6, changePercent: -0.71 },
            { date: 1680747200000, price: 84.1, change: 0.6, changePercent: 0.72 },
            { date: 1680660800000, price: 83.5, change: -0.6, changePercent: -0.71 },
            { date: 1679990400000, price: 84.7, change: 1.2, changePercent: 1.44 },
        ],
    },
    {
        symbol: "MRK",
        companyName: "Merck & Co., Inc.",
        currentPrice: 76.45,
        img: "https://s3-symbol-logo.tradingview.com/merck-and-co--600.png",
        priceChanges: [
            { date: 1680920000000, price: 77.8, change: -1.35, changePercent: -1.73 },
            { date: 1680833600000, price: 78.75, change: -0.95, changePercent: -1.19 },
            { date: 1680747200000, price: 78.95, change: 0.2, changePercent: 0.25 },
            { date: 1680660800000, price: 78.45, change: -0.3, changePercent: -0.38 },
            { date: 1679990400000, price: 79.55, change: 1.1, changePercent: 1.4 },
        ],
    },
    {
        symbol: "UNH",
        companyName: "UnitedHealth Group Incorporated",
        currentPrice: 345.2,
        img: "https://s3-symbol-logo.tradingview.com/unitedhealth--600.png",
        priceChanges: [
            { date: 1680920000000, price: 347.8, change: -2.6, changePercent: -0.75 },
            { date: 1680833600000, price: 350.75, change: -3.95, changePercent: -1.11 },
            { date: 1680747200000, price: 352.55, change: 1.8, changePercent: 0.51 },
            { date: 1680660800000, price: 351.45, change: -1.1, changePercent: -0.31 },
            { date: 1679990400000, price: 352.55, change: 1.1, changePercent: 0.31 },
        ],
    },
];

export const entertainmentStocks: Stock[] = [
    {
        symbol: "DIS",
        companyName: "The Walt Disney Company",
        currentPrice: 150.2,
        img: "https://s3-symbol-logo.tradingview.com/walt-disney--600.png",
        priceChanges: [
            { date: 1680920000000, price: 151.1, change: -0.9, changePercent: -0.6 }, // 2024-04-04
            { date: 1680833600000, price: 152.75, change: -0.65, changePercent: -0.42 }, // 2024-04-03
            { date: 1680747200000, price: 152.05, change: 0.3, changePercent: 0.2 }, // 2024-04-02
            { date: 1680660800000, price: 151.55, change: -0.5, changePercent: -0.33 }, // 2024-04-01
            { date: 1679990400000, price: 152.75, change: 1.2, changePercent: 0.79 }, // 2024-03-31
        ],
    },
    {
        symbol: "NFLX",
        companyName: "Netflix, Inc.",
        currentPrice: 485.67,
        img: "https://s3-symbol-logo.tradingview.com/netflix--600.png",
        priceChanges: [
            { date: 1680920000000, price: 484.1, change: -1.57, changePercent: -0.32 },
            { date: 1680833600000, price: 486.75, change: -0.3, changePercent: -0.06 },
            { date: 1680747200000, price: 486.95, change: 0.2, changePercent: 0.04 },
            { date: 1680660800000, price: 486.55, change: -0.4, changePercent: -0.08 },
            { date: 1679990400000, price: 487.75, change: 1.2, changePercent: 0.25 },
        ],
    },
    {
        symbol: "CMCSA",
        companyName: "Comcast Corporation",
        currentPrice: 62.32,
        img: "https://s3-symbol-logo.tradingview.com/comcast--600.png",
        priceChanges: [
            { date: 1680920000000, price: 63.9, change: -1.58, changePercent: -2.48 },
            { date: 1680833600000, price: 64.5, change: -0.6, changePercent: -0.92 },
            { date: 1680747200000, price: 64.1, change: 0.6, changePercent: 0.94 },
            { date: 1680660800000, price: 63.5, change: -0.6, changePercent: -0.93 },
            { date: 1679990400000, price: 64.7, change: 1.2, changePercent: 1.89 },
        ],
    },
    {
        symbol: "DISCA",
        companyName: "Discovery, Inc.",
        currentPrice: 45.45,
        img: "https://s3-symbol-logo.tradingview.com/discovery-ltd--600.png",
        priceChanges: [
            { date: 1680920000000, price: 44.8, change: -0.65, changePercent: -1.44 },
            { date: 1680833600000, price: 45.75, change: -1.3, changePercent: -2.77 },
            { date: 1680747200000, price: 46.95, change: 0.2, changePercent: 0.43 },
            { date: 1680660800000, price: 47.15, change: -0.4, changePercent: -0.84 },
            { date: 1679990400000, price: 47.35, change: 1.2, changePercent: 2.6 },
        ],
    },
    {
        symbol: "LUMN",
        companyName: "Lumen Technologies, Inc.",
        currentPrice: 30.2,
        img: "https://s3-symbol-logo.tradingview.com/lumen--600.png",
        priceChanges: [
            { date: 1680920000000, price: 31.1, change: -0.9, changePercent: -2.9 },
            { date: 1680833600000, price: 31.75, change: -0.65, changePercent: -2.0 },
            { date: 1680747200000, price: 32.05, change: 0.3, changePercent: 0.95 },
            { date: 1680660800000, price: 31.55, change: -0.5, changePercent: -1.56 },
            { date: 1679990400000, price: 32.75, change: 1.2, changePercent: 3.8 },
        ],
    },
];

export const technologyStocks: Stock[] = [
    {
        symbol: "AAPL",
        companyName: "Apple Inc.",
        img: "https://i.pngimg.me/thumb/f/720/compngwingygchm.jpg",
        currentPrice: 189.2,
        priceChanges: [
            { date: 1680920000000, price: 190.1, change: -0.9, changePercent: -0.47 }, // 2024-04-04
            { date: 1680833600000, price: 191.75, change: -0.65, changePercent: -0.34 }, // 2024-04-03
            { date: 1680747200000, price: 191.05, change: 0.3, changePercent: 0.16 }, // 2024-04-02
            { date: 1680660800000, price: 190.55, change: -0.5, changePercent: -0.26 }, // 2024-04-01
            { date: 1679990400000, price: 191.75, change: 1.2, changePercent: 0.63 }, // 2024-03-31
        ],
    },
    {
        symbol: "MSFT",
        companyName: "Microsoft Corporation",
        currentPrice: 245.67,
        img: "https://s3-symbol-logo.tradingview.com/microsoft--600.png",
        priceChanges: [
            { date: 1680920000000, price: 244.1, change: -1.57, changePercent: -0.64 },
            { date: 1680833600000, price: 246.75, change: -0.3, changePercent: -0.12 },
            { date: 1680747200000, price: 246.95, change: 0.2, changePercent: 0.08 },
            { date: 1680660800000, price: 246.55, change: -0.4, changePercent: -0.16 },
            { date: 1679990400000, price: 247.75, change: 1.2, changePercent: 0.49 },
        ],
    },
    {
        symbol: "GOOGL",
        companyName: "Alphabet Inc. (Class A)",
        currentPrice: 3010.32,
        img: "https://s3-symbol-logo.tradingview.com/alphabet--600.png",
        priceChanges: [
            { date: 1680920000000, price: 3011.9, change: -1.58, changePercent: -0.05 },
            { date: 1680833600000, price: 3012.5, change: -0.6, changePercent: -0.02 },
            { date: 1680747200000, price: 3012.1, change: 0.6, changePercent: 0.02 },
            { date: 1680660800000, price: 3011.5, change: -0.6, changePercent: -0.02 },
            { date: 1679990400000, price: 3012.7, change: 1.2, changePercent: 0.04 },
        ],
    },
    {
        symbol: "TSLA",
        companyName: "Tesla, Inc.",
        img: "https://s3-symbol-logo.tradingview.com/tesla--600.png",
        currentPrice: 865.45,
        priceChanges: [
            { date: 1680920000000, price: 860.8, change: -4.65, changePercent: -0.54 },
            { date: 1680833600000, price: 861.75, change: -0.95, changePercent: -0.11 },
            { date: 1680747200000, price: 862.55, change: 0.8, changePercent: 0.09 },
            { date: 1680660800000, price: 861.45, change: -1.1, changePercent: -0.13 },
            { date: 1679990400000, price: 862.55, change: 1.1, changePercent: 0.13 },
        ],
    },
    {
        symbol: "AMZN",
        companyName: "Amazon.com, Inc.",
        img: "https://static.stocktitan.net/company-logo/amzn.png",
        currentPrice: 3275.2,
        priceChanges: [
            { date: 1680920000000, price: 3280.8, change: -5.6, changePercent: -0.17 },
            { date: 1680833600000, price: 3281.75, change: -0.95, changePercent: -0.03 },
            { date: 1680747200000, price: 3282.55, change: 0.8, changePercent: 0.02 },
            { date: 1680660800000, price: 3281.45, change: -1.1, changePercent: -0.03 },
            { date: 1679990400000, price: 3282.55, change: 1.1, changePercent: 0.03 },
        ],
    },
];
