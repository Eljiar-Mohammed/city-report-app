# 🏙️ City Fix - Civic Reporting App

A mobile application empowering citizens to report municipal issues (potholes, lighting, sanitation) instantly using geolocation and visual evidence. Built for the modern smart city.

## 📱 Screenshots
<div style="display: flex; flex-direction: row;">
  <img src="/assets/screenshots/Screenshot_report-preview.jpg" width="200" />
  <img src="/assets/screenshots/Screenshot_list_reports-preview.jpg" width="200" />
  <img src="/assets/screenshots/Screenshot_map-preview.jpg" width="200" />
</div>

## 🚀 Tech Stack

* **Framework:** React Native (Expo SDK 52)
* **Language:** TypeScript
* **Backend:** Supabase (PostgreSQL)
* **Maps:** React Native Maps
* **State Management:** React Hooks
* **Architecture:** Modular Component Structure

## ✨ Key Features

* **📸 Visual Reporting:** Capture photos directly within the app using Expo Camera.
* **📍 Precision Geolocation:** Auto-detect incidents location with Reverse Geocoding.
* **🗺️ Interactive Map:** Visualize reports on a dynamic map interface.
* **🏷️ Categorization:** Smart tagging for reports (Roads, Lighting, etc.).
* **☁️ Cloud Sync:** Real-time data storage and image hosting via Supabase.

## 🛠️ Installation

1.  Clone the repository:
    ```bash
    git clone [https://github.com/Eljiar-Mohammed/city-fix-app.git](https://github.com/Eljiar-Mohammed/city-fix-app.git)
    ```
2.  Install dependencies:
    ```bash
    cd city-fix-app
    npm install
    ```
3.  **Configuration:**
    * Create a Supabase project.
    * Update `src/services/supabase.ts` with your own `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

4.  Run the app:
    ```bash
    npx expo start
    ```

## 👨‍💻 Author
**Eljiar Mohammed** - Full Stack Developer