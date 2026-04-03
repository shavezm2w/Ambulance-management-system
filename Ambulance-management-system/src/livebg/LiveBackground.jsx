import { useEffect, useRef } from "react";

export function LiveBackground({ variant = "default" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationId;
    let particles = [];
    let mouse = { x: -1000, y: -1000 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouse);

    // Particle class
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.speedY = (Math.random() - 0.5) * 0.8;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulse += this.pulseSpeed;

        // Mouse interaction — particles gently repel
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          this.x += (dx / dist) * force * 2;
          this.y += (dy / dist) * force * 2;
        }

        // Wrap around edges
        if (this.x < -10) this.x = canvas.width + 10;
        if (this.x > canvas.width + 10) this.x = -10;
        if (this.y < -10) this.y = canvas.height + 10;
        if (this.y > canvas.height + 10) this.y = -10;
      }

      draw() {
        const pulseOpacity = this.opacity + Math.sin(this.pulse) * 0.15;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle =
          variant === "dark"
            ? `rgba(255, 255, 255, ${pulseOpacity})`
            : `rgba(0, 0, 0, ${pulseOpacity})`;
        ctx.fill();
      }
    }

    // Create particles
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 200);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }

    // Connection lines
    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const opacity = ((120 - dist) / 120) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle =
              variant === "dark"
                ? `rgba(255, 255, 255, ${opacity})`
                : `rgba(0, 0, 0, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    // Floating geometric shapes
    const shapes = [];
    for (let i = 0; i < 6; i++) {
      shapes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 60 + 20,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.005,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        sides: Math.floor(Math.random() * 3) + 3, // triangle, square, pentagon
        opacity: Math.random() * 0.06 + 0.02,
      });
    }

    function drawShapes() {
      shapes.forEach((s) => {
        s.x += s.speedX;
        s.y += s.speedY;
        s.rotation += s.rotSpeed;

        if (s.x < -100) s.x = canvas.width + 100;
        if (s.x > canvas.width + 100) s.x = -100;
        if (s.y < -100) s.y = canvas.height + 100;
        if (s.y > canvas.height + 100) s.y = -100;

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);
        ctx.beginPath();

        for (let i = 0; i <= s.sides; i++) {
          const angle = (i * 2 * Math.PI) / s.sides;
          const px = Math.cos(angle) * s.size;
          const py = Math.sin(angle) * s.size;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }

        ctx.closePath();
        ctx.strokeStyle =
          variant === "dark"
            ? `rgba(255, 255, 255, ${s.opacity})`
            : `rgba(0, 0, 0, ${s.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      });
    }

    // Mouse trail ring
    let mouseRing = { x: -1000, y: -1000, radius: 0 };

    function drawMouseRing() {
      mouseRing.x += (mouse.x - mouseRing.x) * 0.1;
      mouseRing.y += (mouse.y - mouseRing.y) * 0.1;

      ctx.beginPath();
      ctx.arc(mouseRing.x, mouseRing.y, 80, 0, Math.PI * 2);
      ctx.strokeStyle =
        variant === "dark"
          ? "rgba(255, 255, 255, 0.08)"
          : "rgba(0, 0, 0, 0.06)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      drawConnections();
      drawShapes();
      drawMouseRing();

      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
