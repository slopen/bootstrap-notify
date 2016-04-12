/**
 * bootstrap-notify.js v1.0
 * --
  * Copyright 2012 Goodybag, Inc.
 * --
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function ($) {
  var Notification = function (element, options) {
    // Element collection
    this.$element = $(element);
    this.$note    = $('<div class="alert"><div></div></div>');
    this.options  = $.extend(true, {}, $.fn.notify.defaults, options);

    // Setup from options
    this.$note.addClass(this.options.transition);

    if(this.options.type)
      this.$note.addClass('alert-' + this.options.type);
    else
      this.$note.addClass('alert-success');

    if(!this.options.message && this.$element.data("message") !== '') // dom text
      this.$note.html(this.$element.data("message"));
    else
      if(typeof this.options.message === 'object') {
        if(this.options.message.html)
          this.$note.html(this.options.message.html);
        else if(this.options.message.text)
          this.$note.text(this.options.message.text);
      } else
        this.$note.html(this.options.message);

    if(this.options.closable) {
      var link = $('<a class="close pull-right" href="#">&times;</a>');
      $(link).on('click', $.proxy(this.hide, this));
      this.$note.prepend(link);
    }

    return this;
  };

  var onClose = function() {
    this.options.onClose();
    $(this.$note).remove();
    this.options.onClosed();
    return false;
  };

  Notification.prototype.show = function () {
    this.$note.on('transitionend', $.proxy(function(){
      this.$note.off('transitionend');
      if (this.options.onShow) this.options.onShow();
      this.$note.addClass('transition-ready');
    }, this));

    this.$element.append(this.$note);
    setTimeout($.proxy(function(){
      this.$note.addClass('in');
    }, this), 25);

    if (this.options.fadeOut.enabled){
      setTimeout($.proxy(this.hide, this), this.options.fadeOut.delay);
    }
  };

  Notification.prototype.hide = function () {
    this.$note.on('transitionend', $.proxy(onClose, this));
    this.$note.removeClass('transition-ready')
    setTimeout($.proxy(function(){
      this.$note.removeClass('in');
    }, this), 25);
  };

  $.fn.notify = function (options) {
    return new Notification(this, options);
  };

  $.fn.notify.defaults = {
    type: 'success',
    closable: true,
    transition: 'fade',
    fadeOut: {
      enabled: true,
      delay: 3000
    },
    message: null,
    onClose: function () {},
    onClosed: function () {}
  }
})(window.jQuery);
