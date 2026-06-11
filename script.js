/* ЯFOR — модальное окно с видео о компании.
   Без зависимостей, чистый JavaScript. */
(function () {
  'use strict';

  var modal = document.getElementById('video-modal');
  if (!modal) return;

  var player = document.getElementById('video-modal-player');
  var triggers = document.querySelectorAll('.video-preview');
  var lastFocused = null;

  function openModal(src) {
    if (!src) return;
    lastFocused = document.activeElement;

    // Источник подставляем только при первом открытии (видео не качается заранее).
    if (player.getAttribute('src') !== src) {
      player.setAttribute('src', src);
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');

    var played = player.play();
    if (played && typeof played.catch === 'function') {
      played.catch(function () { /* автозапуск мог быть заблокирован — не страшно */ });
    }

    modal.querySelector('.video-modal-close').focus();
  }

  function closeModal() {
    if (!modal.classList.contains('is-open')) return;
    player.pause();
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  for (var i = 0; i < triggers.length; i++) {
    triggers[i].addEventListener('click', function () {
      openModal(this.getAttribute('data-video'));
    });
  }

  // Закрытие по крестику или клику вне видео (элементы с data-close).
  modal.addEventListener('click', function (e) {
    if (e.target.hasAttribute('data-close')) closeModal();
  });

  // Закрытие по Esc.
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.keyCode === 27) closeModal();
  });
})();
