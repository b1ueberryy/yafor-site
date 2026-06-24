/* ЯFOR — главная страница.
   1) Анимация счётчиков «Компания в цифрах» при прокрутке.
   2) Форма запроса коммерческого предложения (отправка через почтовый клиент).
   Без зависимостей, чистый JavaScript. */
(function () {
  'use strict';

  /* ---- 1. Счётчики ---- */
  var counters = document.querySelectorAll('.stat-number');

  function animate(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1600;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      // плавное замедление
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('ru-RU') + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('ru-RU') + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  if (counters.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      for (var i = 0; i < counters.length; i++) io.observe(counters[i]);
    } else {
      // запасной вариант — просто показать итоговые значения
      for (var j = 0; j < counters.length; j++) {
        var c = counters[j];
        c.textContent = (parseInt(c.getAttribute('data-count'), 10) || 0).toLocaleString('ru-RU') + (c.getAttribute('data-suffix') || '');
      }
    }
  }

  /* ---- 2. Форма запроса КП (mailto) ---- */
  var form = document.getElementById('request-form');
  if (form) {
    var note = document.getElementById('request-note');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      var name = (f.name.value || '').trim();
      var phone = (f.phone.value || '').trim();
      if (!name || !phone) {
        if (note) note.textContent = 'Пожалуйста, укажите имя и телефон.';
        return;
      }
      var lines = [
        'Имя: ' + name,
        'Телефон: ' + phone,
        'Компания: ' + (f.company.value || '').trim(),
        'E-mail: ' + (f.email.value || '').trim(),
        '',
        'Запрос: ' + (f.message.value || '').trim()
      ];
      var subject = 'Запрос коммерческого предложения с сайта';
      var href = 'mailto:info@yaforys.ru?subject=' + encodeURIComponent(subject) +
                 '&body=' + encodeURIComponent(lines.join('\n'));
      window.location.href = href;
      if (note) note.textContent = 'Открываем почтовую программу для отправки заявки…';
      form.reset();
    });
  }
})();
