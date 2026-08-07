import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Seed Default Admin User with valid bcrypt hash for "Admin@123456"
  const adminEmail = 'admin@inventory.com';
  const adminPasswordHash = await bcrypt.hash('Admin@123456', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: adminPasswordHash,
    },
    create: {
      name: 'System Admin',
      email: adminEmail,
      password: adminPasswordHash,
      role: Role.ADMIN,
    },
  });
  console.log(`👤 Admin user seeded: ${adminUser.email}`);

  // 2. Seed Default Category
  const categoryName = 'Electronics';
  const category = await prisma.category.upsert({
    where: { name: categoryName },
    update: {},
    create: {
      name: categoryName,
      description: 'Electronic devices, gadgets, and accessories',
    },
  });
  console.log(`🏷️ Category seeded: ${category.name}`);

  // 3. Seed Default Supplier
  const supplierName = 'TechSupply Logistics Ltd';
  const supplier = await prisma.supplier.upsert({
    where: { name: supplierName },
    update: {},
    create: {
      name: supplierName,
      email: 'contact@techsupply.com',
      phone: '+1-800-555-0199',
      address: '100 Technology Parkway, Silicon Valley, CA',
    },
  });
  console.log(`🏭 Supplier seeded: ${supplier.name}`);

  // 4. Seed Default Product
  const productSku = 'PROD-ELEC-001';
  const product = await prisma.product.upsert({
    where: { sku: productSku },
    update: {},
    create: {
      productName: 'Wireless Noise-Canceling Headphones',
      sku: productSku,
      description: 'Premium over-ear Bluetooth headphones with active noise cancellation.',
      quantity: 50,
      lowStockThreshold: 10,
      unitPrice: 199.99,
      categoryId: category.id,
      supplierId: supplier.id,
    },
  });
  console.log(`📦 Product seeded: ${product.productName} (SKU: ${product.sku})`);

  console.log('✅ Database seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Database seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
