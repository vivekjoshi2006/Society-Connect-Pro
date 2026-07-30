# 🏢 Society Connect Pro – Housing Society & Gate Management Platform

Society Connect Pro is a modern, role-based Housing Society & Gate Management Platform built with **Next.js**, **TypeScript**, and **Tailwind CSS**. It digitizes society administration by providing dedicated workspaces for **Administrators**, **Residents**, and **Security Personnel**, enabling efficient maintenance billing, visitor management, emergency response, and payment tracking through a unified web application.

---

## ✨ Features

### 👑 Admin Dashboard

- Manage resident and flat records
- Generate maintenance bills
- Track paid and pending dues
- View invoices and payment history
- Generate printable payment receipts
- Monitor society-wide visitor activity
- Audit resident and billing records

---

### 🏠 Resident Portal

- View flat and parking details
- Access maintenance invoices
- Pay bills using simulated UPI or Card payment
- Download printable payment receipts
- Contact society helpdesk
- Trigger Emergency SOS

---

### 🛡️ Security Dashboard

- Visitor Check-In / Check-Out
- Mobile number validation
- Flat-wise visitor registration
- Purpose tracking
- Automatic visitor parking allocation
- Live visitor monitoring
- Emergency contact access

---

### 🚨 Emergency Management

- One-click SOS activation
- Society-wide emergency alerts
- Quick access to Police (112)
- Ambulance (102 / 108)
- Fire Brigade (101)

---

### ⚙️ Platform Features

- Multi-role authentication simulation
- Role-based dashboards
- Centralized state management
- Responsive interface
- Glassmorphism UI
- Print-friendly payment receipts
- Real-time data synchronization using React Context API

---

# 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js (App Router) | React Framework |
| TypeScript | Type Safety |
| React | User Interface |
| Tailwind CSS | Styling |
| React Context API | Global State Management |
| Lucide React | Icons |
| HTML & CSS Print Media | Printable Receipts |
| Vercel | Deployment |

---

# 📂 Project Structure

```text
society-connect-pro/
│
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── page.tsx
│   │   │
│   │   ├── resident/
│   │   │   └── page.tsx
│   │   │
│   │   ├── security/
│   │   │   └── page.tsx
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   │
│   └── context/
│       └── SocietyContext.tsx
│
├── public/
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Before running the project, ensure you have:

- Node.js 18 or later
- npm

---

## 1. Clone the Repository

```bash
git clone https://github.com/vivekjoshi2006/Society-Connect-Pro.git
```

---

## 2. Navigate to the Project

```bash
cd Society-Connect-Pro
```

---

## 3. Install Dependencies

```bash
npm install
```

---

## 4. Start the Development Server

```bash
npm run dev
```

---

## 5. Open the Application

```
http://localhost:3000
```

---

# 👥 User Roles

### 👑 Administrator

- Resident Management
- Flat Management
- Billing Management
- Invoice Generation
- Receipt Generation
- Payment Tracking
- Visitor Monitoring

### 🏠 Resident

- View Profile
- View Maintenance Bills
- Online Payment
- Download Receipts
- Helpdesk Access
- Emergency SOS

### 🛡️ Security

- Visitor Registration
- Visitor Checkout
- Parking Management
- Emergency Contacts

---

# 📦 Available Scripts

| Command | Description |
|----------|-------------|
| `npm run dev` | Starts the development server |
| `npm run build` | Builds the project |
| `npm start` | Runs the production build |
| `npm run lint` | Runs ESLint |

---

# 📱 Responsive Design

Optimized for:

- 💻 Desktop
- 💼 Laptop
- 📱 Mobile
- 📟 Tablet

---

# ☁️ Deployment

The application is optimized for deployment on **Vercel**.

### Deployment Steps

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Vercel automatically detects Next.js.
4. Click **Deploy**.

---

# 🚀 Future Enhancements

- Backend integration
- Database support (PostgreSQL / MongoDB)
- Real payment gateway integration
- Email & SMS notifications
- Resident complaint management
- Visitor QR Code passes
- Maintenance analytics dashboard
- Multi-society support
- Admin reports and exports
- Mobile application

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository.

2. Create a feature branch.

```bash
git checkout -b feature/new-feature
```

3. Commit your changes.

```bash
git commit -m "Add new feature"
```

4. Push your branch.

```bash
git push origin feature/new-feature
```

5. Open a Pull Request.

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

Developed with ❤️ using **Next.js**, **TypeScript**, **React**, and **Tailwind CSS**.

If you found this project helpful, consider giving it a ⭐ on GitHub!
