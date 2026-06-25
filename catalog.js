/* ЯFOR — карточки товаров: модалка «Подробнее».
   Данные берутся из window.PRODUCT_DATA (задаётся на каждой странице). */
(function () {
  'use strict';
  var DATA = window.PRODUCT_DATA || {};
  var modal = document.getElementById('pm-modal');
  if (!modal) return;
  var elImg = document.getElementById('pm-img');
  var elTitle = document.getElementById('pm-title');
  var elDesc = document.getElementById('pm-desc');
  var elSpecs = document.getElementById('pm-specs');
  var last = null;

  function open(id) {
    var d = DATA[id];
    if (!d) return;
    last = document.activeElement;
    elImg.setAttribute('src', d.img);
    elImg.setAttribute('alt', d.title);
    elTitle.textContent = d.title;
    elDesc.textContent = d.desc;
    elSpecs.innerHTML = '';
    (d.specs || []).forEach(function (s) {
      var li = document.createElement('li');
      li.textContent = s;
      elSpecs.appendChild(li);
    });
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    modal.querySelector('.pm-close').focus();
  }
  function close() {
    if (!modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    if (last && last.focus) last.focus();
  }
  var t = document.querySelectorAll('.product-more');
  for (var i = 0; i < t.length; i++) {
    t[i].addEventListener('click', function (e) {
      e.preventDefault();
      open(this.getAttribute('data-id'));
    });
  }
  modal.addEventListener('click', function (e) {
    if (e.target.hasAttribute('data-close')) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.keyCode === 27) close();
  });
})();
