$(document).ready(function() {
  'use strict';
  $('#faqs').find('h3').click(function(e) {
    $(e.target).toggleClass('active');
  });
});

function submitRegistration () {
  var name  = document.forms['ss-form']['entry.145219669'].value,
      email = document.forms['ss-form']['entry.2028281063'].value;
  
  $.post('http://wildhacks.org/server/confirm.php', {name: name, email: email});
  window.submitted = true;
}
