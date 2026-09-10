(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '10000'
  });
  document.body.append(canvas);

  const context = canvas.getContext('2d');
  const particles = [];
  let pixelRatio = 1;
  let lastPoint = null;

  const resize = () => {
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * pixelRatio);
    canvas.height = Math.round(window.innerHeight * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  };

  const addParticle = (x, y) => {
    particles.push({
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 10,
      size: 2 + Math.random() * 3,
      life: 1,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: -0.4 - Math.random() * 0.8,
      hue: Math.random() > 0.42 ? 112 : 278
    });
    if (particles.length > 70) particles.shift();
  };

  window.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    const point = { x: event.clientX, y: event.clientY };
    if (!lastPoint || Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y) > 8) {
      addParticle(point.x, point.y);
      lastPoint = point;
    }
  }, { passive: true });

  window.addEventListener('resize', resize, { passive: true });
  resize();

  const draw = () => {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let index = particles.length - 1; index >= 0; index -= 1) {
      const particle = particles[index];
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.life -= 0.025;

      if (particle.life <= 0) {
        particles.splice(index, 1);
        continue;
      }

      const alpha = particle.life * 0.75;
      context.save();
      context.translate(particle.x, particle.y);
      context.rotate((1 - particle.life) * Math.PI);
      context.strokeStyle = `hsla(${particle.hue}, 90%, 72%, ${alpha})`;
      context.shadowColor = `hsla(${particle.hue}, 95%, 62%, ${alpha})`;
      context.shadowBlur = 10;
      context.lineWidth = 1.2;
      context.beginPath();
      context.moveTo(-particle.size, 0);
      context.lineTo(particle.size, 0);
      context.moveTo(0, -particle.size);
      context.lineTo(0, particle.size);
      context.stroke();
      context.restore();
    }

    window.requestAnimationFrame(draw);
  };

  draw();
})();
