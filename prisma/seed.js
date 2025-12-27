/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .concat("-", Math.random().toString(36).slice(2, 6));
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";
  const hashed = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hashed, role: "ADMIN", name: "Admin" },
    create: { email: adminEmail, password: hashed, role: "ADMIN", name: "Admin" },
  });

  const count = await prisma.product.count();
  if (count === 0) {
    await prisma.product.createMany({
      data: [
        {
          name: "Ayurvedic Herbal Tea",
          slug: slugify("Ayurvedic Herbal Tea"),
          price: 29900,
          category: "Beverages",
          stock: 50,
          imageUrl:
            "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80",
          description: "Calming herbal blend to support digestion and relaxation.",
          isActive: true,
        },
        {
          name: "Turmeric Wellness Capsules",
          slug: slugify("Turmeric Wellness Capsules"),
          price: 49900,
          category: "Supplements",
          stock: 60,
          imageUrl:
            "https://images.unsplash.com/photo-1612219967575-07b2a86c6c51?auto=format&fit=crop&w=900&q=80",
          description: "Curcumin-rich capsules for daily immunity and joint support.",
          isActive: true,
        },
        {
          name: "Neem & Aloe Face Wash",
          slug: slugify("Neem & Aloe Face Wash"),
          price: 25900,
          category: "Skincare",
          stock: 40,
          imageUrl:
            "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80",
          description: "Gentle cleanser with neem, aloe, and essential oils.",
          isActive: true,
        },
        {
          name: "Organic Shilajit Resin",
          slug: slugify("Organic Shilajit Resin"),
          price: 129900,
          category: "Supplements",
          stock: 30,
          imageUrl:
            "https://images.unsplash.com/photo-1612219967575-07b2a86c6c51?auto=format&fit=crop&w=900&q=80",
          description: "Purified Himalayan shilajit for daily vitality and stamina support.",
          isActive: true,
        },
      ],
    });
  }

  console.log("Seed completed. Admin:", adminEmail);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
