import { createIcons, icons } from 'lucide';
import { projectsData } from './src/projectsData.js';
import { saveContactLead, sendChatMessage } from './src/apiClient.js';
import { showNotification } from './src/notification.js';
import { initCursorEffects } from './src/interactions/cursorEffects.js';


/* =====================================================
   MAIN INITIALIZATION
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  repairMojibake();

  /* ===================================================
     COOKIE CONSENT
     =================================================== */

  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookies = document.getElementById('accept-cookies');

  if (cookieBanner && acceptCookies) {

    const cookiesAccepted = localStorage.getItem('asys_cookie_consent');

    // Si ya aceptó anteriormente, ocultar el banner
    if (cookiesAccepted === 'accepted') {

      cookieBanner.style.display = 'none';

      // Cargar Google Analytics únicamente
      // después de tener consentimiento
      initGoogleAnalytics();

    } else {

      // Mostrar banner
      cookieBanner.style.display = 'block';
    }

    // Botón ACEPTAR
    acceptCookies.addEventListener('click', () => {

      // Guardar consentimiento
      localStorage.setItem(
        'asys_cookie_consent',
        'accepted'
      );

      // Ocultar banner
      cookieBanner.style.display = 'none';

      // Inicializar Google Analytics
      // después del consentimiento
      initGoogleAnalytics();

      console.log(
        'Consentimiento de cookies aceptado.'
      );
    });
  }


  /* ===================================================
     LUCIDE ICONS
     =================================================== */

  try {

    createIcons({ icons });

  } catch (err) {

    console.warn(
      'Lucide Icons fallback:',
      err
    );
  }


  setupExperienceInteractions();
  setupAsysAiChat();

  /* ===================================================
     CURSOR EFFECTS & INTERACTIONS
     =================================================== */

  try {

    initCursorEffects();

    // Add cursor-active class to body for custom cursor
    document.addEventListener('mousemove', () => {
      document.body.classList.add('cursor-active');
    }, { once: true });

  } catch (err) {

    console.warn(
      'Cursor effects fallback:',
      err
    );
  }

  /* ===================================================
     PROJECTS
     =================================================== */

  try {

    renderProjects('all');

    setupProjectFilters();

  } catch (err) {

    console.warn(
      'Projects setup fallback:',
      err
    );
  }


  /* ===================================================
     ASYS INTELLIGENCE DIAGNOSTIC
     =================================================== */

  try {

    setupIntelligenceDiagnostic();

  } catch (err) {

    console.warn(
      'Intelligence diagnostic fallback:',
      err
    );
  }


  /* ===================================================
     NAVBAR
     =================================================== */

  try {

    setupNavbar();

  } catch (err) {

    console.warn(
      'Navbar setup fallback:',
      err
    );
  }


  /* ===================================================
     CONTACT FORM
     =================================================== */

  try {

    setupContactForm();

  } catch (err) {

    console.warn(
      'Contact form fallback:',
      err
    );
  }


  /* ===================================================
     GLOBAL ICON REFRESH
     =================================================== */

  window.refreshIcons = () => {

    try {

      createIcons({ icons });

    } catch (err) {

      console.warn(
        'Icon refresh fallback:',
        err
      );
    }
  };

});

function repairMojibake() {
  const fix = value => {
    if (!/[ÃÂ]/.test(value)) return value;
    try {
      return new TextDecoder('utf-8', { fatal: true }).decode(
        Uint8Array.from(value, char => char.charCodeAt(0))
      );
    } catch {
      return value;
    }
  };
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => { node.nodeValue = fix(node.nodeValue); });
  document.querySelectorAll('[aria-label], [placeholder], [title], meta[content]').forEach(element => {
    ['aria-label', 'placeholder', 'title', 'content'].forEach(attribute => {
      if (element.hasAttribute(attribute)) element.setAttribute(attribute, fix(element.getAttribute(attribute)));
    });
  });
}

function setupAsysAiChat() {
  const panel = document.getElementById('asys-chat');
  const launcher = document.getElementById('asys-chat-launcher');
  const close = document.getElementById('asys-chat-close');
  const form = document.getElementById('asys-chat-form');
  const input = document.getElementById('asys-chat-text');
  const messages = document.getElementById('asys-chat-messages');
  const suggestions = document.getElementById('asys-chat-suggestions');
  if (!panel || !launcher || !form || !input || !messages) return;
  const history = [];
  const addMessage = (content, role, data = {}) => {
    const item = document.createElement('div'); item.className = `asys-message ${role}`;
    const text = document.createElement('p'); text.textContent = content; item.append(text);
    if (data.cta) { const link = document.createElement('a'); link.href = data.cta.url; link.className = 'asys-message-cta'; link.textContent = data.cta.label; if (data.cta.url.startsWith('http')) { link.target = '_blank'; link.rel = 'noopener noreferrer'; } item.append(link); }
    messages.append(item); messages.scrollTop = messages.scrollHeight; return item;
  };
  const open = () => { panel.classList.add('is-open'); panel.setAttribute('aria-hidden', 'false'); launcher.setAttribute('aria-expanded', 'true'); input.focus(); };
  const hide = () => { panel.classList.remove('is-open'); panel.setAttribute('aria-hidden', 'true'); launcher.setAttribute('aria-expanded', 'false'); };
  launcher.addEventListener('click', open); close?.addEventListener('click', hide);
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && panel.classList.contains('is-open')) hide(); });
  addMessage('Hola 👋 Soy ASYS AI. Puedo ayudarte a conocer ASYS, explorar soluciones o identificar oportunidades de automatización para tu empresa. ¿Qué te gustaría saber?', 'assistant');
  const send = async raw => {
    const message = raw.trim(); if (!message) return;
    addMessage(message, 'user'); history.push({ role: 'user', content: message }); input.value = ''; suggestions?.replaceChildren();
    const typing = addMessage('ASYS AI está analizando…', 'assistant typing');
    try {
      const result = await sendChatMessage({ message, history: history.slice(0, -1).slice(-8), pageContext: window.location.hash || window.location.pathname });
      typing.remove(); addMessage(result.answer, 'assistant', result); history.push({ role: 'assistant', content: result.answer });
    } catch (error) { typing.remove(); addMessage(error.message || 'Nuestro asistente está temporalmente ocupado. Puedes contactar directamente con ASYS.', 'assistant', { cta: { label: 'Hablar con ASYS por WhatsApp', url: 'https://wa.me/573117304768' } }); }
  };
  form.addEventListener('submit', event => { event.preventDefault(); send(input.value); });
  input.addEventListener('keydown', event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); form.requestSubmit(); } });
  suggestions?.addEventListener('click', event => { if (event.target instanceof HTMLButtonElement) send(event.target.textContent || ''); });
}


function setupExperienceInteractions() {
  document.documentElement.classList.add('js-ready');
  const serviceData = {
    automation: ['CAPACIDAD ASYS / 01', 'Automatización que libera a tu equipo.', 'Diseñamos flujos que eliminan tareas repetitivas, conectan tus herramientas y devuelven tiempo a las personas que hacen crecer el negocio.'],
    ai: ['CAPACIDAD ASYS / 02', 'Inteligencia para decidir mejor.', 'Creamos asistentes y modelos que convierten la información de tu operación en respuestas, señales y decisiones más rápidas.'],
    software: ['CAPACIDAD ASYS / 03', 'Software que entiende tu operación.', 'Construimos plataformas a medida, desde dashboards hasta sistemas internos, con una experiencia clara para cada equipo.'],
    integrations: ['CAPACIDAD ASYS / 04', 'Un ecosistema que trabaja conectado.', 'Integramos APIs, canales y herramientas para que los datos fluyan y tu operación deje de depender de tareas duplicadas.']
  };
  const teasers = document.querySelectorAll('.service-teaser');
  const serviceKicker = document.getElementById('service-kicker');
  const serviceTitle = document.getElementById('service-title');
  const serviceDescription = document.getElementById('service-description');

  teasers.forEach(teaser => teaser.addEventListener('click', () => {
    teasers.forEach(item => item.classList.remove('active'));
    teaser.classList.add('active');
    const content = serviceData[teaser.dataset.service];
    if (!content) return;
    serviceKicker.textContent = content[0];
    serviceTitle.textContent = content[1];
    serviceDescription.textContent = content[2];
  }));

  const problemData = [
    ['Menos operación repetitiva.', 'ASYS convierte tareas repetitivas en flujos automáticos que avanzan incluso cuando tu equipo está enfocado en lo importante.', 'Solución ASYS / Automatización', 'Impacto / Tiempo recuperado'],
    ['Una sola fuente de verdad.', 'Centralizamos la información clave para que cada persona encuentre lo que necesita y trabaje con datos confiables.', 'Solución ASYS / Datos conectados', 'Impacto / Claridad operativa'],
    ['Todo tu ecosistema, conectado.', 'Integramos las herramientas que ya usas para eliminar reprocesos y hacer que cada sistema comparta el mismo contexto.', 'Solución ASYS / Integraciones', 'Impacto / Flujo sin fricciones'],
    ['Decisiones con señales claras.', 'Convertimos datos dispersos en tableros y alertas que permiten actuar antes, medir mejor y crecer con control.', 'Solución ASYS / Inteligencia de datos', 'Impacto / Mejor toma de decisiones']
  ];
  const problemItems = document.querySelectorAll('.problem-item');
  problemItems.forEach(item => item.addEventListener('click', () => {
    problemItems.forEach(entry => entry.classList.remove('active'));
    item.classList.add('active');
    const content = problemData[Number(item.dataset.problem)];
    document.getElementById('problem-title').textContent = content[0];
    document.getElementById('problem-description').textContent = content[1];
    document.getElementById('problem-solution').textContent = content[2];
    document.getElementById('problem-impact').textContent = content[3];
  }));

  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    revealElements.forEach(element => observer.observe(element));
  } else {
    revealElements.forEach(element => element.classList.add('is-visible'));
  }

  const workflowSteps = document.querySelectorAll('.workflow-step');
  workflowSteps.forEach((step, index) => step.addEventListener('mouseenter', () => {
    workflowSteps.forEach(item => item.classList.remove('active'));
    workflowSteps[index].classList.add('active');
  }));
}


/* =====================================================
   ASYS INTELLIGENCE PLATFORM DIAGNOSTIC
   ===================================================== */

function setupIntelligenceDiagnostic() {

  const form = document.getElementById('intelligence-form');
  const analysis = document.getElementById('intelligence-analysis');
  const result = document.getElementById('intelligence-result');
  const reset = document.getElementById('intelligence-reset');

  if (!form || !analysis || !result || !reset) return;

  const analysisMessage = document.getElementById('analysis-message');
  const analysisProgress = document.getElementById('analysis-progress-bar');
  const analysisProgressValue = document.getElementById('analysis-progress-value');
  const scoreElement = document.getElementById('potential-score');
  const scoreProgress = document.getElementById('score-progress-bar');
  const opportunitySummary = document.getElementById('opportunity-summary');
  const opportunityList = document.getElementById('opportunity-list');
  const analysisSteps = [
    'Analizando sitio web...',
    'Analizando atención al cliente...',
    'Analizando procesos repetitivos...',
    'Analizando oportunidades de automatización...',
    'Generando diagnóstico...'
  ];

  const calculateScore = values => {
    const companyPoints = {
      restaurante: 22, comercio: 20, servicios: 19,
      salud: 18, educacion: 16, otro: 14
    };
    let score = companyPoints[values.companyType] || 14;
    score += values.website === 'yes' ? 14 : 7;
    score += values.whatsapp === 'yes' ? 20 : 5;
    score += values.repetitive === 'yes' ? 22 : 8;
    score += values.crm === 'no' ? 20 : 11;
    return Math.min(98, Math.max(45, score));
  };

  const getOpportunities = values => [
    values.whatsapp === 'yes'
      ? 'Automatización de respuestas por WhatsApp'
      : 'Implementación de atención automatizada por WhatsApp',
    values.repetitive === 'yes'
      ? 'Captación y clasificación automática de leads'
      : 'Centralización inteligente de consultas y solicitudes',
    values.crm === 'no'
      ? 'Seguimiento automático de clientes y prospectos'
      : 'Automatización de seguimientos desde su CRM',
    'Integración entre sistemas y canales de atención',
    'Generación automática de reportes operativos'
  ];

  const animateScore = score => {
    const start = performance.now();
    const duration = 1100;
    const update = now => {
      const progress = Math.min((now - start) / duration, 1);
      const currentScore = Math.round(score * (1 - Math.pow(1 - progress, 3)));
      scoreElement.textContent = currentScore;
      scoreProgress.style.width = `${currentScore}%`;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const values = {
      companyType: data.get('company-type'), website: data.get('website'),
      whatsapp: data.get('whatsapp'), repetitive: data.get('repetitive'), crm: data.get('crm')
    };
    const score = calculateScore(values);
    const opportunities = getOpportunities(values);

    form.hidden = true;
    analysis.hidden = false;
    result.hidden = true;
    reset.hidden = true;
    analysisProgress.style.width = '0%';
    analysisProgressValue.textContent = '0%';

    analysisSteps.forEach((message, index) => {
      window.setTimeout(() => {
        const progress = Math.round(((index + 1) / analysisSteps.length) * 100);
        analysisMessage.textContent = message;
        analysisProgress.style.width = `${progress}%`;
        analysisProgressValue.textContent = `${progress}%`;
      }, index * 620);
    });

    window.setTimeout(() => {
      analysis.hidden = true;
      opportunitySummary.textContent = `ASYS detectó ${opportunities.length} oportunidades de automatización para tu empresa.`;
      opportunityList.innerHTML = opportunities
        .map((opportunity, index) => `<div class="opportunity-item" style="animation-delay:${index * 90}ms"><i data-lucide="check-circle-2"></i><span>${opportunity}</span></div>`)
        .join('');
      result.hidden = false;
      reset.hidden = false;
      animateScore(score);

      try {
        createIcons({ icons });
      } catch (err) {
        console.warn('Diagnostic icon refresh fallback:', err);
      }
    }, analysisSteps.length * 620 + 150);
  });

  reset.addEventListener('click', () => {
    form.reset();
    result.hidden = true;
    reset.hidden = true;
    form.hidden = false;
    form.querySelector('#company-type')?.focus();
  });
}


/* =====================================================
   RENDER PROJECTS REPOSITORY
   ===================================================== */

function renderProjects(filterCategory = 'all') {

  const projectsGrid =
    document.getElementById('projects-grid');

  if (!projectsGrid) return;


  const filteredProjects =
    filterCategory === 'all'
      ? projectsData
      : projectsData.filter(
          p => p.category === filterCategory
        );


  projectsGrid.innerHTML = '';


  filteredProjects.forEach(project => {

    const card = document.createElement('div');

    card.className =
      'clean-card project-card';

    card.dataset.id =
      project.id;


    const previewImg =
      project.images &&
      project.images[0]
        ? project.images[0].url
        : '/assets/logo.jpg';


    card.innerHTML = `

      <div
        class="project-header-banner"
        style="
          background: ${project.imageBg};
          position:relative;
          overflow:hidden;
        "
      >

        <img
          src="${previewImg}"
          alt="${project.title}"
          style="
            position:absolute;
            top:0;
            left:0;
            width:100%;
            height:100%;
            object-fit:cover;
            opacity:0.35;
            mix-blend-mode:luminosity;
          "
        >

        <span
          class="project-cat-badge"
          style="
            position:relative;
            z-index:2;
          "
        >
          ${project.categoryLabel}
        </span>

        <h4
          style="
            color:#fff;
            font-size:1.05rem;
            text-shadow:0 2px 8px rgba(0,0,0,0.6);
            position:relative;
            z-index:2;
          "
        >
          ${project.client}
        </h4>

      </div>


      <div class="project-body">

        <div>

          <h3 class="project-title">
            ${project.title}
          </h3>

          <p class="project-summary">
            ${project.shortDescription}
          </p>

        </div>


        <div class="project-metrics-grid">

          <div class="metric-item">

            <span>
              Eficiencia Impacto
            </span>

            <strong>
              ${project.impactMetrics.efficiency}
            </strong>

          </div>


          <div class="metric-item">

            <span>
              Tiempo Ahorrado
            </span>

            <strong>
              ${project.impactMetrics.timeSaved}
            </strong>

          </div>

        </div>


        <div class="tech-tags">

          ${project.technologies
            .slice(0, 3)
            .map(
              tech =>
                `<span class="tech-tag">${tech}</span>`
            )
            .join('')}

        </div>


        <div class="project-card-footer">

          <button
            class="btn btn-secondary btn-view-detail"
            style="
              width:100%;
              justify-content:center;
            "
            data-project-id="${project.id}"
          >

            <i data-lucide="eye"></i>

            Ver proyecto

          </button>

        </div>

      </div>
    `;


    /* ================================================
       3D CARD TILT EFFECT
       ================================================ */

    card.addEventListener(
      'mousemove',
      (e) => {

        const rect =
          card.getBoundingClientRect();

        const x =
          e.clientX - rect.left;

        const y =
          e.clientY - rect.top;

        const centerX =
          rect.width / 2;

        const centerY =
          rect.height / 2;

        const rotateX =
          (y - centerY) / 20;

        const rotateY =
          (centerX - x) / 20;


        card.style.transform =
          `perspective(1000px)
           rotateX(${rotateX}deg)
           rotateY(${rotateY}deg)
           translateY(-5px)`;
      }
    );


    card.addEventListener(
      'mouseleave',
      () => {

        card.style.transform =
          'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';

      }
    );


    projectsGrid.appendChild(card);

  });


  /* ================================================
     REINITIALIZE ICONS
     ================================================ */

  try {

    createIcons({ icons });

  } catch (err) {

    console.warn(
      'Project icons fallback:',
      err
    );
  }


  /* ================================================
     PROJECT DETAIL BUTTONS
     ================================================ */

  document
    .querySelectorAll('.btn-view-detail')
    .forEach(btn => {

      btn.addEventListener(
        'click',
        (e) => {

          const projectId =
            e.currentTarget.getAttribute(
              'data-project-id'
            );

          openProjectModal(projectId);

        }
      );

    });

}


/* =====================================================
   SETUP PROJECT FILTER BUTTONS
   ===================================================== */

function setupProjectFilters() {

  const filterBtns =
    document.querySelectorAll(
      '.filter-btn'
    );


  filterBtns.forEach(btn => {

    btn.addEventListener(
      'click',
      () => {

        filterBtns.forEach(
          b =>
            b.classList.remove(
              'active'
            )
        );


        btn.classList.add(
          'active'
        );


        const filter =
          btn.getAttribute(
            'data-filter'
          );


        renderProjects(filter);

      }
    );

  });

}


/* =====================================================
   OPEN PROJECT DETAIL MODAL
   ===================================================== */

function openProjectModal(projectId) {

  const project =
    projectsData.find(
      p => p.id === projectId
    );

  if (!project) return;


  const modal =
    document.getElementById(
      'project-modal'
    );

  const modalBody =
    document.getElementById(
      'modal-body-content'
    );


  if (!modal || !modalBody) return;


  modalBody.innerHTML = `

    <button
      class="modal-close-btn"
      id="modal-close-btn"
    >
      &times;
    </button>


    <div style="margin-bottom:20px;">

      <span class="badge">

        <i data-lucide="folder-git-2"></i>

        ${project.categoryLabel}

      </span>


      <h2
        style="
          font-size:1.8rem;
          font-weight:800;
          margin-top:8px;
          color:var(--navy-dark);
        "
      >
        ${project.title}
      </h2>


      <p
        style="
          color:var(--blue-primary);
          font-weight:700;
          font-size:1.05rem;
        "
      >
        Cliente / Usuario Real:
        ${project.client}
      </p>

    </div>


    <!-- Photo Gallery & Screenshot Section -->

    <div style="margin-bottom:28px;">

      <h3
        style="
          font-size:1.15rem;
          margin-bottom:12px;
          color:var(--navy-dark);
          display:flex;
          align-items:center;
          gap:8px;
        "
      >

        <i data-lucide="image"></i>

        Galería de Fotos & Capturas del Proyecto

      </h3>


      <div
        id="gallery-container"
        class="project-gallery-carousel"
      >

        <div class="project-gallery-viewport">

          <div class="project-gallery-track">

            ${project.images
              .map(
                (img, index) => `

                <div
                  class="project-gallery-slide"
                  aria-hidden="${
                    index === 0
                      ? 'false'
                      : 'true'
                  }"
                >

                  <img
                    src="${img.url}"
                    alt="${img.caption}"
                  >

                </div>

              `
              )
              .join('')}

          </div>


          <button
            class="project-gallery-control project-gallery-prev"
            type="button"
            aria-label="Ver imagen anterior"
            ${
              project.images.length < 2
                ? 'disabled'
                : ''
            }
          >

            <i data-lucide="chevron-left"></i>

          </button>


          <button
            class="project-gallery-control project-gallery-next"
            type="button"
            aria-label="Ver imagen siguiente"
            ${
              project.images.length < 2
                ? 'disabled'
                : ''
            }
          >

            <i data-lucide="chevron-right"></i>

          </button>

        </div>


        <div
          class="project-gallery-caption"
        >
          ${
            project.images[0]?.caption ||
            ''
          }
        </div>

      </div>

    </div>


    <!-- Impact Metrics Grid -->

    <div
      style="
        display:grid;
        grid-template-columns:
          repeat(
            auto-fit,
            minmax(140px, 1fr)
          );
        gap:14px;
        margin-bottom:28px;
      "
    >

      <div
        style="
          background:var(--bg-card-subtle);
          padding:14px;
          border-radius:8px;
          text-align:center;
          border:1px solid var(--border-hairline);
        "
      >

        <span
          style="
            font-size:0.75rem;
            color:var(--text-muted);
            display:block;
          "
        >
          Ganancia de Eficiencia
        </span>


        <strong
          style="
            font-size:1.3rem;
            color:var(--blue-primary);
          "
        >
          ${project.impactMetrics.efficiency}
        </strong>

      </div>


      <div
        style="
          background:var(--bg-card-subtle);
          padding:14px;
          border-radius:8px;
          text-align:center;
          border:1px solid var(--border-hairline);
        "
      >

        <span
          style="
            font-size:0.75rem;
            color:var(--text-muted);
            display:block;
          "
        >
          Tiempo Ahorrado
        </span>


        <strong
          style="
            font-size:1.3rem;
            color:var(--navy-dark);
          "
        >
          ${project.impactMetrics.timeSaved}
        </strong>

      </div>


      <div
        style="
          background:var(--bg-card-subtle);
          padding:14px;
          border-radius:8px;
          text-align:center;
          border:1px solid var(--border-hairline);
        "
      >

        <span
          style="
            font-size:0.75rem;
            color:var(--text-muted);
            display:block;
          "
        >
          Precisión Operativa
        </span>


        <strong
          style="
            font-size:1.3rem;
            color:#10b981;
          "
        >
          ${project.impactMetrics.accuracy}
        </strong>

      </div>


      <div
        style="
          background:var(--bg-card-subtle);
          padding:14px;
          border-radius:8px;
          text-align:center;
          border:1px solid var(--border-hairline);
        "
      >

        <span
          style="
            font-size:0.75rem;
            color:var(--text-muted);
            display:block;
          "
        >
          Resultado Clave
        </span>


        <strong
          style="
            font-size:1.1rem;
            color:#d97706;
          "
        >
          ${project.impactMetrics.roi}
        </strong>

      </div>

    </div>


    <!-- Testimonial Quote -->

    <div
      style="
        background:var(--blue-light);
        border-left:4px solid var(--blue-primary);
        padding:18px;
        border-radius:8px;
        margin-bottom:28px;
      "
    >

      <p
        style="
          font-style:italic;
          font-size:0.95rem;
          color:var(--navy-dark);
          margin-bottom:8px;
        "
      >
        "${project.testimonialQuote}"
      </p>


      <strong
        style="
          font-size:0.9rem;
          color:var(--blue-primary);
          display:block;
        "
      >
        —
        ${project.testimonialName}
        (${project.testimonialRole})
      </strong>

    </div>


    <!-- Description -->

    <div style="margin-bottom:26px;">

      <h3
        style="
          font-size:1.15rem;
          margin-bottom:10px;
          color:var(--navy-dark);
        "
      >
        Descripción del Proyecto
      </h3>


      <p
        style="
          color:var(--text-muted);
          line-height:1.7;
        "
      >
        ${project.fullDescription}
      </p>

    </div>


    <!-- Features -->

    <div style="margin-bottom:26px;">

      <h3
        style="
          font-size:1.15rem;
          margin-bottom:10px;
          color:var(--navy-dark);
        "
      >
        Características Principales
      </h3>


      <ul
        style="
          list-style:none;
          display:flex;
          flex-direction:column;
          gap:8px;
        "
      >

        ${project.featuresList
          .map(
            feat => `

              <li
                style="
                  display:flex;
                  align-items:center;
                  gap:10px;
                  color:var(--text-primary);
                "
              >

                <i
                  data-lucide="check-circle"
                  style="
                    color:var(--blue-primary);
                    flex-shrink:0;
                  "
                ></i>

                ${feat}

              </li>

            `
          )
          .join('')}

      </ul>

    </div>


    <!-- Workflow Steps -->

    <div style="margin-bottom:26px;">

      <h3
        style="
          font-size:1.15rem;
          margin-bottom:10px;
          color:var(--navy-dark);
        "
      >
        Funcionamiento Paso a Paso
      </h3>


      <ul
        style="
          list-style:none;
          display:flex;
          flex-direction:column;
          gap:10px;
        "
      >

        ${project.workflowSteps
          .map(
            step => `

              <li
                style="
                  display:flex;
                  align-items:center;
                  gap:10px;
                  color:var(--text-primary);
                "
              >

                <i
                  data-lucide="arrow-right-circle"
                  style="
                    color:var(--blue-primary);
                    flex-shrink:0;
                  "
                ></i>

                ${step}

              </li>

            `
          )
          .join('')}

      </ul>

    </div>


    <!-- Before vs After -->

    <div
      style="
        background:var(--bg-card-subtle);
        border:1px solid var(--border-hairline);
        padding:18px;
        border-radius:10px;
        margin-bottom:26px;
      "
    >

      <h4
        style="
          color:var(--navy-dark);
          margin-bottom:8px;
        "
      >
        Antes vs Después
      </h4>


      <p
        style="
          color:#dc2626;
          font-size:0.88rem;
          margin-bottom:6px;
        "
      >
        <strong>Antes:</strong>
        ${project.beforeVsAfter.before}
      </p>


      <p
        style="
          color:#059669;
          font-size:0.88rem;
        "
      >
        <strong>
          Con ASYS Technology:
        </strong>

        ${project.beforeVsAfter.after}
      </p>

    </div>


    <!-- Quote Button -->

    <div
      style="
        display:flex;
        gap:12px;
        justify-content:flex-end;
      "
    >

      <a
        href="#contacto"
        class="btn btn-primary"
        id="btn-modal-quote"
      >

        <i data-lucide="mail"></i>

        Solicitar una Solución Similar

      </a>

    </div>

  `;


  /* ================================================
     MODAL ICONS
     ================================================ */

  try {

    createIcons({ icons });

  } catch (err) {

    console.warn(
      'Modal icons fallback:',
      err
    );
  }


  modal.classList.add('active');


  /* ================================================
     GALLERY
     ================================================ */

  const gallery =
    document.getElementById(
      'gallery-container'
    );


  const galleryTrack =
    gallery?.querySelector(
      '.project-gallery-track'
    );


  const galleryCaption =
    gallery?.querySelector(
      '.project-gallery-caption'
    );


  const gallerySlides =
    gallery
      ? Array.from(
          gallery.querySelectorAll(
            '.project-gallery-slide'
          )
        )
      : [];


  let currentSlide = 0;


  const showGallerySlide =
    (index) => {

      if (
        !galleryTrack ||
        gallerySlides.length < 2
      ) {
        return;
      }


      currentSlide =
        (index + gallerySlides.length) %
        gallerySlides.length;


      galleryTrack.style.transform =
        `translateX(-${currentSlide * 100}%)`;


      gallerySlides.forEach(
        (slide, slideIndex) => {

          slide.setAttribute(
            'aria-hidden',
            String(
              slideIndex !== currentSlide
            )
          );

        }
      );


      if (galleryCaption) {

        galleryCaption.textContent =
          project
            .images[currentSlide]
            .caption;

      }

    };


  gallery
    ?.querySelector(
      '.project-gallery-prev'
    )
    ?.addEventListener(
      'click',
      () => {

        showGallerySlide(
          currentSlide - 1
        );

      }
    );


  gallery
    ?.querySelector(
      '.project-gallery-next'
    )
    ?.addEventListener(
      'click',
      () => {

        showGallerySlide(
          currentSlide + 1
        );

      }
    );


  /* ================================================
     CLOSE MODAL
     ================================================ */

  const closeBtn =
    document.getElementById(
      'modal-close-btn'
    );


  closeBtn?.addEventListener(
    'click',
    () => {

      modal.classList.remove(
        'active'
      );

    }
  );


  /* ================================================
     QUOTE BUTTON
     ================================================ */

  const quoteBtn =
    document.getElementById(
      'btn-modal-quote'
    );


  quoteBtn?.addEventListener(
    'click',
    () => {

      modal.classList.remove(
        'active'
      );

    }
  );

}


/* =====================================================
   CLOSE MODAL ON BACKDROP CLICK
   ===================================================== */

document
  .getElementById('project-modal')
  ?.addEventListener(
    'click',
    (e) => {

      if (
        e.target.id ===
        'project-modal'
      ) {

        e.target.classList.remove(
          'active'
        );

      }

    }
  );


/* =====================================================
   NAVBAR
   Scroll + Mobile Menu + Active Links
   ===================================================== */

function setupNavbar() {

  const navbar =
    document.getElementById(
      'navbar'
    );


  const menuToggle =
    document.getElementById(
      'menu-toggle'
    );


  const navLinks =
    document.querySelector(
      '.nav-links'
    );


  const closeMobileMenu =
    () => {

      navLinks?.classList.remove(
        'open'
      );


      document.body.style.overflow =
        '';


      if (menuToggle) {

        menuToggle.setAttribute(
          'aria-label',
          'Abrir Menú'
        );


        menuToggle.innerHTML =
          '<i data-lucide="menu"></i>';


        try {

          createIcons({
            icons
          });

        } catch (err) {

          console.warn(
            'Mobile menu icon fallback:',
            err
          );

        }

      }

    };


  const openMobileMenu =
    () => {

      navLinks?.classList.add(
        'open'
      );


      document.body.style.overflow =
        'hidden';


      if (menuToggle) {

        menuToggle.setAttribute(
          'aria-label',
          'Cerrar Menú'
        );


        menuToggle.innerHTML =
          '<i data-lucide="x"></i>';


        try {

          createIcons({
            icons
          });

        } catch (err) {

          console.warn(
            'Mobile menu icon fallback:',
            err
          );

        }

      }

    };


  window.addEventListener(
    'scroll',
    () => {

      if (
        window.scrollY > 40
      ) {

        navbar?.classList.add(
          'scrolled'
        );

      } else {

        navbar?.classList.remove(
          'scrolled'
        );

      }

    }
  );


  const sectionLinks =
    Array.from(
      navLinks?.querySelectorAll(
        'a[href^="#"]'
      ) || []
    );


  const navigationSections =
    sectionLinks

      .map(
        link => ({

          link,

          section:
            document.querySelector(
              link.getAttribute(
                'href'
              )
            )

        })
      )

      .filter(
        ({ section }) =>
          section
      );


  const updateActiveLink =
    () => {

      const referencePoint =
        window.scrollY +
        (navbar?.offsetHeight || 0) +
        24;


      let activeSection =
        navigationSections[0];


      navigationSections.forEach(
        item => {

          if (
            item.section.offsetTop <=
            referencePoint
          ) {

            activeSection =
              item;

          }

        }
      );


      sectionLinks.forEach(
        link => {

          link.classList.toggle(
            'active',
            link ===
              activeSection?.link
          );

        }
      );

    };


  updateActiveLink();


  window.addEventListener(
    'scroll',
    updateActiveLink,
    {
      passive: true
    }
  );


  window.addEventListener(
    'resize',
    updateActiveLink
  );


  /* ================================================
     MOBILE MENU
     ================================================ */

  if (
    menuToggle &&
    navLinks
  ) {

    menuToggle.addEventListener(
      'click',
      () => {

        if (
          navLinks.classList.contains(
            'open'
          )
        ) {

          closeMobileMenu();

        } else {

          openMobileMenu();

        }

      }
    );


    navLinks
      .querySelectorAll('a')
      .forEach(
        link => {

          link.addEventListener(
            'click',
            () => {

              sectionLinks.forEach(
                navLink =>
                  navLink.classList.toggle(
                    'active',
                    navLink ===
                      link
                  )
              );


              closeMobileMenu();

            }
          );

        }
      );


    document.addEventListener(
      'keydown',
      (e) => {

        if (
          e.key === 'Escape' &&
          navLinks.classList.contains(
            'open'
          )
        ) {

          closeMobileMenu();

        }

      }
    );

  }

}


/* =====================================================
   CONTACT FORM
   ===================================================== */

function setupContactForm() {

  const form =
    document.getElementById(
      'main-contact-form'
    );


  const submitBtn =
    document.getElementById(
      'btn-submit-form'
    );


  const privacyConsent =
    document.getElementById(
      'privacy-consent'
    );


  if (!form) {
    return;
  }


  const formStatus = document.getElementById('contact-form-status');
  const requiredFields = Array.from(form.querySelectorAll('input[required], select[required], textarea[required]'));
  let isSubmitting = false;

  const validateField = field => {
    const hasValue = field.type === 'checkbox' ? field.checked : field.value.trim() !== '';
    const isValid = hasValue && field.validity.valid;
    field.classList.toggle('is-invalid', !isValid && (field.dataset.touched === 'true' || form.dataset.submitted === 'true'));
    field.classList.toggle('is-valid', isValid && field.type !== 'checkbox');
    return isValid;
  };


  const updateSubmitAvailability = () => {
    if (submitBtn) {
      submitBtn.disabled = isSubmitting || !privacyConsent?.checked || !requiredFields.every(validateField);
    }
  };

  requiredFields.forEach(field => {
    const update = () => { field.dataset.touched = 'true'; validateField(field); updateSubmitAvailability(); };
    field.addEventListener('blur', update);
    field.addEventListener('input', update);
    field.addEventListener('change', update);
  });


  privacyConsent?.addEventListener(
    'change',
    updateSubmitAvailability
  );


  updateSubmitAvailability();


  form.addEventListener(
    'submit',
    async (e) => {

      e.preventDefault();


      if (isSubmitting) return;
      form.dataset.submitted = 'true';
      if (!requiredFields.every(validateField)) {
        if (formStatus) {
          formStatus.textContent = 'Revisa los campos marcados para poder enviar tu solicitud.';
          formStatus.className = 'form-status error';
        }
        updateSubmitAvailability();
        return;
      }


      if (!privacyConsent?.checked) {
        if (formStatus) {
          formStatus.textContent = 'Debes autorizar el tratamiento de datos personales para enviar tu mensaje.';
          formStatus.className = 'form-status error';
        }
        showNotification({
          type: 'error',
          title: 'Autorización requerida',
          message: 'Debes autorizar el tratamiento de datos personales para enviar tu mensaje.'
        });
        return;
      }


      const name =
        document.getElementById(
          'form-name'
        )?.value;


      const email =
        document.getElementById(
          'form-email'
        )?.value;


      const phone =
        document.getElementById(
          'form-phone'
        )?.value;


      const service =
        document.getElementById(
          'form-service'
        )?.value;


      const message =
        document.getElementById(
          'form-message'
        )?.value;


      /* ==============================================
         DISABLE SUBMIT BUTTON
         ============================================== */

      if (submitBtn) {

        isSubmitting = true;

        submitBtn.disabled =
          true;


        submitBtn.innerHTML =
          '<i data-lucide="loader"></i> Enviando solicitud...';


        try {

          createIcons({
            icons
          });

        } catch (err) {

          console.warn(
            'Submit icon fallback:',
            err
          );

        }

      }


      try {

        await saveContactLead({
          name,
          email,
          phone,
          service,
          message,
          dataConsent: true
        });


        showNotification({

          type: 'success',

          title:
            '¡Solicitud registrada!',

          message:
            `Gracias ${name}. Tu mensaje ha sido guardado correctamente. El equipo de ASYS Technology te contactará en breve.`

        });


        form.reset();
        form.dataset.submitted = 'false';
        requiredFields.forEach(field => {
          field.dataset.touched = 'false';
          field.classList.remove('is-valid', 'is-invalid');
        });
        if (formStatus) {
          formStatus.textContent = '¡Solicitud recibida! Revisaremos tu información y te contactaremos pronto.';
          formStatus.className = 'form-status success';
        }


      } catch (err) {

        if (formStatus) {
          formStatus.textContent = err.message || 'No pudimos enviar tu solicitud. Inténtalo nuevamente.';
          formStatus.className = 'form-status error';
        }

        showNotification({

          type: 'error',

          title:
            'No se pudo enviar',

          message:
            err.message ||
            'Ocurrió un inconveniente guardando la información. Intenta nuevamente.'

        });


      } finally {

        if (submitBtn) {

          isSubmitting = false;

          updateSubmitAvailability();


          submitBtn.innerHTML =
            '<i data-lucide="send"></i> Registrar &amp; Enviar Mensaje';


          try {

            createIcons({
              icons
            });

          } catch (err) {

            console.warn(
              'Submit icon refresh fallback:',
              err
            );

          }

        }

      }

    }
  );

}


/* =====================================================
   GOOGLE ANALYTICS
   Se carga ÚNICAMENTE después del consentimiento
   ===================================================== */

function initGoogleAnalytics() {

  /* ================================================
     EVITAR CARGAR ANALYTICS DOS VECES
     ================================================ */

  if (
    window.__asysGoogleAnalyticsLoaded
  ) {

    return;

  }


  /* ================================================
     BUSCAR ID DE ANALYTICS
     ================================================ */

  const analyticsMeta =
    document.querySelector(
      'meta[name="google-analytics-id"]'
    );


  if (!analyticsMeta) {

    console.warn(
      'No se encontró el meta de Google Analytics.'
    );

    return;

  }


  const measurementId =
    analyticsMeta.getAttribute(
      'content'
    );


  /* ================================================
     SI NO HAY ID, NO CARGAR ANALYTICS
     ================================================ */

  if (
    !measurementId ||
    !measurementId.trim()
  ) {

    console.log(
      'Google Analytics no está configurado todavía.'
    );

    return;

  }


  /* ================================================
     CREAR SCRIPT DE GOOGLE ANALYTICS
     ================================================ */

  const script =
    document.createElement(
      'script'
    );


  script.async = true;


  script.src =
    `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;


  document.head.appendChild(
    script
  );


  /* ================================================
     CONFIGURAR DATA LAYER
     ================================================ */

  window.dataLayer =
    window.dataLayer || [];


  function gtag() {

    window.dataLayer.push(
      arguments
    );

  }


  window.gtag =
    gtag;


  /* ================================================
     INICIALIZAR GOOGLE ANALYTICS
     ================================================ */

  gtag(
    'js',
    new Date()
  );


  gtag(
    'config',
    measurementId
  );


  /* ================================================
     MARCAR COMO CARGADO
     ================================================ */

  window.__asysGoogleAnalyticsLoaded =
    true;


  console.log(
    'Google Analytics inicializado:',
    measurementId
  );

}
