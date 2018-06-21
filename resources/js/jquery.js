var exampleChartHidden = true;
var matchChartHidden = true;

$(document).ready(function() {
    
    /* Sticky Nav */
    $('.section-basics').waypoint(function(direction) {
        if(direction == "down") {
            $('nav').addClass('sticky');
        } else {
            $('nav').removeClass('sticky');
        }
    }, {
        offset: '60px;'
    });
    $('.js--nav-icon').click(function() {
        var nav = $('.js--main-nav');
        var icons = $('.js--nav-icon i');
        
        nav.slideToggle(200);
        icons.toggle('hidden');
    });
        
    /* Scroll on button click */
    $('.js--scroll-to-basics').click(function() {
        $('html, body').animate({scrollTop: $('.js--section-basics').offset().top}, 1000)
    });
    $('.js--scroll-to-examples').click(function() {
        $('html, body').animate({scrollTop: $('.js--section-examples').offset().top}, 1000)
    });
    
    /* Navigate Scroll */
    $(function() {
      $('a[href*=\\#]:not([href=\\#])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
          if (target.length) {
            $('html,body').animate({
              scrollTop: target.offset().top
            }, 1000);
            return false;
          }
        }
      });
    });
    
    /* Animate Data */
    $('.js--wayPoint').waypoint(function(direction) {
        $('.js--wayPoint').addClass('animated fadeIn');
    }, {
        offset: '60%'
    });
    
    /* Animate Charts */
    $('#examplesChart').waypoint(function(direction) {
        if(exampleChartHidden) {
            controller.createExampleChart();
            exampleChartHidden = false;
        }
    }, {
        offset: '60%'
    });    
    $('#matchChart').waypoint(function(direction) {
        if(matchChartHidden) {
            controller.createCompanyMatchChart();
            matchChartHidden = false;
        }
    }, {
        offset: '60%'
    });
});