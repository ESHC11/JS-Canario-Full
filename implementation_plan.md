# 🛒 Tienda en Línea — Plan de Arquitectura Final

**Stack:** React + TypeScript · Express + TypeScript · PostgreSQL + Prisma · Stripe · Cloudinary

---

## ✅ Decisiones Confirmadas

| Aspecto | Decisión |
|---|---|
| **Frontend** | React 18 + TypeScript (Vite) |
| **Backend** | Express + TypeScript (ts-node / tsx) |
| **Base de Datos** | PostgreSQL + Prisma ORM |
| **Pagos** | **Stripe** (tarjetas de crédito/débito) |
| **Imágenes** | Cloudinary |
| **Tipo de Productos** | Físicos: Ropa, Calzado y Electrónicos |
| **Hosting sugerido** | Vercel (frontend) + Render (backend) + Supabase (DB) |

---

## 🗂️ Estructura del Proyecto

```
tienda-online/
│
├── 📁 client/                         # React + TypeScript (Vite)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ui/                    # Button, Input, Modal, Badge, Spinner
│   │   │   ├── layout/                # Navbar, Footer, MobileMenu
│   │   │   └── products/              # ProductCard, ProductGrid, ProductFilter
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Shop.tsx               # Catálogo con filtros
│   │   │   ├── ProductDetail.tsx      # Selector de talla/color/variante
│   │   │   ├── Cart.tsx
│   │   │   ├── Checkout.tsx           # Formulario + Stripe Elements
│   │   │   ├── OrderSuccess.tsx       # Confirmación de pago
│   │   │   ├── Orders.tsx             # Historial del usuario
│   │   │   ├── Profile.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── admin/
│   │   │       ├── Dashboard.tsx      # Estadísticas: ventas, stock, órdenes
│   │   │       ├── ManageProducts.tsx # CRUD productos + variantes
│   │   │       └── ManageOrders.tsx   # Cambiar estado de órdenes
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   └── CartContext.tsx        # Carrito persistido en localStorage
│   │   ├── hooks/
│   │   │   ├── useProducts.ts
│   │   │   ├── useCart.ts
│   │   │   └── useAuth.ts
│   │   ├── services/
│   │   │   ├── api.ts                 # Axios con interceptor de JWT
│   │   │   ├── authService.ts
│   │   │   ├── productService.ts
│   │   │   ├── orderService.ts
│   │   │   └── paymentService.ts      # Llamadas a Stripe
│   │   ├── types/                     # Tipos TypeScript globales
│   │   │   ├── product.types.ts
│   │   │   ├── order.types.ts
│   │   │   └── user.types.ts
│   │   ├── utils/
│   │   │   ├── formatPrice.ts
│   │   │   └── cn.ts                  # Utilidad para classNames
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── .env
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── package.json
│
├── 📁 server/                         # Express + TypeScript
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts                  # Prisma Client singleton
│   │   │   └── cloudinary.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── product.controller.ts
│   │   │   ├── order.controller.ts
│   │   │   ├── payment.controller.ts  # Stripe payment intent
│   │   │   └── user.controller.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts     # Verificación JWT
│   │   │   ├── admin.middleware.ts    # Protección rutas admin
│   │   │   ├── upload.middleware.ts   # Multer → Cloudinary
│   │   │   └── errorHandler.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── product.routes.ts
│   │   │   ├── order.routes.ts
│   │   │   ├── payment.routes.ts
│   │   │   └── user.routes.ts
│   │   ├── types/
│   │   │   └── express.d.ts           # Extensión de Request con user
│   │   └── app.ts                     # Punto de entrada Express
│   ├── prisma/
│   │   └── schema.prisma
│   ├── .env
│   ├── tsconfig.json
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🗄️ Esquema de Base de Datos (Prisma)

> Diseñado para soportar variantes de producto (talla S/M/L, color Rojo/Azul, modelo, etc.)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Usuarios ─────────────────────────────────────────

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(CUSTOMER)
  address   Address?
  orders    Order[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Address {
  id         String @id @default(cuid())
  user       User   @relation(fields: [userId], references: [id])
  userId     String @unique
  street     String
  city       String
  state      String
  postalCode String
  country    String @default("MX")
}

// ─── Catálogo ─────────────────────────────────────────

model Category {
  id       String    @id @default(cuid())
  name     String    @unique   // Ropa, Calzado, Electrónicos
  slug     String    @unique
  products Product[]
}

model Product {
  id          String           @id @default(cuid())
  name        String
  description String?
  slug        String           @unique
  basePrice   Float
  images      String[]         // URLs de Cloudinary
  category    Category         @relation(fields: [categoryId], references: [id])
  categoryId  String
  variants    ProductVariant[] // Tallas, colores, modelos
  isActive    Boolean          @default(true)
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
}

model ProductVariant {
  id         String      @id @default(cuid())
  product    Product     @relation(fields: [productId], references: [id])
  productId  String
  sku        String      @unique   // Código único: "NIKE-AM-42-ROJO"
  size       String?               // S, M, L, XL / 38, 39, 40...
  color      String?               // Rojo, Negro, Blanco
  storage    String?               // 128GB (electrónicos)
  price      Float?                // Precio extra vs basePrice (null = igual)
  stock      Int         @default(0)
  orderItems OrderItem[]
}

// ─── Órdenes y Pagos ──────────────────────────────────

model Order {
  id              String      @id @default(cuid())
  user            User        @relation(fields: [userId], references: [id])
  userId          String
  items           OrderItem[]
  subtotal        Float
  shippingCost    Float       @default(0)
  total           Float
  status          OrderStatus @default(PENDING)
  stripePaymentId String?     // ID del PaymentIntent de Stripe
  shippingAddress Json        // Snapshot de la dirección al comprar
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}

model OrderItem {
  id        String         @id @default(cuid())
  order     Order          @relation(fields: [orderId], references: [id])
  orderId   String
  variant   ProductVariant @relation(fields: [variantId], references: [id])
  variantId String
  quantity  Int
  unitPrice Float          // Precio capturado al momento de comprar
}

// ─── Enums ────────────────────────────────────────────

enum Role {
  CUSTOMER
  ADMIN
}

enum OrderStatus {
  PENDING      // Esperando pago
  PAID         // Pago confirmado por Stripe
  PROCESSING   // Preparando envío
  SHIPPED      // En camino
  DELIVERED    // Entregado
  CANCELLED
  REFUNDED
}
```

---

## 💳 Flujo de Pago con Stripe

```
[Cliente]                  [Frontend]               [Backend]              [Stripe]
   │                           │                        │                      │
   │── Click "Pagar" ─────────>│                        │                      │
   │                           │── POST /payments/intent─>                     │
   │                           │                        │── createPaymentIntent─>│
   │                           │                        │<── client_secret ────│
   │                           │<── { client_secret } ──│                      │
   │                           │                        │                      │
   │                    [Stripe Elements]               │                      │
   │── Ingresa tarjeta ────────>│                        │                      │
   │                           │─────────────────────────────────── confirmPayment ─>│
   │                           │                        │<─── Webhook: payment_succeeded │
   │                           │                        │── Actualiza Order.status = PAID
   │                           │<── Redirige a /success ─│                     │
```

---

## 🔌 Endpoints del API

### Auth
| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/auth/register` | Registro |
| `POST` | `/api/auth/login` | Login → JWT |
| `GET` | `/api/auth/me` | Perfil actual 🔐 |

### Productos
| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/products` | Listar (filtros: categoría, precio, talla) |
| `GET` | `/api/products/:slug` | Detalle con variantes |
| `POST` | `/api/products` | Crear 🔐 Admin |
| `PUT` | `/api/products/:id` | Editar 🔐 Admin |
| `DELETE` | `/api/products/:id` | Eliminar (soft delete) 🔐 Admin |

### Órdenes
| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/orders` | Mis órdenes 🔐 |
| `POST` | `/api/orders` | Crear orden 🔐 |
| `GET` | `/api/orders/:id` | Detalle 🔐 |
| `PUT` | `/api/orders/:id/status` | Cambiar estado 🔐 Admin |

### Pagos
| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/payments/intent` | Crear PaymentIntent 🔐 |
| `POST` | `/api/payments/webhook` | Webhook de Stripe ⚡ |

---

## 📦 Dependencias Clave

### `client/package.json`
```json
{
  "dependencies": {
    "react": "^18",
    "react-dom": "^18",
    "react-router-dom": "^6",
    "axios": "^1",
    "zustand": "^4",
    "@tanstack/react-query": "^5",
    "@stripe/react-stripe-js": "^2",
    "@stripe/stripe-js": "^3"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "vite": "^5",
    "@vitejs/plugin-react": "^4"
  }
}
```

### `server/package.json`
```json
{
  "dependencies": {
    "express": "^4",
    "prisma": "^5",
    "@prisma/client": "^5",
    "jsonwebtoken": "^9",
    "bcryptjs": "^2",
    "cors": "^2",
    "dotenv": "^16",
    "multer": "^1",
    "cloudinary": "^2",
    "stripe": "^14"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/express": "^4",
    "@types/jsonwebtoken": "^9",
    "@types/bcryptjs": "^2",
    "@types/multer": "^1",
    "@types/cors": "^2",
    "tsx": "^4",
    "ts-node": "^10"
  }
}
```

---

## 🚀 Comandos de Inicialización

```bash
# 1. Crear estructura raíz
mkdir tienda-online && cd tienda-online

# 2. Frontend
npm create vite@latest client -- --template react-ts
cd client && npm install

# 3. Backend
mkdir ../server && cd ../server
npm init -y
npm install express @prisma/client jsonwebtoken bcryptjs cors dotenv stripe cloudinary multer
npm install -D typescript tsx @types/express @types/jsonwebtoken @types/bcryptjs @types/cors @types/multer
npx tsc --init
npx prisma init

# 4. Correr en desarrollo
# Terminal 1 (backend):  cd server && npx tsx watch src/app.ts
# Terminal 2 (frontend): cd client && npm run dev
```

---

## ⚙️ Variables de Entorno

### `server/.env`
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/tienda_db"
JWT_SECRET="cambia_esto_por_algo_seguro"
PORT=5000
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### `client/.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY="pk_test_..."
```

---

## ✅ ¿Apruebas este plan para empezar a generar el código?

> [!IMPORTANT]
> Una vez aprobado, empezaré generando la estructura completa: `package.json`, `tsconfig.json`, `schema.prisma`, el servidor Express base, y el cliente React con rutas configuradas.
