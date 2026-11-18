# Meer's Cafe Website

Run locally: double-click `index.html` (or `python3 -m http.server`).  
Deploy free: drag this folder onto https://app.netlify.com/drop, or upload to a GitHub repo and enable Settings > Pages.

After deploying, replace `YOUR-DOMAIN-HERE` in `index.html`, `sitemap.xml` and `robots.txt` with your real web address.

---

## Easy edits (where to change what)

### 1. Prices / add / remove items / categories / descriptions
Open **`js/menu.js`**.  
Each item looks like:  
`{id:"b1", name:"Zingister Burger", desc:"...", price:450}`

- Change the number → price updates everywhere (cards, cart, WhatsApp).
- Delete a line → remove that item.
- Copy a line and give it a **new unique id** → add a new item.
- Pizza sizes use: `sizes:{Small:499, Medium:899, Large:1399}`.

### 2. Category images (Burgers, Pizza, etc.)
Each category header has a 4:3 image box. Until you add a photo it shows **"Add Category Image Here"** and the exact file name it expects.

1. Put your photo in **`assets/images/categories/`** and name it after the category: `deals.jpg`, `burgers.jpg`, `broast.jpg`, `pizza.jpg`, `special.jpg`, `wraps.jpg`, `rolls.jpg`, `fries.jpg`, `appetizers.jpg`, `dips.jpg`, `tea.jpg`.
2. Refresh the page — the photo replaces the placeholder automatically. No code change needed.
3. Best size: 800 × 600 px (4:3), under ~150 KB.
4. Using PNG/WebP? Change `categoryImages.ext` in `js/config.js`, or for one category add `img:"assets/images/categories/yourfile.png"` in `js/menu.js`.

### 2b. Food photos
1. Put the photo inside **`assets/images/food/`** (e.g. `zingister.jpg`).
2. In `js/menu.js` add to that item:  
   `img:"assets/images/food/zingister.jpg"`

### 3. WhatsApp number, delivery fee, areas, opening hours, address, phones, logo & hero
Open **`js/config.js`**:

| Setting | What it does |
|---------|--------------|
| `whatsapp` | Restaurant WhatsApp (format: `923221166710` — no + or spaces) |
| `deliveryFee` | Currently `100` (Rs. 100) |
| `deliveryAreas` | List of areas shown in the dropdown (edit the array) |
| `phoneDisplay` / `phone2Display` | Numbers shown on the site |
| `address` | Footer address |
| `openHour` / `lastOrderHour` | 11 → 3 AM |
| `images.logo` / `images.hero` | Paths to logo & hero background |

### 4. Hero background / logo image
- Logo → replace **`assets/images/logo.png`**
- Hero background → replace **`assets/images/hero-background.jpg`**
- (Or change the paths in `js/config.js`)

### 5. Colours
Top of **`css/style.css`** (`:root` variables).

### 6. Opening hours text
Also appears in `index.html` (search for “11:00 AM”) and in the schema JSON near the top of `index.html`.

---

## Order form behaviour (already set)

- **Home Delivery** or **Self Pickup** both available.
- Self Pickup uses a calendar date picker (past dates blocked, based on `timezone` in `js/config.js`). The chosen date is added to the WhatsApp message as *Pickup Date*.
- Delivery fee: **Rs. 100**.
- Delivery areas (dropdown): Faizabad, Shamshabad, Six Road, Dhok Kala Khan.
- Customer can tick **“Same as my WhatsApp number”** so they don’t have to type a separate call number.
- WhatsApp message uses **bold headings** (*Name:*, *Area:*, *TOTAL:*, etc.) so it is easy to scan and call/confirm.
