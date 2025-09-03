# Forklift Controller UI

This project is a web-based controller UI for a forklift, built with React, TypeScript, and Vite. It provides interactive controls for steering, throttle (accelerator/brake), and gas, and communicates with a backend API (e.g., Arduino or similar device) to control a real or simulated forklift.

## Features

- **Steering Wheel**: Interactive, image-based steering wheel with inertia and realistic grab/drag behavior. Angle is clamped and sent to the backend.
- **Throttle**: Accelerator and brake controls. Accelerator increases throttle (forward), brake can instantly stop or, if held, gradually reverse. Throttle returns to zero when released.
- **Gas Pedal**: Slider for fine throttle control.
- **API IP Validation**: User must enter a valid API server IP address to connect and send commands.
- **Responsive UI**: Optimized for landscape mode and touch devices.

## Main Components

- `src/App.tsx`: Main app logic, API connection, and layout.
- `src/components/steering-wheel/`: Steering wheel control (canvas + PNG image).
- `src/components/throttle/`: Accelerator and brake pedal logic.
- `src/components/gas/`: Gas pedal slider.
- `src/hook/checkScreen.tsx`: Custom hook for screen orientation.

## Usage

1. Start the app with `npm run dev`.
2. Enter the forklift API server IP address when prompted.
3. Use the steering wheel, throttle, and gas controls to operate the forklift.
4. All control values are sent to the backend API in real time.

## Development

- Built with [Vite](https://vitejs.dev/), [React](https://react.dev/), and [TypeScript](https://www.typescriptlang.org/).
- See code comments in each file for details on component logic and structure.

---

MIT License
