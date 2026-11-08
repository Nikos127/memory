# Memory Game

A browser-based memory matching game for two players on the same device. Choose a theme, set the board size, and compete to find the most matching pairs.

Built with TypeScript, SCSS, and Vite.

## Features

- **Local multiplayer:** Blue and Orange take turns on one device.
- **Two themes:** Code vibes and Foods, with a preview in the settings screen.
- **Three board sizes:** 16, 24, or 36 cards (8, 12, or 18 pairs).
- **Selectable starting player:** Choose whether Blue or Orange goes first.
- **Shuffled cards:** Each game starts with a newly shuffled board.
- **Live scores:** See each player's score and whose turn it is.
- **Game results:** View the final scores and the winner or a draw.
- **Responsive styling:** Layout adjustments for smaller screens and animated card flips.
- **Exit confirmation:** Return to the game or leave it to change the settings.

## How to Play

1. Select **Play** on the start screen.
2. Choose a theme, the starting player, and a board size, then select **Start**.
3. Reveal two cards by selecting them.
4. If the cards match, you earn one point and take another turn. Matched cards stay visible.
5. If they do not match, they turn face down after about one second, and the other player takes a turn.
6. Continue until all pairs have been found. The player with the most points wins; equal scores result in a draw.

## Tech Stack

| Technology | Purpose |
| --- | --- |
| HTML | Page structure and game screens |
| TypeScript | Game logic, state, and DOM interactions |
| SCSS / Sass | Styling, themes, responsive layouts, and animations |
| Vite | Development server and production builds |

The application runs entirely in the browser and does not require a backend or API keys. Game progress is kept in memory and resets when the page is reloaded.

## Getting Started

### Prerequisites

- Node.js 22.12.0 or newer
- npm
- Git, if you want to clone the repository

### Installation

Clone the repository and install the dependencies from the lockfile:

```bash
git clone https://github.com/Nikos127/memory.git
cd memory
npm ci
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed in the terminal.

### Available Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Run TypeScript checks and create a production build in `dist/` |
| `npm run preview` | Serve the production build locally for preview |

To build and preview the application:

```bash
npm run build
npm run preview
```

The generated `dist/` directory contains the static files for deployment.

## Project Structure

```text
memory/
|-- public/
|   `-- assets/
|       |-- fonts/          # Local font files
|       `-- images/         # Card artwork, theme previews, and UI graphics
|-- src/
|   |-- styles/             # SCSS organized by base, pages, and other layers
|   |-- board.ts            # Board rendering and card matching
|   |-- cards.ts            # Card creation and shuffling
|   |-- game-state.ts       # Player turns and scores
|   |-- main.ts             # Application entry point
|   |-- navigation.ts       # Screen navigation and exit confirmation
|   |-- results.ts          # End-of-game scores and winner display
|   `-- settings.ts         # Theme, starting player, and board size selection
|-- index.html             # Main HTML document
|-- package.json           # Dependencies and npm scripts
|-- package-lock.json      # Locked dependency versions
`-- tsconfig.json          # TypeScript configuration
```
