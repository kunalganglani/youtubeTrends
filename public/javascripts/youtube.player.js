const id = window.location.href
  .replace(/^.*\//g, '')
  .replace(/^.*\..*/g, '');

var container = document.getElementsByClassName('video-container')[0];
setTimeout(function() {
  container.innerHTML = '<iframe width="100%" height="100%" ' +
    'src="https://www.youtube.com/embed/'+id+'?autoplay=1"' +
    ' frameborder="0" allowfullscreen></iframe>';
}, 300);
