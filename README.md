# Professional Photographer Portfolio

A modern, minimal, and SEO-friendly portfolio website built with Next.js for professional photographers. Features include dynamic category management, image galleries with stunning hover effects, and a comprehensive admin panel.

## Features

- **Modern Design**: Clean, minimal interface with smooth animations
- **Dynamic Categories**: Add and manage photo categories dynamically through the admin panel
- **Stunning Image Gallery**: Grayscale images that zoom and reveal colors on hover
- **SEO Optimized**: Built-in sitemap, robots.txt, structured data, and comprehensive meta tags
- **Admin Dashboard**: Secure admin panel for managing categories, images, and content
- **Authentication**: NextAuth.js integration for secure admin access
- **Responsive Design**: Mobile-first approach ensuring great experience on all devices
- **Contact Form**: Built-in contact form for project inquiries
- **Database**: MongoDB for metadata and Firebase Storage for images

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Authentication**: NextAuth.js
- **Database**: MongoDB
- **Image Storage**: Firebase/Firestore
- **Fonts**: Inter & Playfair Display (Google Fonts)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- Firebase project with Storage enabled
- npm or yarn package manager

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**

   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

   Update the variables in `.env.local` with your actual values.

3. **Generate NextAuth Secret**
   ```bash
   openssl rand -base64 32
   ```
   Use the output as your `NEXTAUTH_SECRET`

4. **Create admin user**

   Create a script to initialize the admin user:
   ```bash
   mkdir -p scripts
   cat > scripts/create-admin.js << 'EOF'
   const { MongoClient } = require('mongodb');
   const bcrypt = require('bcryptjs');
   require('dotenv').config({ path: '.env.local' });

   async function createAdmin() {
     const uri = process.env.MONGODB_URI;
     const client = new MongoClient(uri);

     try {
       await client.connect();
       const db = client.db();

       const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);

       await db.collection('users').insertOne({
         email: process.env.ADMIN_EMAIL || 'admin@example.com',
         password: hashedPassword,
         name: 'Admin',
         role: 'admin',
         createdAt: new Date(),
         updatedAt: new Date(),
       });

       console.log('Admin user created successfully!');
     } catch (error) {
       console.error('Error:', error);
     } finally {
       await client.close();
     }
   }

   createAdmin();
   EOF

   npm install dotenv
   node scripts/create-admin.js
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Panel

1. Navigate to `/admin/login`
2. Sign in with your admin credentials
3. Manage categories and images

## Adding Images

Images are stored in Firebase Storage. Upload images to Firebase, then add metadata via API or admin interface.

## Project Structure

```
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── admin/          # Admin dashboard
│   ├── gallery/        # Gallery page
│   ├── about/          # About page
│   └── contact/        # Contact page
├── components/         # React components
├── lib/                # Database connections
├── models/             # Database models
└── types/              # TypeScript types
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## License

MIT
