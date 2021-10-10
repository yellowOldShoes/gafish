/**
 * ========================
 * [FrameCartoon 逐帧动画组件]
 * @Author gafish
 * @Date   2015-10-22
 * ========================
 */

  function FrameCartoon(options) {
    var self = this;
    self.el = typeof options.el == 'string' ? document.querySelector(options.el):options.el; //容器节点
    self.frameNum = options.frameNum || 1; //总帧数
    self.framerate = options.framerate || 24; //帧速率
    self.url = options.url || ''; //连续帧合并sprite图
    self.direction = options.direction || 'horizontal'; //逐帧动画方向，默认为水平方向(horizontal)，垂直方向为 vertical
    self.iteration = options.iteration || 'infinite'; //循环次数，infinite 为无限循环
    self.complete = options.complete || function(){}; //每次动画完成回调
    self.frameTime = null;
    self._ready = null;
    self._init();
  }

  FrameCartoon.prototype = {
    _init: function(cb) {
      var self = this;
      if (!self.el || !self.url) {
        console.log('参数缺失，el、url参数为必须且不能为空');
        return;
      }
      self._getImageSize(function(err, size) {
        if (err) {
          console.log(err.msg);
          return;
        }
        self._setStyle(size);
        cb && cb();
      });
    },
    _getImageSize: function(cb) {
      var self = this;
      var img = new Image();
      img.onload = function() {
        cb && cb(null, {
          width: img.width,
          height: img.height
        });
      }
      img.onerror = function() {
        cb && cb({
          msg: '图片加载失败'
        });
      }
      img.src = self.url;
    },
    _setStyle: function(size) {
      var self = this;
      if (self.direction == 'vertical') {
        self.width = size.width;
        self.height = size.height/self.frameNum;
      }else{
        self.width = size.width/self.frameNum;
        self.height = size.height;
      }
      self.el.style.width = self.width+'px';
      self.el.style.height = self.height+'px';
      self.el.style.overflow = 'hidden';
      self.el.style.backgroundImage = 'url('+self.url+')';
      self._ready = true;
    },
    start: function() {
      var self = this;
      if (!self._ready) {
        self._init(function() {
          self.start();
        });
        return;
      }
      if (self.frameTime) {
        clearTimeout(self.frameTime);
      }
      var time = Math.floor(1000/self.framerate);
      var distance = 0; // 当前移动距离
      var step = 0; // 当前帧数
      var count = 0; // 循环次数
      var move = function() {
        if (self.direction == 'vertical') {
          distance -= self.height;
          self.el.style.backgroundPositionY = distance +'px';
        }else{
          distance -= self.width;
          self.el.style.backgroundPositionX = distance +'px';
        }
        step++;
        if (step >= self.frameNum-1) {
          distance = 0;
          step = 0;
          count++;
          self.complete && self.complete(count);
        }
        if (self.iteration == 'infinite' || count < self.iteration) {
          self.frameTime = setTimeout(move, time);
        }
      };
      self.frameTime = setTimeout(move, time);
    },
    stop: function() {
      var self = this;
      clearTimeout(self.frameTime);
    }
  }
