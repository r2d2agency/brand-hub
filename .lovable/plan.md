Transform the existing project into a complete, modular website for "Basmar Doces e Artigos de Festas". The system will include a public showcase website and a full admin panel for content management, without e-commerce features.

### Phase 1: Database & Backend (Prisma)
- **Update Schema**: Add models for all requested modules:
    - `SeasonalBanner`: Desktop/mobile images, dates, order.
    - `ProductCategory`: Name, description, cover, image gallery.
    - `PegueMonte`: Theme, items, gallery, WhatsApp message.
    - `Course`: Date, location, teacher, status (Enrolled/Open/Soon).
    - `GalleryItem`: Title, category, image.
    - `Partner`: Name, logo, gallery.
    - `Store`: Address, WhatsApp per unit, working hours.
    - `CompanyHistory`: Title, timeline (Year/Title/Desc).
    - `FAQ`: Question, answer, category.
    - `Testimonial`: Name, text, image, source.
    - `WhatsAppClick`: Log for analytics (type, item, page).
- **Update Modules**: Refactor the existing `Module` model to handle activation/deactivation of specific sections (Home display, Order, Status).
- **Backend API**: Implement CRUD routes for each model in `backend/src/modules/`.

### Phase 2: Admin Panel (Frontend)
- **Dashboard**: Implement overview charts and stats (Active modules, banner count, WhatsApp clicks).
- **CRUD Interfaces**: Create management pages for each module using standard tables and forms.
- **WhatsApp Integration**: Configuration for per-unit WhatsApp numbers and message templates.
- **Modular Control**: Interface to toggle visibility and order of site sections.

### Phase 3: Public Website (Frontend)
- **Home Page**: Build a dynamic page that assembles components based on active modules (Banners -> Categories -> Pegue e Monte -> Cursos -> etc.).
- **Module Pages**: Individual pages for:
    - Pegue e Monte details.
    - Product Category galleries.
    - Courses listing.
    - Gallery and Partners.
    - Store locations with maps links.
- **Fixed Components**: WhatsApp floating button, Responsive Header/Footer.
- **Visual Design**: Modern, "candy/party" themed aesthetic with large photos, rounded cards, and vibrant colors.

### Phase 4: Deploy & Polish
- **EasyPanel Configuration**: Ensure environment variables and Docker settings are correct.
- **SEO**: Meta tags for pages and categories.
- **Initial Data**: Seed the database with the suggested product categories and basic branding.

### Technical Details
- **Tech Stack**: React (Frontend), Node.js/Express (Backend), Prisma/PostgreSQL (DB).
- **Modules**: Each section is independent, allowing the admin to toggle what appears on the Home page vs. main site.
- **Analytics**: Custom logging for WhatsApp clicks to track conversion.
