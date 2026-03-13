# ✦ nayl-aSpace ✦

> [The Star Stream is broadcasting your personal realm to the constellations.]
> 
> *"I am the only reader who knows the end of this code."*

Welcome to **nayl-aSpace**, a personal portfolio and digital archive designed with a deep-sea glassmorphism aesthetic. It acts as a personal realm where the creator's *Fables* (Projects), *Attributes* (Skills), and *Myths* (Interests) are recorded and displayed to the visiting *Constellations*.

Built with Vanilla Web Technologies and powered by Supabase, it features a complete, hidden Administrator Panel to dynamically alter the world's scenarios.

---

## 🌌 The Scenarios (Main Features)

### 1. 📚 Archive of Fables (Projects)
A dynamic gallery of deployed applications, games, and designs. Complete with rich-text overviews, tech stack tags, repository links, and an immersive "Story Mode" swipe-up detail view on mobile.

### 2. ⚡ Incarnation's Attributes (Skills)
A categorized display of the creator's current arsenal (Web Dev, Backend, Design, Game Dev). Includes a specialized **"Currently Exploring"** queue for attributes currently being acquired.

### 3. 📖 Personal Myths (Interests)
A highly personalized curation of Anime, Manhwa, Movies, and Misc. 
- Features a **"My Feel & Review"** section.
- **Standout Moments** list.
- A beautiful **Masonry Gallery & Vibes** grid for highlight images.

### 4. ✨ The Constellation Board (Messages)
A public wall where visiting Constellations (users) can drop a note, a joke, or just say hi. Messages are scattered like stars and permanently recorded in the database.

### 5. 👁️ The Fourth Wall (Admin Panel)
A hidden, secure dashboard to manage the entire ecosystem.
- **Full CRUD** for Projects, Interests, Skills, and Social Links.
- **Rich Text Editor** (Quill.js) for writing detailed lore.
- **Direct Image Uploads** to Supabase Storage.
- **Activity Log** to track every change made to the system.

---

## 🛠️ System Overview (Tech Stack)

**[System Message: Checking the incarnation's underlying framework...]**

- **Frontend:** Pure HTML5, CSS3 (Custom Properties, CSS Grid/Flexbox, Glassmorphism), Vanilla JavaScript.
- **Visuals & Motion:** Custom HTML Canvas (Particle nebulas), Custom Cursor, Intersection Observer for scroll reveals.
- **Backend (The Star Stream):** [Supabase](https://supabase.com/) (PostgreSQL Database, Auth, Storage).
- **Fallback Protocol:** `localStorage` is used as an automatic fallback if the Supabase connection is severed (Demo Mode).
- **Editor:** Quill.js (Rich Text editing).

---

## ⚙️ Synchronization Guide (Setup)

To instantiate this personal realm on your own local server, follow these steps:

### 1. Clone the Scenario
```bash
git clone https://github.com/yourusername/nayl-aSpace.git
cd nayl-aSpace
```

### 2. Connect to the Star Stream (Supabase Setup)
Create a new project on Supabase and set up the following tables:
- `projects` (Auto-UUID)
- `interests` (Auto-UUID)
- `skills` (Manual ID)
- `socials` (Manual ID)
- `public_messages` (Auto-UUID)
- `activities` (Manual ID)

*Create a public storage bucket named `images`.*

### 3. Run the World
Deploy it easily to Vercel (recommended) or use a local server like VS Code Live Server. The project includes a `vercel.json` for clean URLs.

---

## 🗝️ Hidden Piece (Easter Egg)

**[The constellation 'Secretive Plotter' smirks at your curiosity.]**

The Admin Panel (`/pages/admin`) is hidden from the main navigation. To unlock the gateway without typing the URL:
1. Scroll to the footer of the site.
2. Find the text: `crafted with ✦ by nayl-aSpace`.
3. **Click on the word `nayl-aSpace` exactly 3 times.**
4. *Alternatively, use the keyboard shortcut: `Ctrl + Shift + A`.*