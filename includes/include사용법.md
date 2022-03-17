1. include 기본사용
   @@include('../../includes/section-keyvisual.html')

2. 값 변경
   <!-- 값 넘겨주기 -->
   <div class="content">@@include('../../includes/section-keyvisual.html', { title: '제목입니다.', subText: '두번째 제목입니다' })</div>

    <!-- 변수를 이용해 값 보여주기 -->
    <div class="sub-keyvisual">
      <h2>@@title</h2>
      <p>@@subText</p>
    </div>

3. if문을 이용한 작업

// 태그 분기처리
@@if(type == 'primary') {

<header id="header" class="primary"></header>
}
@@if(type == 'fix') {
<header id="header" class="fix"></header>
}

- 클래스에 if문 넣기
<div class="tab-item @@if(activeIndex == 7) {active}"></div>

- 변수 보내주는 파일
  @@include('../../includes/test.html',{activeIndex:7})
