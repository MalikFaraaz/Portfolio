import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Admin User
  const adminEmail = process.env.ADMIN_EMAIL || "faraz.hassan@example.com";
  const rawPassword = process.env.ADMIN_PASSWORD || "AdminPassword123!";
  const passwordHash = await bcrypt.hash(rawPassword, 12);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
    },
  });

  // 2. SiteSettings
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {
      siteTitle: "Faraz Hassan | Full Stack Developer",
      metaDescription: "Full stack developer from Sialkot, Pakistan. Specializing in Flutter, Next.js, and real-time mobile and web apps.",
      ogImageUrl: null,
      accentLight: "#2457F5",
      accentDark: "#4B7BFF",
      availableBadge: "Available for new projects",
      showBadge: true,
    },
    create: {
      id: 1,
      siteTitle: "Faraz Hassan | Full Stack Developer",
      metaDescription: "Full stack developer from Sialkot, Pakistan. Specializing in Flutter, Next.js, and real-time mobile and web apps.",
      ogImageUrl: null,
      accentLight: "#2457F5",
      accentDark: "#4B7BFF",
      availableBadge: "Available for new projects",
      showBadge: true,
    },
  });

  // 3. Hero
  const heroRoles = [
    "Flutter developer",
    "Full stack developer",
    "Mobile app builder",
    "Problem solver",
  ];
  const heroCode = `// real-time ride state
final rideProvider =
  StateNotifierProvider<RideNotifier, Ride>(
    (ref) => RideNotifier(
      socket: ref.read(pusherProvider),
    ),
  );

// driver moves, map updates
socket.on('driver.moved', (e) {
  state = state.copyWith(driver: e.position);
});`;

  await prisma.hero.upsert({
    where: { id: 1 },
    update: {
      line1: "Hi, I'm Faraz.",
      line2: "I build apps",
      line3: "people love.",
      roles: JSON.stringify(heroRoles),
      lead: "Full stack developer from Sialkot, Pakistan. I turn ideas into fast, polished mobile and web products, from the first screen to the live release.",
      cta1Label: "See my work",
      cta1Href: "#work",
      cta2Label: "Get in touch",
      cta2Href: "#contact",
      codeFile: "ride_provider.dart",
      codeText: heroCode,
      codeLang: "dart",
    },
    create: {
      id: 1,
      line1: "Hi, I'm Faraz.",
      line2: "I build apps",
      line3: "people love.",
      roles: JSON.stringify(heroRoles),
      lead: "Full stack developer from Sialkot, Pakistan. I turn ideas into fast, polished mobile and web products, from the first screen to the live release.",
      cta1Label: "See my work",
      cta1Href: "#work",
      cta2Label: "Get in touch",
      cta2Href: "#contact",
      codeFile: "ride_provider.dart",
      codeText: heroCode,
      codeLang: "dart",
    },
  });

  // 4. About
  const aboutParagraphs = [
    "I'm a **Flutter developer** who builds complete products: the app, the backend connection and the real-time parts in between. I work with Flutter, Next.js, WordPress and native Android.",
    "I currently work as a Flutter developer at **Technosofts**, and I build **EasyGo**, a ride-hailing and carpooling app with driver and rider sides, on my own.",
  ];

  await prisma.about.upsert({
    where: { id: 1 },
    update: {
      tag: "About me",
      heading: "I care about how it works and how it feels.",
      paragraphs: JSON.stringify(aboutParagraphs),
    },
    create: {
      id: 1,
      tag: "About me",
      heading: "I care about how it works and how it feels.",
      paragraphs: JSON.stringify(aboutParagraphs),
    },
  });

  // 5. Facts
  await prisma.fact.deleteMany();
  const facts = [
    { label: "Role", value: "Full Stack Developer", order: 0 },
    { label: "Mobile", value: "Flutter, Android", order: 1 },
    { label: "Web", value: "Next.js, WordPress", order: 2 },
    { label: "Real-time", value: "Laravel, Pusher, WebSocket", order: 3 },
    { label: "Based in", value: "Sialkot, Pakistan", order: 4 },
  ];
  for (const f of facts) {
    await prisma.fact.create({ data: f });
  }

  // 6. Projects
  await prisma.project.deleteMany();
  const projects = [
    {
      slug: "easygo",
      name: "EasyGo",
      description: "A ride-hailing and carpooling app with separate driver and rider sides. Drivers publish trips, riders book seats and follow the ride live.",
      features: JSON.stringify([
        "Live map and trip tracking",
        "Driver and rider apps",
        "KYC verification",
        "Real-time notifications",
      ]),
      tags: JSON.stringify(["Flutter", "Riverpod", "GoRouter", "Laravel", "Pusher"]),
      codeFile: "trip_socket.dart",
      codeLang: "dart",
      codeText: `// driver location, live
channel.bind('driver.moved', (e) {
  ref.read(tripProvider.notifier)
     .updateDriver(e.lat, e.lng);
});

// trip status changes
channel.bind('trip.status', (e) {
  router.go('/trip/' + e.id);
});`,
      visible: true,
      order: 0,
    },
    {
      slug: "washhouse",
      name: "Washhouse",
      description: "An on-demand laundry and logistics ecosystem. Customer and rider apps stay in sync through live tracking, chat and payments.",
      features: JSON.stringify([
        "Customer and rider apps",
        "Live order tracking",
        "In-app chat",
        "Secure payments",
      ]),
      tags: JSON.stringify(["Flutter", "GetX", "Firebase", "Maps"]),
      codeFile: "order_controller.dart",
      codeLang: "dart",
      codeText: `class OrderController extends GetxController {
  final status = 'placed'.obs;

  void listen(String id) {
    db.doc('orders/' + id).snapshots()
      .listen((d) => status(d['status']));
  }
}`,
      visible: true,
      order: 1,
    },
    {
      slug: "zenvpn",
      name: "ZenVPN",
      description: "A secure and fast VPN app with ad integrations and a modern interface that connects in one tap.",
      features: JSON.stringify([
        "One-tap connection",
        "Yandex Ads and AdMob",
        "Clean, modern interface",
      ]),
      tags: JSON.stringify(["Flutter", "Yandex Ads", "AdMob"]),
      codeFile: "vpn_service.dart",
      codeLang: "dart",
      codeText: `Future<void> connect(Server s) async {
  state = VpnState.connecting;
  await engine.start(s.config);
  state = VpnState.connected;
  await ads.showInterstitial();
}`,
      visible: true,
      order: 2,
    },
    {
      slug: "hex-headwear",
      name: "Hex Headwear",
      description: "A custom caps and apparel website with global shipping and low minimum order quantities for small brands.",
      features: JSON.stringify([
        "Online store with WooCommerce",
        "Global shipping",
        "Low minimum order quantity",
      ]),
      tags: JSON.stringify(["WordPress", "WooCommerce"]),
      codeFile: "functions.php",
      codeLang: "php",
      codeText: `// low MOQ for custom orders
add_filter('woocommerce_quantity_input_args',
  function($args) {
    $args['min_value'] = 12;
    return $args;
  });`,
      visible: true,
      order: 3,
    },
  ];
  for (const p of projects) {
    await prisma.project.create({ data: p });
  }

  // 7. Tech Marquee
  await prisma.tech.deleteMany();
  const techs = [
    "Flutter",
    "Next.js",
    "WordPress",
    "Android",
    "Riverpod",
    "Laravel",
    "Firebase",
    "GetX",
    "WooCommerce",
    "Pusher",
  ];
  for (let i = 0; i < techs.length; i++) {
    await prisma.tech.create({ data: { name: techs[i], order: i } });
  }

  // 8. Process Steps
  await prisma.processStep.deleteMany();
  const steps = [
    {
      title: "Understand",
      description: "I learn what the product must do and who will use it, before writing any code.",
      order: 0,
    },
    {
      title: "Build",
      description: "Clean, well-structured code with real-time features and smooth screens.",
      order: 1,
    },
    {
      title: "Ship and support",
      description: "I release, test with real users and keep improving after launch.",
      order: 2,
    },
  ];
  for (const s of steps) {
    await prisma.processStep.create({ data: s });
  }

  // 9. Stats
  await prisma.stat.deleteMany();
  const stats = [
    { value: 4, suffix: "+", label: "Major projects", order: 0 },
    { value: 2, suffix: "+", label: "Years of experience", order: 1 },
    { value: 3, suffix: "", label: "Stacks: mobile, web, CMS", order: 2 },
    { value: 6, suffix: "", label: "Core technologies", order: 3 },
  ];
  for (const st of stats) {
    await prisma.stat.create({ data: st });
  }

  // 10. Contact Info
  await prisma.contactInfo.upsert({
    where: { id: 1 },
    update: {
      email: "faraz.hassan@example.com",
      heading: "Let's build something great.",
      footerLeft: "Faraz Hassan · Full Stack Developer · Sialkot, Pakistan",
      footerRight: "© 2026 All rights reserved.",
    },
    create: {
      id: 1,
      email: "faraz.hassan@example.com",
      heading: "Let's build something great.",
      footerLeft: "Faraz Hassan · Full Stack Developer · Sialkot, Pakistan",
      footerRight: "© 2026 All rights reserved.",
    },
  });

  // 11. Social Links
  await prisma.socialLink.deleteMany();
  const links = [
    { label: "GitHub", url: "https://github.com", visible: true, order: 0 },
    { label: "LinkedIn", url: "https://linkedin.com", visible: true, order: 1 },
  ];
  for (const l of links) {
    await prisma.socialLink.create({ data: l });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
