# Lorenzo C. Badilla | Portfolio

A personal portfolio website with an animated, dark red theme, background video and music, and a chat-style contact section. Built with plain HTML, CSS and JavaScript (no build step).

## Features

- Animated "Enter" screen that starts the background music
- Full-screen looping background video
- Typing effect, scroll animations, particles and glowing cursor
- About me section with skills
- Social media cards (Facebook, TikTok, Instagram) with Font Awesome icons
- Instagram-DM-style chat in the "Let's talk" section that opens my Instagram direct messages
- Responsive design for phones and desktops

## Tech Stack

- HTML5
- CSS3 (animations, glassmorphism, responsive layout)
- JavaScript (vanilla)
- [Font Awesome](https://fontawesome.com/) for icons
- Google Fonts (Outfit, Space Grotesk)
- Hosted on [Render](https://render.com/)

## Project Structure

```
.
├── index.html        # Page structure and content
├── style.css         # Styles and animations
├── script.js         # Music, chat, typing effect, particles
├── README.md
└── Files/
    └── SoundS/
        ├── Background.mp3     # Background music
        ├── BackgroundV.mp4    # Background video
        ├── poster.jpg         # Video placeholder image
        └── Pic.jpeg           # Profile picture / tab icon
```

> Folder and file names are case-sensitive on Render, so keep `SoundS`, `Background.mp3`, `BackgroundV.mp4` and `Pic.jpeg` exactly as written.

## Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/Lorenzonotbabaero/Portfolio.git
   cd Portfolio
   ```
2. Open `index.html` in your browser, or serve the folder:
   ```bash
   python3 -m http.server 8000
   ```
   Then visit `http://localhost:8000`.

## Deploy on Render

1. Push this project to GitHub.
2. On [Render](https://dashboard.render.com), choose **New → Static Site** and connect this repository.
3. Use these settings:
   - **Branch:** `main`
   - **Build Command:** leave empty
   - **Publish Directory:** `.`
4. Click **Create Static Site**.

Every push to `main` redeploys automatically.

## Customize

- **Text and links:** edit `index.html` (name, about me, social media links).
- **Music:** change `MUSIC_SRC` at the top of `script.js`.
- **Colors:** change the color variables at the top of `style.css`.

## Author

**Lorenzo C. Badilla**

- GitHub: [@Lorenzonotbabaero](https://github.com/Lorenzonotbabaero)
- Instagram: [@lor.zxa](https://instagram.com/lor.zxa)
- TikTok: [@loren.zoofficial](https://tiktok.com/@loren.zoofficial)
- Facebook: [LorenzoC.Badilla](https://facebook.com/LorenzoC.Badilla)
