// Animation example
const tl = gsap.timeline({
  defaults: { duration: 0.5, ease: 'none', opacity: 0}
});

tl.from('.animated-title', { y: -30 });
tl.from('.animated-text', { x: -10 });

