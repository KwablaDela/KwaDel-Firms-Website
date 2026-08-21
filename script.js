// Jerome Gabada — Portfolio shared behaviour

function imgFallback(img){
  img.style.display = 'none';
  var ph = img.nextElementSibling;
  if(ph) ph.style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', function(){

  // theme toggle
  var themeToggle = document.getElementById('themeToggle');
  function currentTheme(){
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }
  function paintToggle(){
    if(!themeToggle) return;
    var light = currentTheme() === 'light';
    themeToggle.textContent = light ? '☾' : '☀';
    themeToggle.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
    themeToggle.setAttribute('aria-pressed', light ? 'true' : 'false');
  }
  if(themeToggle){
    paintToggle();
    themeToggle.addEventListener('click', function(){
      var next = currentTheme() === 'light' ? 'dark' : 'light';
      if(next === 'light'){ document.documentElement.setAttribute('data-theme', 'light'); }
      else{ document.documentElement.removeAttribute('data-theme'); }
      try{ localStorage.setItem('jg-theme', next); }catch(e){}
      paintToggle();
    });
  }

  // mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if(toggle && links){
    toggle.addEventListener('click', function(){
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ links.classList.remove('is-open'); });
    });
  }

  // decode contact details at render time (lightweight scraper deterrent —
  // not stored as plain text/mailto/tel in the HTML source)
  function decode(b64){
    try{ return atob(b64); }catch(e){ return ''; }
  }
  var contactLine = document.querySelector('.contact-line');
  if(contactLine){
    var email = decode(contactLine.getAttribute('data-e'));
    var phoneDisplay = decode(contactLine.getAttribute('data-p'));
    if(email && phoneDisplay){ contactLine.textContent = phoneDisplay + ' · ' + email; }
  }
  document.querySelectorAll('.contact-link').forEach(function(link){
    var kind = link.getAttribute('data-kind');
    if(kind === 'email'){
      var email = decode(link.getAttribute('data-e'));
      if(email) link.setAttribute('href', 'mailto:' + email);
    } else if(kind === 'tel'){
      var phone = decode(link.getAttribute('data-p'));
      if(phone) link.setAttribute('href', 'tel:' + phone);
    }
  });

  // wire up image fallbacks (replaces inline onerror= for a stricter CSP)
  document.querySelectorAll('.img-slot img').forEach(function(img){
    img.addEventListener('error', function(){ imgFallback(img); });
    // also catch images that already failed before this listener attached (cached 404s)
    if(img.complete && img.naturalWidth === 0){ imgFallback(img); }
  });

  // reveal-on-scroll
  var reveals = document.querySelectorAll('.reveal, .entry');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function(el){ io.observe(el); });
  } else {
    reveals.forEach(function(el){ el.classList.add('in'); });
  }

  // role-cycle hero text (home page only)
  var cycle = document.querySelector('[data-role-cycle]');
  if(cycle){
    var roles = [
      { label: 'economist', color: 'var(--c-edu)' },
      { label: 'brand & content creator', color: 'var(--c-brand)' },
      { label: 'farm operations manager', color: 'var(--c-agri)' },
      { label: 'UAV pilot & data analyst', color: 'var(--c-drone)' }
    ];
    var i = 0;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function setRole(idx){
      cycle.style.opacity = 0;
      setTimeout(function(){
        cycle.textContent = roles[idx].label;
        cycle.style.color = roles[idx].color;
        cycle.style.opacity = 1;
      }, reduce ? 0 : 260);
    }
    setRole(0);
    if(!reduce){
      setInterval(function(){
        i = (i + 1) % roles.length;
        setRole(i);
      }, 2600);
    }
  }
});
