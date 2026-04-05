# ✈️ Wanderlust - AI-Powered Travel Itinerary Generator

Transform your travel dreams into detailed, day-by-day itineraries powered by Google Gemini AI. Simply describe your destination, and let AI craft the perfect travel plan.

<div align="center">
    <img src="/public/home.png" width="49%" alt="Dev News Landing Page" />
    <img src="/public/plan.png" width="49%" alt="Dev News Article Details" />
</div>

<br />

![React](https://img.shields.io/badge/React-18-blue) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38bdf8) ![Next.js](https://img.shields.io/badge/Next.js-14.2.35-000000)

---

## 🔗 Links

- **🌐 Live Demo**: [https://wanderlust-sage-eight.vercel.app/](https://wanderlust-sage-eight.vercel.app/)
- **📦 Repository**: [https://github.com/Learn-with-Sumit/batch-4-assignment-8-wanderlust-tushar-454](https://github.com/Learn-with-Sumit/batch-4-assignment-8-wanderlust-tushar-454)

---

## 🌟 Features

### 🤖 **AI-Powered Planning**

- **Smart Itinerary Generation**: Leverages Google Gemini AI to create detailed, day-by-day travel plans based on natural language prompts
- **Intelligent Prompt Validation**: Automatically detects and validates travel-related prompts to ensure quality output
- **Context-Aware Planning**: Extracts destination, duration, season, budget preferences, and travel style from user input
- **Flexible Duration Matching**: Matches existing plans by destination when days aren't specified, or exact matches when duration is provided

### 🔍 **Smart Plan Matching**

- **Duplicate Detection**: AI-powered similarity checking prevents duplicate plan generation
- **Multi-Factor Matching**: Compares location, duration, season, specific places, and travel style
- **Conditional Day Matching**: If user specifies only destination, returns best match regardless of days; if days specified, requires exact match
- **80% Similarity Threshold**: Ensures high-quality matches before redirecting to existing plans

### 🎨 **Modern UI/UX**

- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Loading States**: Skeleton screens and smooth transitions during plan generation
- **Interactive Components**: Hover effects, animations, and intuitive navigation
- **Quick Suggestions**: Pre-built prompt suggestions for popular destinations
- **Error Handling**: User-friendly error messages with actionable feedback

### 📸 **Visual Experience**

- **Dynamic Image Integration**: Automatically fetches high-quality landscape photos from Pexels API
- **Hero Backgrounds**: Stunning destination imagery for each travel plan
- **Place-Specific Photos**: Individual images for each day's main attraction
- **Optimized Loading**: Next.js Image component for performance and SEO

### 🌐 **SEO & Social Sharing**

- **Open Graph Metadata**: Optimized social media preview with plan title, description, and background image
- **1200×630px Images**: High-quality Pexels destination photos perfect for social platforms
- **Rich Snippets**: Proper metadata for better search engine visibility
- **Social Sharing Ready**: Beautiful previews on Facebook, Twitter, LinkedIn, and WhatsApp

### 📊 **Comprehensive Itineraries**

- **Day-by-Day Breakdown**: Detailed schedules with time-stamped activities
- **Destination Highlights**: Top 3 must-see places with ratings and descriptions
- **Local Gastronomy**: Food and cuisine recommendations
- **Smart Travel Tips**: Practical advice for smooth travel experience
- **Budget Estimates**: Transparent cost projections with currency

### 🗄️ **Data Management**

- **MongoDB Integration**: Stores plans with efficient schema design using Mongoose
- **Slug-Based URLs**: SEO-friendly, readable URLs for each travel plan
- **Recent Plans Display**: Homepage showcases latest generated itineraries
- **Plan Retrieval**: Fast lookup by slug with error handling and 404 pages

### 🔧 **Technical Excellence**

- **Server Actions**: Next.js 14 server actions for secure, server-side operations
- **Optimized Metadata**: Comprehensive SEO and Open Graph tags for each page
- **Revalidation**: Automatic cache invalidation with `revalidatePath`
- **Type-Safe Schemas**: Structured JSON schemas for AI responses ensure consistency
- **Error Boundaries**: Graceful error handling at component and page levels

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn** or **pnpm**
- **MongoDB** (local installation or MongoDB Atlas account)
- **API Keys**:
    - Google Gemini AI API key
    - Pexels API key

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/Learn-with-Sumit/batch-4-assignment-8-wanderlust-tushar-454 wanderlust
    cd wanderlust
    ```

2. **Install dependencies**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3. **Set up environment variables**

    Create a `.env.local` file in the root directory:

    ```env
    # MongoDB Connection String
    MONGODB_URI=mongodb://localhost:27017/wanderlust
    # or for MongoDB Atlas:
    # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wanderlust

    # Google Gemini AI API Key
    GENINI_API_KEY=your_gemini_api_key_here

    # Pexels API Key
    PEXELS_API_KEY=your_pexels_api_key_here

    # Base API URL (for production, update to your deployed URL)
    BASE_URL=http://localhost:3000/api
    ```

    **How to get API keys:**
    - **Gemini AI**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
    - **Pexels**: Visit [Pexels API](https://www.pexels.com/api/)

    **Note**: For production deployment, update `BASE_URL` to your deployed domain (e.g., `https://yourdomain.com/api`)

4. **Run the development server**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

5. **Open your browser**

    Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

---

## 🛠️ Built With

### **Core Technologies**

- **[Next.js](https://nextjs.org/)** - v14.2.35 - React framework with App Router, Server Actions, and Edge Runtime
- **[React](https://react.dev/)** - v18 - UI library for building interactive interfaces
- **[MongoDB](https://www.mongodb.com/)** - NoSQL database for storing travel plans
- **[Mongoose](https://mongoosejs.com/)** - v9.1.4 - Elegant MongoDB object modeling for Node.js

### **AI & APIs**

- **[@google/genai](https://ai.google.dev/)** - v1.37.0 - Google Gemini AI SDK for intelligent plan generation
- **[Pexels API](https://www.pexels.com/api/)** - v1.4.0 - High-quality, royalty-free stock photos

### **Styling & UI**

- **[TailwindCSS](https://tailwindcss.com/)** - v3.4.1 - Utility-first CSS framework
- **[Lucide React](https://lucide.dev/)** - v0.562.0 - Beautiful, customizable icon library
- **[PostCSS](https://postcss.org/)** - v8 - CSS transformation tool

### **Development Tools**

- **[ESLint](https://eslint.org/)** - v8 - Code linting and quality enforcement
- **[Prettier](https://prettier.io/)** - v3.8.0 - Code formatting with Tailwind plugin
- **[Next.js Image](https://nextjs.org/docs/api-reference/next/image)** - Optimized image loading
- **[Next.js ImageResponse](https://nextjs.org/docs/app/api-reference/functions/image-response)** - Dynamic OG image generation

---

## 📂 Project Structure

```
wanderlust/
├── public/                      # Static assets
│   └── placeholder.jpg          # Fallback image for failed API calls
│
├── src/
│   ├── actions/                 # Next.js Server Actions
│   │   └── plan.js             # Travel plan CRUD operations
│   │
│   ├── app/                     # App Router pages and layouts
│   │   ├── globals.css         # Global styles and Tailwind imports
│   │   ├── layout.js           # Root layout with metadata
│   │   │
│   │   ├── (home)/             # Home page route group
│   │   │   ├── layout.js       # Home layout wrapper
│   │   │   ├── page.js         # Homepage with prompt input
│   │   │   └── components/     # Home-specific components
│   │   │       ├── footer.js
│   │   │       ├── gloweffect.js
│   │   │       ├── header.js
│   │   │       ├── hero.js
│   │   │       ├── plan-card.js
│   │   │       ├── plans-loading-skeleton.js
│   │   │       ├── prompt-field.js
│   │   │       ├── quick-suggestions-tag.js
│   │   │       ├── recent-plans.js
│   │   │       └── submit-button.js
│   │   │
│   │   └── (plan)/             # Plan detail route group
│   │       ├── layout.js       # Plan layout wrapper
│   │       └── plan/
│   │           └── [slug]/     # Dynamic route for individual plans
│   │               ├── page.js              # Plan detail page with metadata
│   │               ├── loading.js           # Loading state
│   │               ├── error.js             # Error boundary
│   │               ├── not-found.js         # 404 page
│   │               └── components/          # Plan-specific components
│   │                   ├── footer.js
│   │                   ├── header.js
│   │                   └── share-button.js
│   │
│   ├── dbConnect/              # Database and API connections
│   │   ├── connectMongo.js     # MongoDB connection with caching
│   │   ├── geminiAi.js         # Gemini AI client wrapper
│   │   └── pexelsClient.js     # Pexels API client
│   │
│   └── models/                 # Mongoose schemas
│       └── plan.js             # Travel plan schema definition
│
├── jsconfig.json               # JavaScript configuration with path aliases
├── next.config.mjs             # Next.js configuration
├── package.json                # Dependencies and scripts
├── postcss.config.mjs          # PostCSS configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── README.md                   # Project documentation
```

## 🌲 Components Tree

![Components Tree](/public/diagram-export-1-22-2026-7_26_11-PM.svg)

### **Key Files Explained**

- **[src/actions/plan.js](src/actions/plan.js)**: Contains all server actions for plan creation, retrieval, and AI matching logic
- **[src/dbConnect/geminiAi.js](src/dbConnect/geminiAi.js)**: Wrapper function for Google Gemini AI API calls with JSON schema validation
- **[src/models/plan.js](src/models/plan.js)**: Mongoose schema defining the structure of travel plans in MongoDB
- **[src/app/(plan)/plan/[slug]/page.js](<src/app/(plan)/plan/[slug]/page.js>)**: Plan detail page with dynamic metadata generation for SEO and social sharing

---

## 🔄 How It Works

### **Plan Generation Workflow**

1. **User Input** → User enters a travel prompt (e.g., "5 days in Dubai with family")
2. **Validation** → AI validates if the prompt is travel-related
3. **Similarity Check** → System checks for existing similar plans using AI matching:
    - Extracts location, days, season, places, and travel style
    - Compares against existing plans in database
    - If user doesn't specify days → matches by destination only
    - If user specifies days → requires exact day match
    - Returns existing plan if 80%+ similarity
4. **AI Generation** → If no match, Gemini AI generates comprehensive itinerary with:
    - Day-by-day schedule with timed activities
    - Destination highlights and ratings
    - Gastronomy recommendations
    - Travel tips and budget estimates
5. **Image Fetching** → Pexels API provides high-quality images for background and daily places
6. **Database Storage** → Plan saved to MongoDB with unique slug
7. **Metadata Generation** → Open Graph tags created with plan title, description, and background image
8. **Redirect** → User redirected to newly created plan page

### **AI Prompt Engineering**

The system uses carefully crafted prompts with:

- **Strict JSON schemas** for consistent output structure
- **Character limits** to ensure UI compatibility
- **Validation rules** for self-checking before response
- **Step-by-step instructions** for AI reasoning
- **Conditional logic** for flexible day matching

---

## 🎯 Key Features Deep Dive

### **Conditional Day Matching Logic**

Located in [src/actions/plan.js](src/actions/plan.js#L377-L462), the matching engine:

```javascript
// DAYS RULE (CONDITIONAL):
// If user does NOT specify number_of_days → IGNORE day count
// If user DOES specify number_of_days → REQUIRE exact match

Examples:
✅ "Saudi Arabia" matches "5 days Saudi" OR "10 days Saudi"
❌ "3 days Saudi" does NOT match "10 days Saudi"
✅ "Dubai luxury trip" matches any Dubai plan
```

This ensures users get relevant results whether they're:

- Exploring destination options (no days specified)
- Planning specific duration trips (days specified)

### **SEO & Social Sharing Metadata**

Every plan includes optimized metadata in [src/app/(plan)/plan/[slug]/page.js](<src/app/(plan)/plan/[slug]/page.js>):

- **Dynamic Metadata**: Auto-generated from plan data using Next.js `generateMetadata`
- **Open Graph Tags**: Title, description, and high-quality background image
- **1200×630px Images**: Pexels destination photos optimized for social platforms
- **Social Preview**: Beautiful cards when sharing on Facebook, Twitter, LinkedIn, WhatsApp
- **SEO Optimized**: Proper meta tags for better search engine visibility

---

## 🚧 Future Enhancements

- [ ] User authentication and saved plans
- [ ] Export plans as PDF
- [ ] Multi-language support
- [ ] Collaborative planning features
- [ ] Real-time booking integration
- [ ] Weather forecasts in itineraries
- [ ] Interactive map view
- [ ] User reviews and ratings

---

## 👨‍💻 Author

**Your Name**

- 🐙 GitHub: [@tushar-454](https://github.com/tushar-454)
- 💼 LinkedIn: [@tushar454](https://linkedin.com/in/tushar454)
- 🌐 Portfolio: [https://tushar-imran.vercel.app](https://tushar-imran.vercel.app)
- 📺 YouTube: [@snow-script](https://youtube.com/@snow-script)

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

Made with ❤️ and ☕ by [Tushar Imran](https://tushar-imran.vercel.app)

</div>
