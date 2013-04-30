// Adapted from : https://github.com/es92/CrossPlatformTodoApp/blob/master/static/libs/jq/addTappableJQPlugin.js

function addTappableJQPlugin() {
  $.fn.onButtonTap = function(tapCB, longCB) {
    var down = function () {
      this.addClass('buttonDown');
    };
    var up = function () {
      this.removeClass('buttonDown');
    };
    this.ontap(down, up, tapCB, longCB);
  }

  $.fn.ontap = function(downCB, upCB, tapCB, longCB) {
    new TapManager(this, downCB, upCB, tapCB, longCB)
  }

  function TapManager(dom, onDown, onUp, onTap, onLong) {
    this.dom = dom;
    this.onDown = onDown || function() { };
    this.onUp = onUp || function() { };
    this.onTap = onTap || function() { };
    this.onLong = onLong || function() { };
    this.bindFnsToDom();

    this.state = {
      startX: 0,
      startY: 0,
      potentialTap: false,
    };

    this.registerEvents();
  }

  TapManager.prototype = {
  //========================
  //  STATE
  //========================
  down: function(x, y, event) {
    this.state.startX = x;
    this.state.startY = y;
    this.state.potentialTap = true;
    this.onDown(event)
    setTimeout(this.checkLong.bind(this), 500);
  },
  move: function(x, y, event) {
    if (this.state.potentialTap && this.movedTooMuch(x, y)) {
      this.state.potentialTap = false;
      this.onUp(event);
    }
  },
  movedTooMuch: function(x, y) {
    return (window.Math.abs(x - this.state.startX) > 10 || 
           window.Math.abs(y - this.state.startY) > 10);
  },
  up: function(event) {
    if (this.state.potentialTap) {
      this.onUp(event);
      this.onTap(event);
      this.state.potentialTap = false;
    }
  },
  exit: function(event) {
    if (this.state.potentialTap) {
      this.state.potentialTap = false;
      this.onUp(event);
    }
  },
  checkLong: function(event) {
    if (this.state.potentialTap) {
      this.state.potentialTap = false;
      this.onLong(event);
      this.onUp(event);
    }
  },

  //========================
  //  INIT
  //========================

  // Default jq behavior
  bindFnsToDom: function() {
    this.onDown = this.onDown.bind(this.dom);
    this.onUp = this.onUp.bind(this.dom);
    this.onTap = this.onTap.bind(this.dom);
    this.onLong = this.onLong.bind(this.dom);
  },
  registerEvents: function() {
    if ('ontouchstart' in document.documentElement) {
      this.registerTouchEvents();
    } else {
      this.registerMouseEvents();
    },
    registerTouchEvents: function() {
      this.dom.on('touchstart', function(event) {
        var x = event.originalEvent.touches[0].clientX;
        var y = event.originalEvent.touches[0].clientY;
        this.down(x, y, event);
      }.bind(this));
      this.dom.on('touchend', function(event) {
        this.up(event);
      }.bind(this));
      this.dom.on('touchleave', function(event) {
        this.exit(event);
      }.bind(this));
      this.dom.on('touchmove', function(event) {
        var x = event.originalEvent.touches[0].clientX;
        var y = event.originalEvent.touches[0].clientY;
        this.move(x, y, event);
      }.bind(this));
    },
    registerMouseEvents: function() {
      this.dom.on('mousedown', function(event) {
        this.down(event.clientX, event.clientY, event);
      }.bind(this));
      this.dom.on('mouseout', function(event) {
        this.exit(event);
      }.bind(this));
      this.dom.on('mouseup', function(event) {
        this.up(event);
      }.bind(this));
    }
  }
}


window.addEventListener('load', function() {
    addTappableJQPlugin();
});

