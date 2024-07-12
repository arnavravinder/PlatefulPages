document.addEventListener('DOMContentLoaded', () => {
  AOS.init();

  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const joinUsBtn = document.getElementById('join-us-btn');
  const popup = document.getElementById('popup');
  const closeBtn = document.querySelector('.close');
  
  function toggleDarkMode() {
      document.body.classList.toggle('dark-mode');
      if (document.body.classList.contains('dark-mode')) {
          darkModeToggle.textContent = '🌙';
      } else {
          darkModeToggle.textContent = '🌞';
      }
  }

  darkModeToggle.addEventListener('click', toggleDarkMode);
  joinUsBtn.addEventListener('click', () => {
      popup.style.display = 'flex';
  });

  closeBtn.addEventListener('click', () => {
      popup.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
      if (e.target == popup) {
          popup.style.display = 'none';
      }
  });
});
