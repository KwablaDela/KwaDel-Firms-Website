// Jerome Gabada — Booking form
// Replace FORMSPREE_ENDPOINT below with your own Formspree form URL
// (see the "form action" attribute in booking.html — this constant must
// match it exactly, since the fetch() call below uses this one directly).

document.addEventListener('DOMContentLoaded', function(){
  var form = document.getElementById('bookingForm');
  if(!form) return;

  var FORMSPREE_ENDPOINT = form.getAttribute('action');

  var statusBox = document.getElementById('formStatus');
  var serviceSelect = document.getElementById('service');
  var subjectField = document.getElementById('formSubject');
  var submitBtn = form.querySelector('.form-submit');

  // pre-select service from a link like booking.html?service=branding
  var presets = {
    'branding': 'Branding & Graphic Design',
    'photography': 'Photography',
    'videography': 'Videography',
    'voiceover': 'Voice Over',
    'drone-mapping': 'Drone / Aerial Capture & Mapping',
    'farm-consulting': 'Farm Operations Consulting',
    'research-consulting': 'Research & Economics Consulting'
  };
  var params = new URLSearchParams(window.location.search);
  var presetKey = params.get('service');
  if(presetKey && presets[presetKey]){
    Array.prototype.forEach.call(serviceSelect.options, function(opt){
      if(opt.value === presets[presetKey]) opt.selected = true;
    });
  }

  function showStatus(kind, message){
    statusBox.textContent = message;
    statusBox.className = 'form-status show ' + kind;
    statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();

    if(FORMSPREE_ENDPOINT.indexOf('REPLACE_WITH_YOUR_FORM_ID') !== -1){
      showStatus('err', 'Booking form isn\u2019t connected yet \u2014 the site owner needs to add their Formspree form ID. See SECURITY.md / setup instructions.');
      return;
    }

    var service = serviceSelect.value || 'General enquiry';
    subjectField.value = 'New booking request \u2014 ' + service;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending\u2026';

    fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    }).then(function(response){
      if(response.ok){
        form.reset();
        showStatus('ok', 'Thanks \u2014 your booking request is in. I\u2019ll get back to you by email within 24\u201348 hours.');
      } else {
        return response.json().then(function(data){
          var msg = (data && data.errors && data.errors.length) ? data.errors.map(function(x){ return x.message; }).join(', ') : 'Something went wrong sending that.';
          showStatus('err', msg + ' Feel free to email me directly instead.');
        });
      }
    }).catch(function(){
      showStatus('err', 'Couldn\u2019t send that \u2014 check your connection and try again, or email me directly.');
    }).finally(function(){
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Booking Request';
    });
  });
});
