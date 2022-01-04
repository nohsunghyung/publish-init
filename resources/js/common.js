$(document).ready(function () {
  // 팝업 핸들러
  layerPopupHandler();
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

function layerPopupHandler() {
  var layerPopup = $('.layer-popup');
  var popupContainer = layerPopup.find('.popup-container');
  var closeBtn = layerPopup.find('.btn-close');
  var $body = $('body');

  // 팝업닫기
  closeBtn.on('click', function () {
    layerPopup.removeClass('open');
    $body.removeClass('scroll-disable');
  });

  // dim 클릭시 팝업닫기
  layerPopup.on('click', function (e) {
    if (!$(e.target).closest(popupContainer).length) {
      layerPopup.removeClass('open');
      $body.removeClass('scroll-disable');
    }
  });
}

// 팝업 열기
function openLayerPopup(popupId) {
  var popupEl = $('#' + popupId);
  var $body = $('body');
  popupEl.addClass('open');
  $body.addClass('scroll-disable');
}

// 특정 팝업 닫기함수
function closeLayerPopup(popupId) {
  var popupEl = $('#' + popupId);
  var $body = $('body');
  popupEl.removeClass('open');
  $body.removeClass('scroll-disable');
}

function mobileMenuHandler() {
  var $moblieNavBtn = $('.mobile-nav-btn');
  var $header = $('#header');
  var $body = $('body');
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
  var $header = $('#header');
  var $win = $(window);
  headerScrollFn();
  $win.on('scroll', function () {
    headerScrollFn();
  });

  function headerScrollFn() {
    var _sct = $win.scrollTop();
    if (_sct > 0) {
      $header.addClass('scroll');
    } else {
      $header.removeClass('scroll');
    }
  }
}

function sliderMaker() {
  var popupSlider = $('.member-slider');

  sliderInit(popupSlider, {
    infinite: true,
    centerMode: true,
    dots: false,
    arrows: true,
    variableWidth: true,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnFocus: false,
    pauseOnDotsHover: false,
    appendArrows: '.member-slider-container .arrows',
  });
}

// 슬라이드 생성
function sliderInit(element, option) {
  if (!element.length) return;

  $(element).slick(option);
}

function selectric() {
  var $selectric = $('.selectric');
  if (!$selectric.length) return;
  $selectric.selectric({
    nativeOnMobile: false,
    onInit: function (event, selectric) {
      // 필수항목일경우
      if ($(this).hasClass('required') && !selectric.element.value) {
        selectric.elements.label.append('<span class="required">*</span>');
      }
      // float 라벨 있을경우
      if ($(this).hasClass('float')) {
        if ($(this)[0].value) {
          $(this).closest('.selectric-container').addClass('active');
        }
      }
    },
    onChange: function () {
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
    el.parents('.accordion-list')
      .toggleClass('active')
      .find('.accordion-body')
      .stop()
      .slideToggle(speed);
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
        monthNames: [
          '1월(JAN)',
          '2월(FEB)',
          '3월(MAR)',
          '4월(APR)',
          '5월(MAY)',
          '6월(JUN)',
          '7월(JUL)',
          '8월(AUG)',
          '9월(SEP)',
          '10월(OCT)',
          '11월(NOV)',
          '12월(DEC)',
        ],
        monthNamesShort: [
          '1월',
          '2월',
          '3월',
          '4월',
          '5월',
          '6월',
          '7월',
          '8월',
          '9월',
          '10월',
          '11월',
          '12월',
        ],
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
  var $header = $('#header');
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
      $(this)
        .next('label')
        .addClass('checked')
        .prevAll('label')
        .addClass('checked');
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

  this.target_frame.innerHTML = this.count
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (this.count < this.target_count) {
    this.timer = setTimeout(function () {
      self.counter();
    }, 20);
  } else {
    clearTimeout(this.timer);
  }
};
