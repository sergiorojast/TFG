window.addEventListener('load',function(){
    //variable con la que controlaremos si la barra lateral esta colapsada o no.
    var estadoBarraLateral =true;
      
   

    $('#btnComprimir').click(function(){

      if(estadoBarraLateral){
        $('#barraLateral').animate({
            width : '5%'
        },300)
        $('#iconoComprimir').attr('class','fa fa-chevron-right');

        $('svg[data-toggle="tooltip"]').tooltip();
      
        estadoBarraLateral = !estadoBarraLateral;

      }else{
        $('#barraLateral').animate({
            width : '10%'
        },300)
        $('#iconoComprimir').attr('class','fa fa-chevron-left')
        estadoBarraLateral = !estadoBarraLateral;
        $('svg[data-toggle="tooltip"]').tooltip('dispose');
      }
      $("small[id='textoBarraLateral']").toggle('fast');
    })

   
})
  