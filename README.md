# 🎨 PixelMind AI - Rasm Yaratuvchi Sayt

AI yordamida matndan rasm yaratuvchi to'liq funksional veb-sayt.

## ✨ Imkoniyatlar

- 🤖 **AI rasm yaratish** - FLUX modellari bilan
- 💳 **3 ta tarif rejimi** - Bepul ($0), Normal ($10/oy), Pro ($100/oy)
- 🔐 **Autentifikatsiya** - Email/parol bilan kirish
- 💰 **Stripe to'lov** - Xavfsiz onlayn to'lov
- 🎨 **10+ uslub** - Fotorealistik, anime, 3D va boshqalar
- 📱 **Responsive dizayn** - Barcha qurilmalarda ishlaydi
- ✨ **Animatsiyalar** - Framer Motion bilan

## 🚀 O'rnatish

### 1. Node.js o'rnatish
https://nodejs.org dan Node.js 18+ yuklab oling

### 2. Loyihani o'rnatish
```bash
cd imagegen-app
npm install
```

### 3. Prisma database yaratish
```bash
npx prisma generate
npx prisma db push
```

### 4. .env.local faylini to'ldirish

#### Replicate API (rasm yaratish)
1. https://replicate.com ga boring
2. Hisob yarating
3. https://replicate.com/account/api-tokens dan token oling
4. `.env.local` ga `REPLICATE_API_TOKEN=r8_...` qo'ying

#### Stripe (to'lov)
1. https://stripe.com ga boring
2. Hisob yarating
3. https://dashboard.stripe.com/apikeys dan kalitlarni oling
4. Stripe dashboard > Products > Add product:
   - "Normal Plan" - $10/month recurring
   - "Pro Plan" - $100/month recurring
5. Price ID larni `.env.local` ga qo'ying

### 5. Ishga tushirish
```bash
npm run dev
```

Brauzerda: http://localhost:3000

## 📁 Loyiha tuzilmasi

```
imagegen-app/
├── app/
│   ├── page.tsx          # Bosh sahifa
│   ├── generate/         # Rasm yaratish
│   ├── dashboard/        # Foydalanuvchi paneli
│   ├── login/            # Kirish
│   ├── register/         # Ro'yxatdan o'tish
│   └── api/
│       ├── auth/         # NextAuth + Register
│       ├── generate/     # AI rasm yaratish
│       ├── stripe/       # To'lov tizimi
│       └── user/         # Foydalanuvchi ma'lumotlari
├── components/           # UI komponentlar
├── lib/                  # Yordamchi funksiyalar
├── prisma/               # Database schema
└── types/                # TypeScript turlari
```

## 💰 Tarif rejimlari

| Rejim | Narx | Kreditlar | O'lcham |
|-------|------|-----------|---------|
| Bepul | $0 | 3 ta | 512×512 |
| Normal | $10/oy | 50 ta/oy | 1024×1024 |
| Pro | $100/oy | Cheksiz | 4K |

## 🛠️ Texnologiyalar

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animatsiyalar
- **Replicate** - AI rasm yaratish (FLUX)
- **Stripe** - To'lov tizimi
- **NextAuth** - Autentifikatsiya
- **Prisma + SQLite** - Database
- **React Hot Toast** - Bildirishnomalar
