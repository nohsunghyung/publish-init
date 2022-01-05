1. if문

   ```scss
   // 태그 분기처리
   @@if(type == 'primary') {
   <header id="header" class=""></header>
   }
   ```

   ```scss
   // 클래스에 if문 넣기
   <div class="tab-item @@if(activeIndex == 7) {active}"></div>

   // 변수 보내주는 파일
   @@include('../../includes/test.html',{activeIndex:7})
   ```
