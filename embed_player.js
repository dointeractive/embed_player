!function () {
  function EmbedPlayer(el, options) {
    this.$el = $(el)
    this.setup()
  }

  EmbedPlayer.prototype.setup = function () {
    this.$el.addClass('embed-player')
    this.src = this.$el.data('src')
    this.showPreview()
  }

  EmbedPlayer.prototype.showPreview = function () {
    var filter = this.filter()
      , attrs  = filter.apply(this.src)

    $('<img>', {
      src: attrs.preview,
      width: '100%'
    }).appendTo(this.$el)
  }

  EmbedPlayer.prototype.showPlayer = function () {
    var $iframe
      , $preview = this.$el.find('img')
      , filter = this.filter()
      , attrs = filter.apply(this.src)

    this.$el.addClass('play')

    $iframe = $('<iframe>', {
      src: attrs.player,
      css: { border: 'none' },
      width: $preview.outerWidth(),
      height: $preview.outerHeight()
    }).replaceAll($preview)
  }

  EmbedPlayer.prototype.filter = function () {
    var filters = [youtubeFilter]
      , filter

    for(var i = filters.length; i--;) {
      if(filters[i].isApplicable(this.src)) {
        filter = filters[i]
        break
      }
    }

    return filter
  }

 var youtubeFilter = {
   parser: /(https?:\/\/)?(www.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/watch\?feature=player_embedded&v=|youtube\.com\/embed\/)([A-Za-z0-9_-]*)(\&\S+)?(\?\S+)?/,

   isApplicable: function (url) {
     return this.parser.test(url)
   },

   apply: function (url) {
     var match = url.match(this.parser)
       , id = match[4]

     return {
       preview: 'http://img.youtube.com/vi/' + id + '/hqdefault.jpg',
       player:  'http://www.youtube.com/embed/' + id + '?autoplay=1'
     }
   }
 }

 $.fn.embedPlayer = function (options) {
   bind()
   this.each(function () {
     var $this = $(this)
       , instance = $this.data('embed-player')

     if (!instance) {
       $this.data('embed-player', new EmbedPlayer(this, options))
     } else if (instance && typeof(options) === 'string') {
       instance[options]()
     }
   })
 }

 $.fn.embedPlayer.constructor = EmbedPlayer

 var isBinded = false
 function bind() {
   if (!isBinded) {
     $(document).on('click', '.embed-player', function () {
       $(this).embedPlayer('showPlayer')
       return false
     })
     isBinded = true
   }
 }
}();
