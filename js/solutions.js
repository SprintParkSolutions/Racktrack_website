document.documentElement.classList.add('solutions-motion');

// The cabinet reader uses the original source-page interaction model: pointer
// tilt, mode-specific overlays, and keyboard-friendly reading controls.
const rackStage = document.getElementById('rk-stage');
const rackControls = document.getElementById('rk-controls');
const rackReadout = document.getElementById('rk-read');
if (rackStage && rackControls) {
  const copy = {
    sweep: 'Reading the cabinet top to bottom. Each device registers as the sweep passes it.',
    ports: 'Port grids resolved on the patch panel and the ToR switch. Filled ports are in use.',
    leds: 'Link indicators on the powered devices. The patch panel is passive and stays dark.',
    cables: 'Cable paths traced between the ToR switch and the patch panel above it.',
  };
  const buttons = [...rackControls.querySelectorAll('.rk-btn')];
  const tilt = rackStage.querySelector('.rk-tilt');
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  if (tilt && !reduced?.matches) {
    rackStage.addEventListener('pointermove', (event) => {
      const bounds = rackStage.getBoundingClientRect();
      const value = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2));
      tilt.style.setProperty('--nudge', `${(value * 5).toFixed(2)}deg`);
    });
    rackStage.addEventListener('pointerleave', () => tilt.style.setProperty('--nudge', '0deg'));
  }
  const select = (button) => {
    const mode = button.dataset.rk;
    buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    rackStage.removeAttribute('data-mode');
    void rackStage.offsetWidth;
    rackStage.dataset.mode = mode;
    if (rackReadout && copy[mode]) rackReadout.textContent = copy[mode];
  };
  rackControls.addEventListener('click', (event) => {
    const button = event.target.closest('.rk-btn');
    if (button && rackControls.contains(button)) select(button);
  });
  rackControls.addEventListener('keydown', (event) => {
    const index = buttons.indexOf(document.activeElement);
    if (index < 0) return;
    let next = null;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % buttons.length;
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = buttons.length - 1;
    if (next === null) return;
    event.preventDefault();
    buttons[next].focus();
    select(buttons[next]);
  });
}

const revealItems = document.querySelectorAll('.process-intro .eyebrow, .process-intro h2, .process-intro .section-lede, .process-station, .schematic-section .eyebrow, .schematic-section .schematic-lede, .original-schematic, .workflow-section, .surface-grid article, .solutions-cta, [data-reveal]');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));

  // Safety net: force-reveal anything the observer hasn't caught a few
  // seconds after load, so nothing can stay permanently blank.
  window.setTimeout(() => {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }, 2500);
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

// Process rail: the vertical line next to Capture/Check/Use fills in step
// with how far you've scrolled through the section — a plain scroll-fraction
// calc, not a pinned/scrubbed section, so it never fights the page scroll.
const processRail = document.querySelector('[data-process-rail]');
if (processRail) {
  const fill = processRail.querySelector('[data-process-fill]');
  const reducedForRail = window.matchMedia?.('(prefers-reduced-motion: reduce)');

  if (reducedForRail?.matches) {
    fill.style.height = '100%';
  } else {
    let railTicking = false;
    const updateRail = () => {
      railTicking = false;
      const rect = processRail.getBoundingClientRect();
      const viewportAnchor = window.innerHeight * 0.75;
      const total = rect.height + viewportAnchor - window.innerHeight * 0.25;
      const traveled = Math.max(0, Math.min(total, viewportAnchor - rect.top));
      fill.style.height = `${total ? (traveled / total) * 100 : 0}%`;
    };
    const onRailScroll = () => {
      if (railTicking) return;
      railTicking = true;
      requestAnimationFrame(updateRail);
    };
    window.addEventListener('scroll', onRailScroll, { passive: true });
    window.addEventListener('resize', onRailScroll);
    updateRail();
  }
}

// Six surface cards sit side by side in a horizontally-scrolling, snapped
// row; the prev/next arrows just step the scroll position by one card
// width instead of driving a scroll-jacked stack animation.
const surfaceGrid = document.querySelector('[data-surface-grid]');
const surfacePrev = document.querySelector('[data-surface-prev]');
const surfaceNext = document.querySelector('[data-surface-next]');
if (surfaceGrid && (surfacePrev || surfaceNext)) {
  const cardStep = () => {
    const card = surfaceGrid.querySelector('article');
    if (!card) return surfaceGrid.clientWidth;
    const style = getComputedStyle(surfaceGrid);
    const gap = parseFloat(style.columnGap || style.gap || '0') || 0;
    return card.getBoundingClientRect().width + gap;
  };

  const updateArrowState = () => {
    const max = surfaceGrid.scrollWidth - surfaceGrid.clientWidth;
    if (surfacePrev) surfacePrev.disabled = surfaceGrid.scrollLeft <= 1;
    if (surfaceNext) surfaceNext.disabled = surfaceGrid.scrollLeft >= max - 1;
  };

  surfacePrev?.addEventListener('click', () => {
    surfaceGrid.scrollBy({ left: -cardStep(), behavior: 'smooth' });
  });
  surfaceNext?.addEventListener('click', () => {
    surfaceGrid.scrollBy({ left: cardStep(), behavior: 'smooth' });
  });

  surfaceGrid.addEventListener('scroll', updateArrowState, { passive: true });
  window.addEventListener('resize', updateArrowState);
  updateArrowState();
}
