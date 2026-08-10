import { createIcons, icons } from 'lucide';
import { initHero3DScene } from './src/threeScene.js';
import { projectsData } from './src/projectsData.js';
import { saveContactLead } from './src/apiClient.js';
import { showNotification } from './src/notification.js';

// Global object to store user uploaded photos per project in memory
const customProjectPhotos = {};

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  createIcons({ icons });

  // Initialize Three.js 3D Canvas
  try {
    initHero3DScene('canvas-hero-3d');
  } catch (err) {
    console.warn('WebGL setup fallback:', err);
  }

  // Render Projects Repository
  renderProjects('all');

  // Setup Project Filter Buttons
  setupProjectFilters();

  // Setup Workflow Simulator
  setupWorkflowSimulator();

  // Setup Navbar scroll & navigation active state
  setupNavbar();

  // Setup Contact Form Submit Handler
  setupContactForm();

  window.refreshIcons = () => createIcons({ icons });
});

// Render Projects Repository
function renderProjects(filterCategory = 'all') {
  const projectsGrid = document.getElementById('projects-grid');
  if (!projectsGrid) return;

  const filteredProjects = filterCategory === 'all'
    ? projectsData
    : projectsData.filter(p => p.category === filterCategory);

  projectsGrid.innerHTML = '';

  filteredProjects.forEach(project => {
    const card = document.createElement('div');
    card.className = 'clean-card project-card';
    card.dataset.id = project.id;

    const previewImg = project.images && project.images[0] ? project.images[0].url : '/assets/logo.jpg';

    card.innerHTML = `
      <div class="project-header-banner" style="background: ${project.imageBg}; position:relative; overflow:hidden;">
        <img src="${previewImg}" alt="${project.title}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; opacity:0.35; mix-blend-mode:luminosity;">
        <span class="project-cat-badge" style="position:relative; z-index:2;">${project.categoryLabel}</span>
        <h4 style="color:#fff; font-size:1.05rem; text-shadow:0 2px 8px rgba(0,0,0,0.6); position:relative; z-index:2;">${project.client}</h4>
      </div>
      <div class="project-body">
        <div>
          <h3 class="project-title">${project.title}</h3>
          <p class="project-summary">${project.shortDescription}</p>
        </div>

        <div class="project-metrics-grid">
          <div class="metric-item">
            <span>Eficiencia Impacto</span>
            <strong>${project.impactMetrics.efficiency}</strong>
          </div>
          <div class="metric-item">
            <span>Tiempo Ahorrado</span>
            <strong>${project.impactMetrics.timeSaved}</strong>
          </div>
        </div>

        <div class="tech-tags">
          ${project.technologies.slice(0, 3).map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>

        <div class="project-card-footer">
          <button class="btn btn-secondary btn-view-detail" style="width:100%; justify-content:center;" data-project-id="${project.id}">
            <i data-lucide="eye"></i> Ver Galería de Fotos & Detalles
          </button>
        </div>
      </div>
    `;

    // 3D Card Tilt Effect
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });

    projectsGrid.appendChild(card);
  });

  // Re-initialize icons inside dynamic HTML
  createIcons({ icons });

  // Add click listeners to detail buttons
  document.querySelectorAll('.btn-view-detail').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const projectId = e.currentTarget.getAttribute('data-project-id');
      openProjectModal(projectId);
    });
  });
}

// Setup Project Filter Buttons
function setupProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      renderProjects(filter);
    });
  });
}

// Open Project Detail Modal
function openProjectModal(projectId) {
  const project = projectsData.find(p => p.id === projectId);
  if (!project) return;

  const modal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body-content');

  // User uploaded photos array
  const userUploaded = customProjectPhotos[projectId] || [];

  modalBody.innerHTML = `
    <button class="modal-close-btn" id="modal-close-btn">&times;</button>
    
    <div style="margin-bottom:20px;">
      <span class="badge"><i data-lucide="folder-git-2"></i> ${project.categoryLabel}</span>
      <h2 style="font-size:1.8rem; font-weight:800; margin-top:8px; color:var(--navy-dark);">${project.title}</h2>
      <p style="color:var(--blue-primary); font-weight:700; font-size:1.05rem;">Cliente / Usuario Real: ${project.client}</p>
    </div>

    <!-- Photo Gallery & Screenshot Section -->
    <div style="margin-bottom:28px;">
      <h3 style="font-size:1.15rem; margin-bottom:12px; color:var(--navy-dark); display:flex; align-items:center; gap:8px;">
        <i data-lucide="image"></i> Galería de Fotos & Capturas del Proyecto
      </h3>

      <div id="gallery-container" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:16px; margin-bottom:16px;">
        ${project.images.map(img => `
          <div style="border-radius:10px; overflow:hidden; border:1px solid var(--border-hairline); background:#000;">
            <img src="${img.url}" alt="${img.caption}" style="width:100%; height:200px; object-fit:cover; display:block;">
            <div style="padding:10px 14px; background:var(--bg-card-subtle); font-size:0.8rem; color:var(--text-muted); font-weight:600;">
              ${img.caption}
            </div>
          </div>
        `).join('')}

        ${userUploaded.map((photoUrl, idx) => `
          <div style="border-radius:10px; overflow:hidden; border:2px solid var(--blue-primary); background:#000;">
            <img src="${photoUrl}" alt="Foto ${idx + 1}" style="width:100%; height:200px; object-fit:cover; display:block;">
            <div style="padding:10px 14px; background:var(--blue-light); font-size:0.8rem; color:var(--blue-primary); font-weight:700;">
              ✓ Foto subida por el usuario #${idx + 1}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Live Uploader Button for User -->
      <div style="padding:16px; background:var(--blue-light); border:1px dashed var(--blue-primary); border-radius:10px; text-align:center;">
        <p style="font-size:0.88rem; color:var(--navy-dark); font-weight:600; margin-bottom:8px;">
          <i data-lucide="upload-cloud"></i> Subir nuevas fotos o capturas a este proyecto:
        </p>
        <input type="file" id="upload-project-photo" accept="image/*" multiple style="display:none;">
        <button class="btn btn-secondary" onclick="document.getElementById('upload-project-photo').click()" style="padding:8px 18px; font-size:0.85rem;">
          <i data-lucide="plus-circle"></i> Seleccionar Imágenes desde tu Dispositivo
        </button>
      </div>
    </div>

    <!-- Impact Metrics Grid -->
    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap:14px; margin-bottom:28px;">
      <div style="background:var(--bg-card-subtle); padding:14px; border-radius:8px; text-align:center; border:1px solid var(--border-hairline);">
        <span style="font-size:0.75rem; color:var(--text-muted); display:block;">Ganancia de Eficiencia</span>
        <strong style="font-size:1.3rem; color:var(--blue-primary);">${project.impactMetrics.efficiency}</strong>
      </div>
      <div style="background:var(--bg-card-subtle); padding:14px; border-radius:8px; text-align:center; border:1px solid var(--border-hairline);">
        <span style="font-size:0.75rem; color:var(--text-muted); display:block;">Tiempo Ahorrado</span>
        <strong style="font-size:1.3rem; color:var(--navy-dark);">${project.impactMetrics.timeSaved}</strong>
      </div>
      <div style="background:var(--bg-card-subtle); padding:14px; border-radius:8px; text-align:center; border:1px solid var(--border-hairline);">
        <span style="font-size:0.75rem; color:var(--text-muted); display:block;">Precisión Operativa</span>
        <strong style="font-size:1.3rem; color:#10b981;">${project.impactMetrics.accuracy}</strong>
      </div>
      <div style="background:var(--bg-card-subtle); padding:14px; border-radius:8px; text-align:center; border:1px solid var(--border-hairline);">
        <span style="font-size:0.75rem; color:var(--text-muted); display:block;">Resultado Clave</span>
        <strong style="font-size:1.1rem; color:#d97706;">${project.impactMetrics.roi}</strong>
      </div>
    </div>

    <!-- Testimonial Quote inside Modal -->
    <div style="background:var(--blue-light); border-left:4px solid var(--blue-primary); padding:18px; border-radius:8px; margin-bottom:28px;">
      <p style="font-style:italic; font-size:0.95rem; color:var(--navy-dark); margin-bottom:8px;">
        "${project.testimonialQuote}"
      </p>
      <strong style="font-size:0.9rem; color:var(--blue-primary); display:block;">— ${project.testimonialName} (${project.testimonialRole})</strong>
    </div>

    <!-- Description -->
    <div style="margin-bottom:26px;">
      <h3 style="font-size:1.15rem; margin-bottom:10px; color:var(--navy-dark);">Descripción del Proyecto</h3>
      <p style="color:var(--text-muted); line-height:1.7;">${project.fullDescription}</p>
    </div>

    <!-- Features -->
    <div style="margin-bottom:26px;">
      <h3 style="font-size:1.15rem; margin-bottom:10px; color:var(--navy-dark);">Características Principales</h3>
      <ul style="list-style:none; display:flex; flex-direction:column; gap:8px;">
        ${project.featuresList.map(feat => `<li style="display:flex; align-items:center; gap:10px; color:var(--text-primary);"><i data-lucide="check-circle" style="color:var(--blue-primary); flex-shrink:0;"></i> ${feat}</li>`).join('')}
      </ul>
    </div>

    <!-- Workflow Steps -->
    <div style="margin-bottom:26px;">
      <h3 style="font-size:1.15rem; margin-bottom:10px; color:var(--navy-dark);">Funcionamiento Paso a Paso</h3>
      <ul style="list-style:none; display:flex; flex-direction:column; gap:10px;">
        ${project.workflowSteps.map(step => `<li style="display:flex; align-items:center; gap:10px; color:var(--text-primary);"><i data-lucide="arrow-right-circle" style="color:var(--blue-primary); flex-shrink:0;"></i> ${step}</li>`).join('')}
      </ul>
    </div>

    <!-- Before vs After -->
    <div style="background:var(--bg-card-subtle); border:1px solid var(--border-hairline); padding:18px; border-radius:10px; margin-bottom:26px;">
      <h4 style="color:var(--navy-dark); margin-bottom:8px;">Antes vs Después</h4>
      <p style="color:#dc2626; font-size:0.88rem; margin-bottom:6px;"><strong>Antes:</strong> ${project.beforeVsAfter.before}</p>
      <p style="color:#059669; font-size:0.88rem;"><strong>Con ASYS Technology S.A.S.:</strong> ${project.beforeVsAfter.after}</p>
    </div>

    <div style="display:flex; gap:12px; justify-content:flex-end;">
      <a href="#contacto" class="btn btn-primary" id="btn-modal-quote">
        <i data-lucide="mail"></i> Solicitar una Solución Similar
      </a>
    </div>
  `;

  createIcons({ icons });
  modal.classList.add('active');

  // Handle Photo Upload input
  const photoInput = document.getElementById('upload-project-photo');
  if (photoInput) {
    photoInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      if (!files || files.length === 0) return;

      if (!customProjectPhotos[projectId]) {
        customProjectPhotos[projectId] = [];
      }

      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          customProjectPhotos[projectId].push(event.target.result);
          openProjectModal(projectId);
        };
        reader.readAsDataURL(file);
      });
    });
  }

  const closeBtn = document.getElementById('modal-close-btn');
  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  const quoteBtn = document.getElementById('btn-modal-quote');
  quoteBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });
}

// Close Modal on backdrop click
document.getElementById('project-modal')?.addEventListener('click', (e) => {
  if (e.target.id === 'project-modal') {
    e.target.classList.remove('active');
  }
});

// Setup Workflow Simulator
function setupWorkflowSimulator() {
  const btnRun = document.getElementById('btn-run-simulation');
  const steps = [
    document.getElementById('step-1'),
    document.getElementById('step-2'),
    document.getElementById('step-3'),
    document.getElementById('step-4')
  ];

  if (!btnRun || !steps[0]) return;

  btnRun.addEventListener('click', () => {
    btnRun.disabled = true;
    btnRun.innerHTML = '<i data-lucide="loader"></i> Ejecutando Simulación...';
    createIcons({ icons });

    steps.forEach(s => s?.classList.remove('active-step'));

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep > 0) {
        steps[currentStep - 1]?.classList.remove('active-step');
      }
      if (currentStep < steps.length) {
        steps[currentStep]?.classList.add('active-step');
        currentStep++;
      } else {
        clearInterval(interval);
        steps[steps.length - 1]?.classList.add('active-step');
        btnRun.disabled = false;
        btnRun.innerHTML = '<i data-lucide="play-circle"></i> Ejecutar Nuevamente';
        createIcons({ icons });
      }
    }, 1200);
  });
}

// Setup Navbar scroll, mobile menu & link active highlighting
function setupNavbar() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  const closeMobileMenu = () => {
    navLinks?.classList.remove('open');
    document.body.style.overflow = '';
    if (menuToggle) {
      menuToggle.setAttribute('aria-label', 'Abrir Menú');
      menuToggle.innerHTML = '<i data-lucide="menu"></i>';
      createIcons({ icons });
    }
  };

  const openMobileMenu = () => {
    navLinks?.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (menuToggle) {
      menuToggle.setAttribute('aria-label', 'Cerrar Menú');
      menuToggle.innerHTML = '<i data-lucide="x"></i>';
      createIcons({ icons });
    }
  };

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }
}

// Setup Contact Form Submit Handler
function setupContactForm() {
  const form = document.getElementById('main-contact-form');
  const submitBtn = document.getElementById('btn-submit-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name')?.value;
    const email = document.getElementById('form-email')?.value;
    const phone = document.getElementById('form-phone')?.value;
    const service = document.getElementById('form-service')?.value;
    const message = document.getElementById('form-message')?.value;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i data-lucide="loader"></i> Enviando solicitud...';
      createIcons({ icons });
    }

    try {
      await saveContactLead({ name, email, phone, service, message });
      showNotification({
        type: 'success',
        title: '¡Solicitud registrada!',
        message: `Gracias ${name}. Tu mensaje ha sido guardado correctamente. El equipo de ASYS Technology S.A.S. te contactará en breve.`
      });
      form.reset();
    } catch (err) {
      showNotification({
        type: 'error',
        title: 'No se pudo enviar',
        message: err.message || 'Ocurrió un inconveniente guardando la información. Intenta nuevamente.'
      });
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i data-lucide="send"></i> Registrar &amp; Enviar Mensaje';
        createIcons({ icons });
      }
    }
  });
}
