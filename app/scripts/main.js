$(document).ready(function() {
  'use strict';
  $('#faqs').find('h3').click(function() {
    $(this).toggleClass('active');
  });
});