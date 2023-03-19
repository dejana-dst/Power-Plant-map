$(document).ready(function(){
  $('select').select2({
    theme: "bootstrap",
    width: '100%',
  });

  
 
    $('.select--countries').select2({
      theme: "bootstrap",
      width: '100%',
      placeholder:"Countries"
    });
 
    $('.select--status').select2({
      theme: "bootstrap",
      width: '100%',
      placeholder:"Plant status"
    });
 
    $('.select--reactors').select2({
      theme: "bootstrap",
      width: '100%',
      placeholder:"Reactor type"
    });
 

  






  });

 