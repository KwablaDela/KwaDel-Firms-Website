(function(){
  try{
    var t = localStorage.getItem('jg-theme');
    if(!t && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches){
      t = 'light';
    }
    if(t === 'light'){
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }catch(e){}
})();
