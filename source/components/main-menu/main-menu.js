/********************************
Controller for the main menu page
*********************************/

/*
The next passage rearranges the sections of the menu to make slides. slideify is
defined in arrayToSlides.js
*/
display.menu.main.sections = slideify(display.menu.main.sections)

/*
Function to determine the type of menu : single-slide, two-slide of more than two slides.
*/
if (display.menu.main.sections.length == 1) {
    var type = "single";
} else if (display.menu.main.sections.length == 2) {
    var type = "double";
} else {
    var type = "multiple";
}
console.log(type);

/*
Pure.js directive to rendre the graphic elements linked to thte menu sections
*/
display.menu.main.pathPrefix = display.menu.pathPrefix;
var mainDisplayDirective = {
    '#background@style': function(a) {
        return "background-image: url(" + this.menu.main.pathPrefix + this.menu.main.background + ");"
    },
    '.slidemenu': {
        'slide<-menu.main.sections': {
            '.imgzoneimg@class+': function(a) {
                if (type == "single") {
                    return " isolated_zone";
                } else if (type == "double") {
                    if (a.pos == 0) {
                        return " left_zone";
                    } else {
                        return " right_zone"
                    }
                } else {
                    if (a.pos == 0) {
                        return " left_zone";
                    } else if (a.pos < a.items.length - 1) {
                        return " center_zone";
                    } else {
                        return " right_zone"
                    }
                }
            },
            '.main-menu-section': {
                'section<-slide': {
                    '.main-menu-section-poster@src': '#{menu.main.pathPrefix}/#{section.poster}',
                    '.main-menu-section-play@src': '#{menu.main.pathPrefix}/#{common.play}',
                    '.main-menu-section-title': 'section.title',
                    '.main-menu-section-link@href': function(a) {
                        if (this.type == "projection") {
                            return "../projection/projection.html?prev=main&id=" + this.id;
                        } else if (this.type == "menu") {
                            return "../menu/menu.html?prev=main&id=" + this.id;
                        } else {
                            return "../main-menu/main-menu.html";
                        }
                    },
                    '.@class+' : function(a) {
                        if (a.item.empty == true) {
                            emptySections = true;
                            return " empty-section-container";
                        }
                        else
                            return "";
                    }
                }
            }
        }
    }
}
var emptySections = false;
$('body').render(display, mainDisplayDirective); //render the result

/*
PureJS directive to display graphical elements on the page that don't
depend on the menu elements
*/
var displayDirective = {
    '#droite@src': '#{menu.pathPrefix}/#{common.droite.main}',
    '#droite_hover@src': '#{menu.pathPrefix}/#{common.droite.hover}',
    '#gauche@src': '#{menu.pathPrefix}/#{common.gauche.main}',
    '#gauche_hover@src': '#{menu.pathPrefix}/#{common.gauche.hover}',
    '.main-menu-section-play@src': '#{menu.pathPrefix}/#{common.play}',
    '#titre@src': '#{menu.main.pathPrefix}/#{menu.main.title}',
    '#back-to-intro@src': '#{menu.main.pathPrefix}/#{menu.main.backToIntro.main}',
    '#back-to-intro-hover@src': '#{menu.main.pathPrefix}/#{menu.main.backToIntro.hover}'
};
//Depending on the number of slides, we do not display the same background
if (type == "single") {
    displayDirective['.isolated_zone@src'] = '#{menu.pathPrefix}/#{common.zone.isolated}';
} else if (type == "double") {
    displayDirective['.left_zone@src'] = '#{menu.pathPrefix}/#{common.zone.left}';
    displayDirective['.right_zone@src'] = '#{menu.pathPrefix}/#{common.zone.right}';
} else {
    displayDirective['.center_zone@src'] = '#{menu.pathPrefix}/#{common.zone.center}';
    displayDirective['.left_zone@src'] = '#{menu.pathPrefix}/#{common.zone.left}';
    displayDirective['.right_zone@src'] = '#{menu.pathPrefix}/#{common.zone.right}';
}
//If some video containers are empty, delete the html nodes inside them
if (emptySections) {
    displayDirective['.empty-section-container'] = "";
}
$('body').render(display, displayDirective);

//Navigation functions
var goToIntro = function() {
    window.location.href = "../intro/intro.html";
}

//FadeIn to mask the loading of the page elements
$(document).ready(function() {
    $('.slideshow').fadeIn(1000);
});

if (type=="single") {
    /*
    If there is only one slide, the clycle plugin must not bed activated;
    instead we have to delete the html components of the plugin.
    */
    var singleSlideDirective = {
        '#next' : '',
        '#prev' : '',
        '.slidemenu@style' : "position: absolute; top: 0px; left: 0px; display: block; z-index: 3;"
    };
    $('body').render(display,singleSlideDirective);
} else {
    /*
    Slideshow controller : uses the slideshow plugin to animate the slides
    */
    $(document).ready(function() {
        $('.slideshowmenu').cycle({

            slideResize: false,
            containerResize: false,
            after: onAfter,
            before: onBefore,
            next: '#next',
            prev: '#prev',
            fx: 'scrollHorz',
            speed: 500,
            timeout: 0,
            startingSlide: 0
        });
    });
    function onBefore(curr, next, opts) {
        $('#prev')['hide']();
        $('#next')['hide']();
    }
    var appearTime = 250;
    function onAfter(curr, next, opts) {
        currentMenu = opts.currSlide;
        $('#prev')[currentMenu == 0 ? 'hide' : 'show'](appearTime);
        $('#next')[currentMenu == opts.slideCount - 1 ? 'hide' : 'show'](appearTime);
        $('#introduction')['show'](appearTime);
        for (i = 0; i <= 5; i++) {
            var nom = "#goto" + i;
            $(nom)['show'](appearTime);
        }
    }
}
