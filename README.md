# **Astron QR Platform**

#### A full-stack dynamic QR code management system built with Next.js 16, featuring both public QR generation and admin-managed dynamic QR codes.

---
### **🚀 Live Demo**

### Live URL: https://astron-qr-shubham.vercel.app

---

### **📕 Features**

### Public Features (No Login Required)

- Free static QR code generator
- Text or URL input
- Instant QR generation
- High-resolution PNG download (512x512)
- Clean, modern UI

### Admin Features (Login Required)

- Secure NextAuth authentication
- Create dynamic QR codes with short URLs
- Upload QR images to AWS S3
- MongoDB data storage
- Update destination URLs anytime
- QR redirect via /q/[code]
- Admin dashboard to manage all QRs
- Individual QR management pages

---

### ***📽️ Tech Stack***

- **Framework:** NextJs 16
- **Language:** TypeScript
- **Authentication:** NextAuth
- **DataBase:** MongoDB
- **Stroage:** AWS S3
- **Styling:** TailwindCSS
- **QR Generation:** qrcode library
- **Icons:** Lucide React
- **Deployment:** Vercel

---

## **📦 Installation**

### 1. Clone Repository
```bash
git clone https://github.com/shubham-singh10/astron-qr-shubham.git
cd astron-qr-shubham
```
### 2. Install Dependencies
```bash
npm install
```
### 3. Environment Variables
Create a `.env` file in the root directory:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/<databasename>?retryWrites=true&w=majority
NEXTAUTH_URL=http://localhost:3000 //live_vercel_links
NEXTAUTH_SECRET=your_generated_secret_here

AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET_NAME=your_s3_bucket_name
```
### 4. Run Development Server
```bash
npm run dev
```
Open http://localhost:3000

___

### **📁 Project Structure**
```
astron-qr-shubham/
|-app/
| |_(auth)/
| |   |-login/
| |   |   |__page.tsx
| |   |__ register/
| |       |__page.tsx
| |
| |-(protected)/
| |     |-admin/
| |     |   |__page.tsx
| |     |    |_create/
| |     |       |_page.tsx
| |     |-manage/
| |     |     |_[code]/
| |     |     |    |_page.tsx   
| |     |-q/
| |       |  |_[code]/
| |       |     |_page.tsx
| |       |-api/
| |          |_auth/
| |          |    |_register/
| |          |_links/
| |_page.tsx
| |_layout.tsx
| |_providers.tsx
| |_globals.css
|
|_lib/
|  |_models/
|  |    |_Link.ts
|  |    |_User.ts
|  |_s3.ts
|  |_mongodb.ts
|  |_auth.ts
|
|_types/
|   |_index.ts
|   |_next-auth.d.ts
|
|_components
|       |_Navbar.tsx
|
|_middleware.ts
|_global.d.ts
|_.env
|_next.config.ts
|_tailwind.config.ts
|_README.md
```
___
### 🔑 Login Credentials(Default):
- Email: admin@local.test
- password: admin123
___

### 🌎 API Routes:
#### Public Routes
- `GET /`- Public QR generator

#### Protected Routes (Admin only)
- `GET /admin` - Dashboard
- `GET /admin/create` - Create new QR
- `GET /admin/manage/[code]` - Manage specific QR

#### API Endpoints
- `POST /api/auth/register` - Register Admin
- `GET /api/links` - List all QRs
- `GET /api/links/[code]` - GET specific QR
- `PATCH /api/links/[code]` - Update destination URL

#### Redirect Route
- `GET /q/[code]` - Redirect to destination URL

---

### 🧑‍⚕️ Author

**Shubham Kumar Singh**  

- **Email:** [shubhamkumarsinghh@outlook.com](mailto:shubhamkumarsinghh@outlook.com)  
- **GitHub:** [shubham-singh10](https://github.com/shubham-singh10)  
- **LinkedIn:** [shubham-kumar-singhh](https://www.linkedin.com/in/shubham-kumar-singhh)