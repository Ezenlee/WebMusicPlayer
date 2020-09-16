(function(window) {
  function Lyric(url) {
    return new Lyric.prototype.init(url);
  }
  Lyric.prototype = {
    constructor: Lyric,
    init: function(url) {
      this.url = url;
    },
    lrcArray: [],
    loadLrc: function() {
      var that = this;
      $('.lyricsList').empty();
      $.ajax({
        url: this.url,
        dataType: "json",
        cache: true,
        success: function(data) {
          if (!data.hasOwnProperty('lrc')) {
            $('#audio')[0].ontimeupdate = undefined;
            var html = '<li>纯音乐，请欣赏</li>';
            $('.lyricsList').append(html);
            return;
          }
          that.parseLrc(data);
          that.showLrc();
        },
        error: function(e) {
          console.log(e);
        }
      });
    },
    parseLrc: function(data) {
      // console.log(data);
      var lrcGet = data.lrc.lyric;
      var lrc = lrcGet.split('\n');
      var that = this;
      that.lrcArray.length = 0;
      $.each(lrc, function(i, item) {
        //过滤空白文本
        if (item.split(']')[1] == "" || item == "" || item.indexOf('作曲') !== -1 || item.indexOf('作词') !== -1) return true;
        //转化时间
        var timeStr = item.substring(item.indexOf("[") + 1, item.indexOf("]"));
        var min = parseInt(timeStr.split(':')[0]) * 60;
        var sec = parseFloat(timeStr.split(':')[1]);
        var time = parseFloat((min + sec).toFixed(2));
        //添加进数组
        that.lrcArray.push({
          t: time,
          c: item.substring(item.indexOf(']') + 1)
        });
      });
    },
    showLrc: function() {

      var that = this;
      var html = "";
      $.each(that.lrcArray, function(i, v) {
        html += '<li>' + v.c + '</li>';
      });
      $('.lyricsList').append(html);
      //同步高亮歌词
      $('#audio')[0].ontimeupdate = function() {
        $.each(that.lrcArray, function(i, v) {
          if ($('#audio')[0].currentTime < that.lrcArray[i].t) return;
          $('.lyricsList').css('margin-top', '');
          $('.lyricsList li').eq(i).addClass('highlight');
          $('.lyricsList li').eq(i).siblings().removeClass('highlight');
          var $highlight = $('li.highlight');
          var highlight = $('li.highlight')[0];
          $highlight.css('--duration', highlight.offsetWidth / 100 + 's');
          if (i <= 2) return;
          $('.lyricsList').css('margin-top', (-i + 2) * 30 + 'px');
        });
      };
    }
  };
  Lyric.prototype.init.prototype = Lyric.prototype;
  window.Lyric = Lyric;
})(window);
