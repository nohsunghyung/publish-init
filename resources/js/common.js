$(document).ready(function () {
  layerPopupHandler();
  // mobileMenuHandler();
  // scrollHeader();
  // slider();
});

// 팝업 핸들러
function layerPopupHandler() {
  var layerPopup = $('.layer-popup');
  var popupContainer = layerPopup.find('.popup-container');
  var closeBtn = layerPopup.find('.btn-close');
  var $body = $('body');

  // 팝업닫기
  closeBtn.on('click', function () {
    layerPopup.fadeOut(300);
    $body.removeClass('scroll-disable');
  });

  // dim 클릭시 팝업닫기
  layerPopup.on('click', function (e) {
    if (!$(e.target).closest(popupContainer).length) {
      layerPopup.fadeOut(300);
      $body.removeClass('scroll-disable');
    }
  });
}

// 팝업 열기
function openLayerPopup(popupId) {
  var popupEl = $('#' + popupId);
  var $body = $('body');
  popupEl.fadeIn(300);
  $body.addClass('scroll-disable');
}

// 특정 팝업 닫기함수
function closeLayerPopup(popupId) {
  var popupEl = $('#' + popupId);
  var $body = $('body');
  popupEl.fadeOut(300);
  $body.removeClass('scroll-disable');
}

// 모바일 메뉴 핸들러
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
    $('html, body').animate({ scrollTop: offset }, 300);
  }
}

// 헤더 스크롤 감지
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

// 슬라이드
function slider() {
  var slider = $('.popup-slider-container');

  slider.slick({
    infinite: true,
    slidesToShow: 1,
    dots: false,
    arrows: false,
    adaptiveHeight: true
  });
}
