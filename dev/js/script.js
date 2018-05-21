Vue.component('sitebar', 
{
    template: '<div id="sitebar"><slot></slot></div>'
})

Vue.component('tile-container', 
{
    template: '<div class="tile-container"><slot></slot></div>'
})

Vue.component('tile', 
{
    template: '<div class="tile"></div>'
})


var app = new Vue
({
    el: "#app",
    data: 
    {
        message: "hello"
    }
})