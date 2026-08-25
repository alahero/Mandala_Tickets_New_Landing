
    let ubicacionPrincipal = window.pageYOffset;

    window.onscroll = function(){
      let Desplazamiento = window.pageYOffset;

      if(ubicacionPrincipal >= Desplazamiento){
        this.document.getElementById('header').style.top = '0';
      }
      else if(ubicacionPrincipal >= 537){
        this.document.getElementById('header').style.top = '0';
        $('.search-module-container').css("position", "fixed");
        $('.search-module-container').css("z-index", "9090");
        $('.search-module-container').css("margin-top", "35px");
      }
      else if(Desplazamiento <= 572){
        $('.search-module-container').css("position", "sticky");
        $('.search-module-container').css("z-index", "40");
        $('.search-module-container').css("margin-top", "-150px");
      }
      else{
        this.document.getElementById('header').style.top = '0';
         $('.search-module-container').css("position", "sticky");
         $('.search-module-container').css("z-index", "40");
         $('.search-module-container').css("margin-top", "-150px");
      }
      ubicacionPrincipal = Desplazamiento;

      if(ubicacionPrincipal <= 572){
        $('.search-module-container').css("position", "sticky");
        $('.search-module-container').css("z-index", "40");
        $('.search-module-container').css("margin-top", "-150px");
      }
    }