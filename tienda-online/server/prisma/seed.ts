import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando inyección de datos (Seeding)...')

  // 1. Limpiar la base de datos (opcional, útil en desarrollo)
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  // 2. Crear Categorías
  const catCamisetas = await prisma.category.create({ data: { name: 'Camisetas', slug: 'camisetas' } })
  const catHoodies = await prisma.category.create({ data: { name: 'Hoodies', slug: 'hoodies' } })
  const catPantalones = await prisma.category.create({ data: { name: 'Pantalones', slug: 'pantalones' } })
  const catBlusas = await prisma.category.create({ data: { name: 'Blusas', slug: 'blusas' } })
  const catCalzado = await prisma.category.create({ data: { name: 'Calzado', slug: 'calzado' } })

  console.log('✅ Categorías creadas')

  // 3. Crear Productos Destacados (Los que vimos en Home.tsx)
  await prisma.product.create({
    data: {
      name: 'Hoodie con estampado de calavera',
      slug: 'hoodie-calavera',
      description: 'Hoodie cómoda de algodón con diseño exclusivo de calavera.',
      basePrice: 350,
      categoryId: catHoodies.id,
      images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=400&auto=format&fit=crop'],
      variants: {
        create: [
          { sku: 'HD-CAL-M', size: 'M', stock: 10, price: 350 },
          { sku: 'HD-CAL-G', size: 'G', stock: 5, price: 350 }
        ]
      }
    }
  })

  await prisma.product.create({
    data: {
      name: 'Chamarra de cuero',
      slug: 'chamarra-cuero',
      description: 'Chamarra de cuero sintético premium para cualquier ocasión.',
      basePrice: 470,
      categoryId: catHoodies.id, // O crea categoría "Chamarras"
      images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=400&auto=format&fit=crop'],
      variants: {
        create: [
          { sku: 'CH-CUE-CH', size: 'CH', stock: 15, price: 470 }
        ]
      }
    }
  })

  await prisma.product.create({
    data: {
      name: 'Pantalón cargo negro',
      slug: 'pantalon-cargo-negro',
      description: 'Pantalón cargo de alta durabilidad con múltiples bolsillos.',
      basePrice: 600,
      categoryId: catPantalones.id,
      images: ['https://images.unsplash.com/photo-1624378439575-d1ead6bb2460?q=80&w=400&auto=format&fit=crop'],
      variants: {
        create: [
          { sku: 'PT-CAR-G', size: 'G', stock: 8, price: 600 }
        ]
      }
    }
  })

  await prisma.product.create({
    data: {
      name: 'Suéter café',
      slug: 'sueter-cafe',
      description: 'Suéter tejido ligero ideal para el otoño.',
      basePrice: 222,
      categoryId: catHoodies.id,
      images: ['https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=400&auto=format&fit=crop'],
      variants: {
        create: [
          { sku: 'SU-CAF-M', size: 'M', stock: 20, price: 222 }
        ]
      }
    }
  })

  await prisma.product.create({
    data: {
      name: 'Camisa azul marino',
      slug: 'camisa-azul-marino',
      description: 'Camisa formal manga larga azul marino.',
      basePrice: 222,
      categoryId: catCamisetas.id,
      images: ['https://images.unsplash.com/photo-1596755094514-f87e32f6b474?q=80&w=400&auto=format&fit=crop'],
      variants: {
        create: [
          { sku: 'CM-AZU-M', size: 'M', stock: 12, price: 222 }
        ]
      }
    }
  })

  console.log('✅ Productos creados con éxito')
}

main()
  .catch((e) => {
    console.error('❌ Error inyectando datos:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
