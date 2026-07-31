<div align="center">
  <h1>CursorLaunch</h1>
  <p><strong>A beautiful, high-performance interactive Rocket Cursor animation built with HTML5 Canvas and Vanilla JavaScript.</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  </p>
</div>

<br />

**CursorLaunch** replaces your standard mouse cursor with a dynamic, animated rocket that smoothly follows your mouse movements. As you navigate the screen, you are fully immersed in a deep space environment complete with dynamic twinkling stars and trailing exhaust particles. 

## ✨ Immersive Features

CursorLaunch offers a rich, interactive experience by combining several dynamic visual effects. At its core, smart tracking fluidly calculates the rocket's velocity, allowing it to smoothly follow your cursor and automatically rotate to face its movement direction. To enhance the realism of the launch, the rocket features real-time animated engine flames and exhaust particles that scale naturally based on how fast you move your mouse. These visual elements are complemented by smooth, fading smoke and particle trails that gracefully lag behind the primary visual. 

The entire experience takes place against a deep space backdrop enriched with dynamic, twinkling stars. For additional interactivity, clicking anywhere on the screen triggers a beautiful cosmic ripple expansion effect. All of this runs at a highly responsive 60 frames per second using pure Vanilla JavaScript, completely bypassing heavy DOM manipulations by painting directly onto a single HTML5 Canvas layer. The animation is seamlessly functional across both desktop and touch devices, ensuring a premium experience everywhere.

---

## 🛠️ Quick Start

Getting started with CursorLaunch is incredibly straightforward, as there are no complicated build steps, node modules, or dependencies required. Everything runs natively using pure web technology. 

To view it locally, you can first clone the repository using `git clone https://github.com/venukarthikeya/CursorLaunch.git`. Once downloaded, you have two options. The simpler method is to just double-click the `index.html` file to open it directly in your default web browser. Alternatively, for a more robust setup—especially if you're planning on making further interactive enhancements—we highly recommend running it through a local server. You can effortlessly start one using Python by running `python -m http.server 8080`, or via Node.js by executing `npx http-server -p 8080`, and then visiting `http://localhost:8080/` in your browser.

---

## 🏗️ Project Architecture & How It Works

The project file structure is intentionally minimalist. At its root, `index.html` governs the main application structure, `style.css` handles basic page styling alongside zero-margin element resets, and the entirety of the visual logic resides within `script.js`. 

Under the hood, the JavaScript engine heavily leverages the powerful HTML5 Canvas API in synchronization with the browser's native `requestAnimationFrame()` loop to quickly recalculate and paint objects 60 times a second. By using smart math abstractions like `Math.atan2`, the engine processes natural vector rotations and directionality flawlessly. We ensure extended high-performance by bypassing DOM-heavy lifecycles, and our built-in memory management dynamically garbage collects dead particle objects to entirely prevent memory leaks during long browsing sessions.

### Core Movement Logic (script.js excerpt)
Here is a small snippet showcasing how the rocket mathematically tracks calculating fluid easing and continuous re-alignment with HTML5 math:

```javascript
update(targetX, targetY) {
    let d = dist(this.x, this.y, targetX, targetY);
    let targetAngle = angleBetween(this.x, this.y, targetX, targetY);

    if (d > 5) {
        // Find the shortest rotational path
        let diff = targetAngle - this.angle;
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));
        
        // Smoothly interpolate the angle
        this.angle += diff * 0.15; 

        // Ease speed based on proximity to the cursor
        this.speed = Math.min(this.maxSpeed, d * 0.1);
        
        // Update literal coordinates
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
    } else {
        this.speed *= 0.8; // Decelerate smoothly
    }
}
```

---

## 🎓 Learning Outcomes

Diving into this codebase serves as a fantastic educational reference for developers looking to master 2D web rendering. It provides hands-on exposure to implementing the Canvas API and mastering the browser's native animation frames. Furthermore, it showcases the architecture behind physics-based interactive cursor tracking, generating lightweight custom particle systems, and practically applying geometry and trigonometry inside high-performance visual loops.

---

## 🔮 Future Roadmap

As CursorLaunch continues to evolve, several exciting features are on the horizon. We are planning to introduce a variety of rocket ship skins so users can customize their cursor experience further. Future updates will also include interactive theme switchers, specialized hyper-drive physics modes for a more chaotic visual experience, and the addition of spatial engine sound effects to turn it into a truly multisensory experience.

<br />

<div align="center">
  <i>Built with ✨ styling for front-end visual experimentation.</i>
</div>