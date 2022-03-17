(function (exports) {
  var $window = $(window);
  var $document = $(document);
  var $selectric; // 셀렉트릭
  var sliderArr = []; // 슬라이드 배열
  var $body = $('body');
  var $header = $('#header');

  $document.ready(function () {
    $body = $('body');
    $header = $('#header');
    // 셀렉트박스
    selectric();
    // 모바일메뉴 핸들러
    mobileMenuHandler();
    // 헤더 스크롤감지
    scrollHeader();
    // 슬라이드
    sliderMaker();
    // 아코디언 핸들러
    accordionHandler();
    // input active 핸들러
    inputActiveHandler();
    // 달력
    datePicker();
    // 최상단버튼
    floatBtnTop();
    // 헤더 높이 감지 컨텐츠간격
    contentSpaceFn();
    // 평점 선택
    reviewStar();
    // 숫자 카운팅
    // new NumberCounter('countNumber');
  });

  // -------------------------------- 공통 함수 ------------------------------------//

  // 팝업 컨트롤러
  var layerPopup = {
    popupArr: [],
    zIndex: 999,
    // 특정 팝업 열기
    openPopup: function (popupId, dimFlag) {
      var $popupEl = $('#' + popupId);
      var _ = this;
      var $closeBtn = $popupEl.find('.popup-close');
      var $popupContainer = $popupEl.find('.popup-container');
      // 팝업 배열에 담기
      _.popupArr.push($popupEl);

      // 팝업 오픈
      $popupEl.addClass('open').css({
        zIndex: _.zIndex + _.popupArr.length,
      });

      // body 스크롤 막기
      $body.addClass('scroll-disable');
      if (!$('.layer-popup-dim').length) {
        // dim없을경우 생성
        $body.append('<div class="layer-popup-dim"></div>');
      }

      $('.layer-popup-dim').addClass('show');

      // 팝업닫기 눌렀을때
      $closeBtn.off('click');
      $closeBtn.on('click', function (e) {
        e.preventDefault();
        _.closePopup(popupId);
      });

      if (!dimFlag) {
        // dim 클릭시 팝업 전부 닫기
        $popupEl.off('click');
        $popupEl.on('click', function (e) {
          if (!$(e.target).closest($popupContainer).length) {
            _.closeAllPopup();
          }
        });
      }
    },
    // 특정 팝업 닫기
    closePopup: function (popupId) {
      var _ = this;
      var $popupEl = popupId ? $('#' + popupId) : _.popupArr[_.popupArr.length - 1];
      $popupEl.removeClass('open');
      $body.removeClass('scroll-disable');
      _.popupArr = _.popupArr.filter(function (item) {
        return item.attr('id') !== $popupEl.attr('id');
      });
      if (_.popupArr.length === 0) {
        $('.layer-popup-dim').removeClass('show');
      }
    },
    // 모든 팝업 닫기
    closeAllPopup: function () {
      var _ = this;
      for (var i = 0; i < _.popupArr.length; i++) {
        _.popupArr[i].removeClass('open');
      }
      _.popupArr = [];
      $('.layer-popup-dim').removeClass('show');
    },
  };

  function mobileMenuHandler() {
    var $moblieNavBtn = $('.mobile-nav-btn');
    var $dim = $('.gnb-dim');
    $moblieNavBtn.on('click', function () {
      menuHandler();
    });
    $dim.on('click', function () {
      menuHandler();
    });

    function menuHandler() {
      if (!$header.hasClass('open')) {
        $header.addClass('open');
        $body.addClass('scroll-disable');
      } else {
        $header.removeClass('open');
        $body.removeClass('scroll-disable');
      }
    }
  }

  // 스크롤 이동 함수
  function scorllMoveTo(id) {
    if (id) {
      var offset = $('#' + id).offset().top;
      $('html, body').animate({scrollTop: offset}, 300);
    }
  }

  function scrollHeader() {
    headerScrollFn();
    $window.on('scroll', function () {
      headerScrollFn();
    });

    function headerScrollFn() {
      var _sct = $window.scrollTop();
      if (_sct > 0) {
        $header.addClass('scroll');
      } else {
        $header.removeClass('scroll');
      }
    }
  }

  function sliderMaker() {
    var exampleSlider = sliderInit('.slider-example', {
      loop: false,
      // slidesPerView: 2
      // centeredSlides: true,
      // spaceBetween: 30,
      // freeMode: true,
      // autoplay: {
      //   delay: 1000,
      //   disableOnInteraction: false,
      //   pauseOnMouseEnter: false,
      // },
      // autoHeight: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        // 모바일에서 -> pc
        360: {
          slidesPerView: 2,
        },
        600: {
          slidesPerView: 'auto',
        },
      },
    });
  }

  // 슬라이드 생성
  function sliderInit(element, option) {
    if (!element.length) return;

    var slider = new Swiper(element, option);
    sliderArr.push(slider);
    return slider;
  }

  // 슬라이드 update(새로고침)
  function sliderUpdate() {
    if (sliderArr[0].length) {
      $.each(sliderArr[0], function (i) {
        sliderArr[0][i].update();
      });
    }
  }

  function selectric() {
    $selectric = $('.selectric');
    if (!$selectric.length) return;
    $selectric.selectric({
      nativeOnMobile: false,
      onInit: function (event, selectric) {
        var $this = $(this);
        initSelectric($this, selectric);
      },
      onRefresh: function (event, selectric) {
        var $this = $(this);
        initSelectric($this, selectric);
      },
      onChange: function () {
        // 셀렉트릭 작동시 select박스 change 트리거
        $(this).trigger('change');
        // float 라벨 있을경우
        if ($(this).hasClass('float')) {
          if ($(this)[0].value) {
            $(this).closest('.selectric-container').addClass('active');
          } else {
            $(this).closest('.selectric-container').removeClass('active');
          }
        }
      },
      onOpen: function () {},
      onClose: function () {},
    });

    // 초기 셋팅 함수
    function initSelectric(target, selectric) {
      // 필수항목일경우
      if (target.hasClass('required') && !target[0].value) {
        selectric.elements.label.append('<span class="required">*</span>');
      }
      // float 라벨 있을경우
      if (target.hasClass('float')) {
        if (target[0].value) {
          target.closest('.selectric-container').addClass('active');
        }
      }
    }
  }

  // 셀렉트릭 새로고침
  function refreshSelectric() {
    $selectric.selectric('refresh');
  }

  function accordionHandler() {
    var accordionHeader = $('.accordion-header');
    if (!accordionHeader.length) return;
    accordionHeader.on('click', function () {
      var $this = $(this);
      var speed = $this.parents('.main-info-container').length ? 400 : 200;
      accordionFn($this, speed);
    });
  }

  function accordionFn(el, speed) {
    speed = speed ? speed : 200;
    if (el.hasClass('solo')) {
      el.parents('.accordion-list').toggleClass('active').find('.accordion-body').stop().slideToggle(speed);
    } else {
      el.parents('.accordion-list')
        .toggleClass('active')
        .find('.accordion-body')
        .stop()
        .slideToggle(speed)
        .parent('.accordion-list')
        .siblings('.accordion-list')
        .removeClass('active')
        .find('.accordion-body')
        .slideUp(speed);
    }
  }

  function inputActiveHandler() {
    var $inputs = $('.input-active');
    if (!$inputs.length) return;

    $inputs.each(function () {
      var $this = $(this);
      if ($this.val().length) {
        $this.closest('.input-cover').addClass('active');
      }
    });

    $(document).on('focus change', '.input-active', function (e) {
      var $this = $(this);
      var $inputcover = $this.closest('.input-cover');
      if (!$this.is('[readonly]')) {
        $inputcover.addClass('focus');
      }
      $inputcover.addClass('active');
    });

    $(document).on('focusout change', '.input-active', function (e) {
      var $this = $(this);
      var $inputcover = $this.closest('.input-cover');
      var setTimeHandle = setTimeout(function () {
        if (!$this.hasClass('open-datepicker')) {
          $inputcover.removeClass('focus');
          clearTimeout(setTimeHandle);
        }
      }, 100);
      if (!$this.val().length) {
        if (!$this.hasClass('open-datepicker')) {
          $inputcover.removeClass('active');
        }
      }
    });
  }

  function datePicker() {
    var $dateEl = $('.datepicker-input');
    if (!$dateEl.length) return;
    $dateEl.each(function () {
      var $this = $(this);
      if ($this.hasClass('month')) {
        $this.monthpicker({
          monthNames: ['1월(JAN)', '2월(FEB)', '3월(MAR)', '4월(APR)', '5월(MAY)', '6월(JUN)', '7월(JUL)', '8월(AUG)', '9월(SEP)', '10월(OCT)', '11월(NOV)', '12월(DEC)'],
          monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
          changeYear: true,
          yearRange: '-60:+0',
          dateFormat: 'yy-mm',
        });
      } else {
        $this.datepicker({
          changeMonth: true,
          changeYear: true,
          yearRange: '-80:+10',
          beforeShow: function () {
            $(this).addClass('open-datepicker');
          },
          onClose: function () {
            $(this).removeClass('open-datepicker');
          },
        });
      }
    });
  }

  function floatBtnTop() {
    $('.float-btn-top').on('click', function () {
      scorllMoveTo();
    });
  }

  function contentSpaceFn() {
    var $content = $('#content');
    var setTimeHandler = null;
    if (!$header.length) return;
    if ($content.hasClass('space')) {
      setTimeHandler = setTimeout(function () {
        var _headerHeight = $header.outerHeight();
        $content.css('paddingTop', _headerHeight);
        clearTimeout(setTimeHandler);
      }, 150);
    }
  }

  function reviewStar() {
    var container = $('.rating-select-container');
    var inputs = container.find('input[type="radio"]');
    var labels = container.find('label');
    inputs.on('change', function () {
      if ($(this).prop('checked')) {
        labels.each(function () {
          $(this).removeClass('checked');
        });
        $(this).next('label').addClass('checked').prevAll('label').addClass('checked');
      }
    });
  }

  function NumberCounter(target_frame, target_number) {
    if (!$('#' + target_frame).length) return;
    this.count = 0;
    this.diff = 0;
    this.target_frame = document.getElementById(target_frame);
    this.target_count = this.target_frame.innerHTML;
    this.timer = null;
    this.counter();
  }
  NumberCounter.prototype.counter = function () {
    var self = this;
    this.diff = this.target_count - this.count;

    if (this.diff > 0) {
      self.count += Math.ceil(this.diff / 5);
    }

    this.target_frame.innerHTML = this.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    if (this.count < this.target_count) {
      this.timer = setTimeout(function () {
        self.counter();
      }, 20);
    } else {
      clearTimeout(this.timer);
    }
  };

  // -------------------------------- 공통 함수 ------------------------------------//

  // -------------------------------- ui 함수 --------------------------------------//

  // -------------------------------- ui 함수 --------------------------------------//

  // js 함수 외부사용을 위함

  // 팝업함수
  exports.layerPopup = layerPopup;
  // 슬라이드 업데이트 - 비동기 작업후 실행
  exports.sliderUpdate = sliderUpdate;
  // 셀렉트릭 새로고침
  exports.refreshSelectric = refreshSelectric;
  // 셀렉트릭 생성
  exports.selectric = selectric;
})(this);
