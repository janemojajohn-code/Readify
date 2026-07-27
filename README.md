# ReadFlow AI — Intelligent Study Companion 📖⚡

**ReadFlow AI** is a modern, responsive web and mobile application designed to enhance reading comprehension, document narration, note-taking, and AI-powered study assistance.

![ReadFlow AI Interface](https://raw.githubusercontent.com/janemojajohn-code/Readify/main/dist/favicon.svg)

---

## Key Features

- 🗣️ **Text-to-Speech (TTS) Reader:** Real-time word-level boundary highlighting, auto-smooth scrolling, paragraph click-to-read (`▶ read from here`), and audio playback control bar.
- 🎙️ **Interactive Voice Selector:** Filter system voices (Female, Male, Local), preview speech samples, and customize speech rates (0.5×–2.0×) and pitch.
- 💡 **AI Study Assistant:** Generate instant document summaries (*Brief, Detailed, Bullet Points, Key Terms, Study Notes*) and ask targeted questions via document Q&A.
- 📚 **Document Library:** Drag-and-drop file import (PDF, PNG, JPG, DOCX) or plain text paster with custom cover color banners and status filtering (*All, Unread, Reading, Completed*).
- ✏️ **Notes & Highlights:** Track highlights, bookmarks, and sticky notes connected directly to specific document pages.
- 🌓 **Appearance Customization:** Light & Dark Mode toggle, reader font selections (*Merriweather Serif, Inter Sans, JetBrains Mono*), and font size sliders.

---

## Tech Stack

- **Core Framework:** React 18 + Vite
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4 + HSL Design Tokens
- **Icons:** Lucide React
- **Speech Engine:** Web Speech API (`window.speechSynthesis`)
- **Native Mobile Wrapper:** Capacitor 6 (Android)
- **CI/CD:** GitHub Actions (.github/workflows/android-build.yml)

---

## Getting Started

### 1. Installation
Clone the repository and install node dependencies:
```bash
git clone https://github.com/janemojajohn-code/Readify.git
cd Readify
npm install
```

### 2. Development Server
Run the local Vite dev server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Production Web Build
Verify and compile production static web bundle:
```bash
npm run build
```

---

## Mobile Android APK Build

### 1. Synchronize Web Build to Capacitor
```bash
npm run cap:sync
```

### 2. Generate APK locally with Gradle
```bash
cd android
./gradlew assembleDebug
```
The generated APK will be available at:
`android/app/build/outputs/apk/debug/app-debug.apk`

---

## Automated GitHub Artifacts & Releases

This repository includes a GitHub Actions workflow (`.github/workflows/android-build.yml`) that automatically:

1. **Builds & Validates:** Compiles the React application and Android native project on every push to `main` or pull request.
2. **Publishes GitHub Artifacts:** Uploads the compiled `ReadFlow-AI-APK` to **Actions → Artifacts** for instant download.
3. **Automated Releases:** When a version tag (e.g. `v1.0.0`) is pushed, a GitHub Release is published with `app-debug.apk` attached.

---

## License

MIT License. Designed with ❤️ for learners everywhere.