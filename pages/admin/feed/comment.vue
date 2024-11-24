<template>
<div class="main-wrap">
    <section class="board">
      <div class="board__header">
        <h1>댓글 Comment</h1>
        <p>총 댓글 163건</p>
      </div>
      <div class="board__container">
        <div class="board__list">
          <div class="board__head">
            <div class="board__no">번호</div>
            <div class="board__title">내용</div>
            <div class="board__feed-text">피드 본문</div>
            <div class="board__writer">작성자</div>
            <div class="board__regDate">작성일</div>
            <div class="board__status">상태</div>
            <div class="board__management">댓글 관리</div>
          </div>
          <div class="board__body">
            <div class="board__content" v-for="(comment, index) in comments" :key="index">
              <div class="board__content-summary">
                <div class="comment__no">{{ comment.no }}</div>
                <div class="comment__title" @click="toggleDetails(index)">{{ comment.title }}</div>
                <div class="comment__feed-text"><i class='bx bx-file'></i></div>
                <div class="comment__writer">{{ comment.writer }}</div>
                <div class="comment__regDate">{{ comment.regDate}}</div>
                <div class="comment__status">{{ comment.status }}</div>
                <div class="comment__management">
                  <button class="invisibleBtn">비공개</button>
                  <button class="deleteBtn">삭제</button>
                </div>
              </div>
              <!-- 아코디언으로 펼쳐질 내용 -->
              <div class="board__details" :style="{ display: visibleDetails === index ? 'flex' : 'none' }">
                <div class="board__details-contents">
                  <div class="board__details-user-image">
                    <img :src="comment.userImage" alt="user_profile" />
                  </div>
                  <div class="board__details-text-container">
                  <div class="board__details-user-nickbox">
                    <span name="nickname"><strong>{{ comment.nickname }}</strong></span>
                  </div>
                  <div class="board__details-textbox">
                    <p name="content">{{ comment.content }}</p>
                  </div>
                  <div class=board__details-info>
                    <span class="board__details-regdate">{{ comment.detailRegDate }}</span>
                  </div>
                  </div>
                </div>
              </div>
            </div> <!-- one contents -->
            <!-- <div class="board__content">
              <div class="board__content-summary">
                <div class="comment__no">14</div>
                <div class="comment__title">라디오로나마 들어서 나름대로의 현장감을 조금이나마 느낄수있었어요 ㅎㅎ 트리플도 좋았는데 다프니스엣끌로에 ㅠ ㅠ 너무좋았어요</div>
                <div class="comment__feed-text"><i class='bx bx-file' ></i></div>
                <div class="comment__writer">사과</div>
                <div class="comment__regDate">2024-08-25</div>
                <div class="comment__status">비공개</div>
                <div class="comment__management">
                  <button class="invisibleBtn">비공개</button>
                  <button class="deleteBtn">삭제</button>
                </div>
              </div>
              <div class="board__details">
                <div class="board__details-contents">
                  <div class="board__details-user-image">
                    <img src="/images/profile12.jpg" alt="user_profile" />
                  </div>
                  <div class="board__details-text-container">
                  <div class="board__details-user-nickbox">
                    <span name="nickname"><strong>사과</strong></span>
                  </div>
                  <div class="board__details-textbox">
                    <p name="content">
                      라디오로나마 들어서 나름대로의 현장감을 조금이나마 느낄수있었어요 ㅎㅎ 트리플도 좋았는데 다프니스엣끌로에 ㅠ ㅠ 너무좋았어요                    </p>
                  </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="board__content">
              <div class="board__content-summary">
                <div class="comment__no">13</div>
                <div class="comment__title">어제 실황중계 했었고 다시 듣기도 되네요</div>
                <div class="comment__feed-text"><i class='bx bx-file' ></i></div>
                <div class="comment__writer">hellostranger</div>
                <div class="comment__regDate">2024-08-25</div>
                <div class="comment__status">정상</div>
                <div class="comment__management">
                  <button class="invisibleBtn">비공개</button>
                  <button class="deleteBtn">삭제</button>
                </div>
              </div>
              <div class="board__details">
                <div class="board__details-contents">
                  <div class="board__details-user-image">
                    <img src="/images/profile12.jpg" alt="user_profile" />
                  </div>
                  <div class="board__details-text-container">
                  <div class="board__details-user-nickbox">
                    <span name="nickname"><strong>hellostranger</strong></span>
                  </div>
                  <div class="board__details-textbox">
                    <p name="content">
                      어제 실황중계 했었고 다시 듣기도 되네요
                    </p>
                  </div>
                  <div class=board__details-info>
                    <span class="board__details-regdate">
                      2024.10.20. 19:46
                    </span>
                  </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="board__content">
              <div class="board__content-summary">
                <div class="comment__no">12</div>
                <div class="comment__title">오 찐팬인증글 같아서 참 좋습니다. 영혼과 육체... 청교도적 절제로 예술의 억압에 대한 갈등이 많이 느껴졌었고..... 둘 다 자살하는 것에서는 충격적이었는데 생각해보면 회개와 구원은 로마의 교황도 해줄 수 없다는 메세지가 느껴지더군요. 오직 자기 자신만이 할 수 있는 것 같아요. 엘리자베스가 자살하는 것을 보고 충격을 받았지만 결국 탄호이저도 자기 스스로 육신의 목숨을 끊고서야 영혼의 구원을 받은 것 같다는 생각이 드네요... 그냥 제 생각입니다 ^^</div>
                <div class="comment__feed-text"><i class='bx bx-file' ></i></div>
                <div class="comment__writer">홍익인간265</div>
                <div class="comment__regDate">2024-08-25</div>
                <div class="comment__status">정상</div>
                <div class="comment__management">
                  <button class="invisibleBtn">비공개</button>
                  <button class="deleteBtn">삭제</button>
                </div>
              </div>
              <div class="board__details">
                <div class="board__details-contents">
                  <div class="board__details-user-image">
                    <img src="/images/profile12.jpg" alt="user_profile" />
                  </div>
                  <div class="board__details-text-container">
                  <div class="board__details-user-nickbox">
                    <span name="nickname"><strong>홍익인간265</strong></span>
                  </div>
                  <div class="board__details-textbox">
                    <p name="content">
                      오 찐팬인증글 같아서 참 좋습니다. <br />
                      영혼과 육체... 청교도적 절제로 예술의 억압에 대한 갈등이 많이 느껴졌었고..... <br />
                      둘 다 자살하는 것에서는 충격적이었는데 생각해보면 회개와 구원은 로마의 교황도 해줄 수 없다는 메세지가 느껴지더군요. <br />
                      오직 자기 자신만이 할 수 있는 것 같아요. 엘리자베스가 자살하는 것을 보고 충격을 받았지만 결국 탄호이저도 자기 스스로 육신의 목숨을 끊고서야 영혼의 구원을 받은 것 같다는 생각이 드네요... 그냥 제 생각입니다 ^^
                    </p>
                  </div>
                  <div class=board__details-info>
                    <span class="board__details-regdate">
                      2024.10.20. 19:46
                    </span>
                  </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="board__content">
              <div class="board__content-summary">
                <div class="comment__no">11</div>
                <div class="comment__title">실상 탄호이저가 기독교적인 오페라였다면 자살은 종교적으로 말도 안됩니다</div>
                <div class="comment__feed-text"><i class='bx bx-file' ></i></div>
                <div class="comment__writer">복돌사탕</div>
                <div class="comment__regDate">2024-08-25</div>
                <div class="comment__status">정상</div>
                <div class="comment__management">
                  <button class="invisibleBtn">비공개</button>
                  <button class="deleteBtn">삭제</button>
                </div>
              </div>
              <div class="board__details">
                <div class="board__details-contents">
                  <div class="board__details-user-image">
                    <img src="/images/profile12.jpg" alt="user_profile" />
                  </div>
                  <div class="board__details-text-container">
                  <div class="board__details-user-nickbox">
                    <span name="nickname"><strong>복돌사탕</strong></span>
                  </div>
                  <div class="board__details-textbox">
                    <p name="content">
                      실상 탄호이저가 기독교적인 오페라였다면 자살은 종교적으로 말도 안됩니다
                    </p>
                  </div>
                  <div class=board__details-info>
                    <span class="board__details-regdate">
                      2024.10.20. 19:46
                    </span>
                  </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="board__content">
              <div class="board__content-summary">
                <div class="comment__no">10</div>
                <div class="comment__title">모짜르트, 베토벤이 환생하면 영화를 하지 않을까 싶어요. 그당시 음악, 미술, 문학, 춤 등 예술의 집대성이 극음악이 아니었을까요.</div>
                <div class="comment__feed-text"><i class='bx bx-file' ></i></div>
                <div class="comment__writer">프레디</div>
                <div class="comment__regDate">2024-08-25</div>
                <div class="comment__status">정상</div>
                <div class="comment__management">
                  <button class="invisibleBtn">비공개</button>
                  <button class="deleteBtn">삭제</button>
                </div>
              </div>
              <div class="board__details">
                <div class="board__details-contents">
                  <div class="board__details-user-image">
                    <img src="/images/profile12.jpg" alt="user_profile" />
                  </div>
                  <div class="board__details-text-container">
                  <div class="board__details-user-nickbox">
                    <span name="nickname"><strong>프레디</strong></span>
                  </div>
                  <div class="board__details-textbox">
                    <p name="content">
                      모짜르트, 베토벤이 환생하면 영화를 하지 않을까 싶어요. <br />
                      그당시 음악, 미술, 문학, 춤 등 예술의 집대성이 극음악이 아니었을까요.
                    </p>
                  </div>
                  <div class=board__details-info>
                    <span class="board__details-regdate">
                      2024.10.20. 19:46
                    </span>
                  </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="board__content">
              <div class="board__content-summary">
                <div class="comment__no">9</div>
                <div class="comment__title">
                  바그너는 비종교적 인물은 아니라고 봅니다. 제도화된 종교를 싫어했을뿐, 타락한 근대문명에서 인류를 구원해야 한다는 종교적 소명의식은 차고넘쳤던 사람이라서요. 기독교에 대한 바그너의 관점도 어떻게 보면 애증이죠. 제도로서의 기독교는 싫어하면서, 기독교적 상징과 의례에는 상당히 매료된.. 특히 '자기 부정을 통한 구원', '고통받는 구원자' 같은 신학적 개념은 본인이 생각한 동시대 인류 구원 프로젝트에 도움이 된다고 본것같아요.
                  그런면에서 어제 공연 막바지에 자기 부정이 아니라 '자기 파괴(자살)'를 통한 구원이라는 연출을 바그너가 살아돌아와서 본다면 과연 동의했을까 여부에 저는 글쎄??? 싶더군요.
                </div>
                <div class="comment__feed-text"><i class='bx bx-file' ></i></div>
                <div class="comment__writer">Mr Snow</div>
                <div class="comment__regDate">2024-08-25</div>
                <div class="comment__status">정상</div>
                <div class="comment__management">
                  <button class="invisibleBtn">비공개</button>
                  <button class="deleteBtn">삭제</button>
                </div>
              </div>
              <div class="board__details">
                <div class="board__details-contents">
                  <div class="board__details-user-image">
                    <img src="/images/profile12.jpg" alt="user_profile" />
                  </div>
                  <div class="board__details-text-container">
                  <div class="board__details-user-nickbox">
                    <span name="nickname"><strong>Mr Snow</strong></span>
                  </div>
                  <div class="board__details-textbox">
                    <p name="content">
                      바그너는 비종교적 인물은 아니라고 봅니다. 제도화된 종교를 싫어했을뿐, 타락한 근대문명에서 인류를 구원해야 한다는 종교적 소명의식은 차고넘쳤던 사람이라서요. <br /> 
                      기독교에 대한 바그너의 관점도 어떻게 보면 애증이죠. 제도로서의 기독교는 싫어하면서, 기독교적 상징과 의례에는 상당히 매료된.. 특히 '자기 부정을 통한 구원', '고통받는 구원자' 같은 신학적 개념은 본인이 생각한 동시대 인류 구원 프로젝트에 도움이 된다고 본것같아요. <br />
                      그런면에서 어제 공연 막바지에 자기 부정이 아니라 '자기 파괴(자살)'를 통한 구원이라는 연출을 바그너가 살아돌아와서 본다면 과연 동의했을까 여부에 저는 글쎄??? 싶더군요.
                    </p>
                  </div>
                  <div class=board__details-info>
                    <span class="board__details-regdate">
                      2024.10.20. 19:46
                    </span>
                  </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="board__content">
              <div class="board__content-summary">
                <div class="comment__no">8</div>
                <div class="comment__title">목요일에 탄호이저 봤어요. 탄호이저야 그렇다쳐도 신앙심깊은 엘리자베트가 자살하는 건 말이 안 되죠. 요새 오페라가 비틀기가 트렌드라 저런 식으로 연출하는 거 같아요</div>
                <div class="comment__feed-text"><i class='bx bx-file' ></i></div>
                <div class="comment__writer">헬레나</div>
                <div class="comment__regDate">2024-08-25</div>
                <div class="comment__status">정상</div>
                <div class="comment__management">
                  <button class="invisibleBtn">비공개</button>
                  <button class="deleteBtn">삭제</button>
                </div>
              </div>
              <div class="board__details">
                <div class="board__details-contents">
                  <div class="board__details-user-image">
                    <img src="/images/profile12.jpg" alt="user_profile" />
                  </div>
                  <div class="board__details-text-container">
                  <div class="board__details-user-nickbox">
                    <span name="nickname"><strong>헬레나</strong></span>
                  </div>
                  <div class="board__details-textbox">
                    <p name="content">
                      목요일에 탄호이저 봤어요. <br /> 
                      탄호이저야 그렇다쳐도 신앙심깊은 엘리자베트가 자살하는 건 말이 안 되죠. <br />
                      요새 오페라가 비틀기가 트렌드라 저런 식으로 연출하는 거 같아요
                    </p>
                  </div>
                  <div class=board__details-info>
                    <span class="board__details-regdate">
                      2024.10.20. 19:46
                    </span>
                  </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="board__content">
              <div class="board__content-summary">
                <div class="comment__no">7</div>
                <div class="comment__title">실내악이 현악뿐 아니라 관악이 더해지니 이렇게 소리가 풍성할수가요 ㅋㅋ 1악장부터 8명모두가 연주할때 마치 체임버 오케스트라인듯 두근두근하더라구요 쇤베르크는 어려웠지만 슈베르트는 넘 좋았어요! 특히 저는 김한 클라리네티스트가 젤 멋졌습니다 ㅎ 내일 프라하 공연도 기대되네요~~</div>
                <div class="comment__feed-text"><i class='bx bx-file' ></i></div>
                <div class="comment__writer">유리멘탈</div>
                <div class="comment__regDate">2024-08-25</div>
                <div class="comment__status">정상</div>
                <div class="comment__management">
                  <button class="invisibleBtn">비공개</button>
                  <button class="deleteBtn">삭제</button>
                </div>
              </div>
              <div class="board__details">
                <div class="board__details-contents">
                  <div class="board__details-user-image">
                    <img src="/images/profile12.jpg" alt="user_profile" />
                  </div>
                  <div class="board__details-text-container">
                  <div class="board__details-user-nickbox">
                    <span name="nickname"><strong>유리멘탈</strong></span>
                  </div>
                  <div class="board__details-textbox">
                    <p name="content">
                      실내악이 현악뿐 아니라 관악이 더해지니 이렇게 소리가 풍성할수가요 ㅋㅋ <br />
                      1악장부터 8명모두가 연주할때 마치 체임버 오케스트라인듯 두근두근하더라구요 <br />
                      쇤베르크는 어려웠지만 슈베르트는 넘 좋았어요! <br />
                      특히 저는 김한 클라리네티스트가 젤 멋졌습니다 ㅎ 내일 프라하 공연도 기대되네요~~
                    </p>
                  </div>
                  <div class=board__details-info>
                    <span class="board__details-regdate">
                      2024.10.20. 19:46
                    </span>
                  </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="board__content">
              <div class="board__content-summary">
                <div class="comment__no">6</div>
                <div class="comment__title">
                  오늘 슈베르트 8중주 연주
                  정말 멋지던데요
                  나중에 KBS중계석에서도
                  방연된다고 합니다
                </div>
                <div class="comment__feed-text"><i class='bx bx-file' ></i></div>
                <div class="comment__writer">소나타11</div>
                <div class="comment__regDate">2024-08-25</div>
                <div class="comment__status">정상</div>
                <div class="comment__management">
                  <button class="invisibleBtn">비공개</button>
                  <button class="deleteBtn">삭제</button>
                </div>
              </div>
              <div class="board__details">
                <div class="board__details-contents">
                  <div class="board__details-user-image">
                    <img src="/images/profile12.jpg" alt="user_profile" />
                  </div>
                  <div class="board__details-text-container">
                  <div class="board__details-user-nickbox">
                    <span name="nickname"><strong>소나타11</strong></span>
                  </div>
                  <div class="board__details-textbox">
                    <p name="content">
                      오늘 슈베르트 8중주 연주<br />
                      정말 멋지던데요<br />
                      나중에 KBS중계석에서도<br />
                      방연된다고 합니다<br />
                    </p>
                  </div>
                  <div class=board__details-info>
                    <span class="board__details-regdate">
                      2024.10.20. 19:46
                    </span>
                  </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="board__content">
              <div class="board__content-summary">
                <div class="comment__no">5</div>
                <div class="comment__title">
                  하루에 두 탕을 ~ 대단하신 체력이시군요 ㅎㅎ 두 공연 다 좋으셨다면 피로쯤이야~
                  전 내일 두탕같은 한탕 4시간짜리 탄호이저를 봐야해서 벌써 걱정입니다 ㅎㅎ
                </div>
                <div class="comment__feed-text"><i class='bx bx-file' ></i></div>
                <div class="comment__writer">terry</div>
                <div class="comment__regDate">2024-08-25</div>
                <div class="comment__status">정상</div>
                <div class="comment__management">
                  <button class="invisibleBtn">비공개</button>
                  <button class="deleteBtn">삭제</button>
                </div>
              </div>
              <div class="board__details">
                <div class="board__details-contents">
                  <div class="board__details-user-image">
                    <img src="/images/profile12.jpg" alt="user_profile" />
                  </div>
                  <div class="board__details-text-container">
                  <div class="board__details-user-nickbox">
                    <span name="nickname"><strong>terry</strong></span>
                  </div>
                  <div class="board__details-textbox">
                    <p name="content">
                      하루에 두 탕을 ~ 대단하신 체력이시군요 ㅎㅎ 두 공연 다 좋으셨다면 피로쯤이야~ <br />
                      전 내일 두탕같은 한탕 4시간짜리 탄호이저를 봐야해서 벌써 걱정입니다 ㅎㅎ
                    </p>
                  </div>
                  <div class=board__details-info>
                    <span class="board__details-regdate">
                      2024.10.20. 19:46
                    </span>
                  </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="board__content">
              <div class="board__content-summary">
                <div class="comment__no">4</div>
                <div class="comment__title">오늘 탄호이저 가서 쇤베르크 정화된밤이랑 말러6번 궁금했는데^^</div>
                <div class="comment__feed-text"><i class='bx bx-file' ></i></div>
                <div class="comment__writer">모니카9</div>
                <div class="comment__regDate">2024-08-25</div>
                <div class="comment__status">정상</div>
                <div class="comment__management">
                  <button class="invisibleBtn">비공개</button>
                  <button class="deleteBtn">삭제</button>
                </div>
              </div>
              <div class="board__details">
                <div class="board__details-contents">
                  <div class="board__details-user-image">
                    <img src="/images/profile12.jpg" alt="user_profile" />
                  </div>
                  <div class="board__details-text-container">
                  <div class="board__details-user-nickbox">
                    <span name="nickname"><strong>모니카9</strong></span>
                  </div>
                  <div class="board__details-textbox">
                    <p name="content">
                      오늘 탄호이저 가서 쇤베르크 정화된밤이랑 말러6번 궁금했는데^^
                    </p>
                  </div>
                  <div class=board__details-info>
                    <span class="board__details-regdate">
                      2024.10.20. 19:46
                    </span>
                  </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="board__content">
              <div class="board__content-summary">
                <div class="comment__no">3</div>
                <div class="comment__title">역시! 오늘도 좋았군요ㅎㅎ카덴차는 베바협의 피협 버전에 있는 1악장 카덴차를 편곡한 버전인데 실연에서 잘 듣기 힘든데 이정도 연주로 듣는다면 행운이지요</div>
                <div class="comment__feed-text"><i class='bx bx-file' ></i></div>
                <div class="comment__writer">랩틀</div>
                <div class="comment__regDate">2024-08-25</div>
                <div class="comment__status">정상</div>
                <div class="comment__management">
                  <button class="invisibleBtn">비공개</button>
                  <button class="deleteBtn">삭제</button>
                </div>
              </div>
              <div class="board__details">
                <div class="board__details-contents">
                  <div class="board__details-user-image">
                    <img src="/images/profile12.jpg" alt="user_profile" />
                  </div>
                  <div class="board__details-text-container">
                  <div class="board__details-user-nickbox">
                    <span name="nickname"><strong>랩틀</strong></span>
                  </div>
                  <div class="board__details-textbox">
                    <p name="content">
                      역시! 오늘도 좋았군요ㅎㅎ카덴차는 베바협의 피협 버전에 있는 1악장 카덴차를 편곡한 버전인데 실연에서 잘 듣기 힘든데 이정도 연주로 듣는다면 행운이지요
                    </p>
                  </div>
                  <div class=board__details-info>
                    <span class="board__details-regdate">
                      2024.10.20. 19:46
                    </span>
                  </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="board__content">
              <div class="board__content-summary">
                <div class="comment__no">2</div>
                <div class="comment__title">와 음색이 어쩜 그리 아름답죠 ㅠㅠ 완전 천국이었습니다 카덴차는 정말 새롭던데 은근 재미더있더라구요? ㅋ 역시 빈필 악장다운 카덴차 선택이지 않았나싶았어요 정말 말씀대로 행운이었네요!</div>
                <div class="comment__feed-text"><i class='bx bx-file' ></i></div>
                <div class="comment__writer">NZA</div>
                <div class="comment__regDate">2024-08-25</div>
                <div class="comment__status">정상</div>
                <div class="comment__management">
                  <button class="invisibleBtn">비공개</button>
                  <button class="deleteBtn">삭제</button>
                </div>
              </div>
              <div class="board__details">
                <div class="board__details-contents">
                  <div class="board__details-user-image">
                    <img src="/images/profile12.jpg" alt="user_profile" />
                  </div>
                  <div class="board__details-text-container">
                  <div class="board__details-user-nickbox">
                    <span name="nickname"><strong>NZA</strong></span>
                  </div>
                  <div class="board__details-textbox">
                    <p name="content">
                      와 음색이 어쩜 그리 아름답죠 ㅠㅠ 완전 찬국이었습니다 <br />
                      카덴차는 정말 새롭던데 은근 재미더있더라구요? ㅋ <br />
                      역시 빈필 악장다운 카덴차 선택이지 않았나싶았어요 정말 말씀대로 행운이었네요!
                    </p>
                  </div>
                  <div class=board__details-info>
                    <span class="board__details-regdate">
                      2024.10.20. 19:46
                    </span>
                  </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="board__content">
              <div class="board__content-summary">
                <div class="comment__no">1</div>
                <div class="comment__title">
                  오늘이 더 좋았나보네요. 어제도 정말 좋았는데..저도 호넥 옹 연주가 올해 들은 바이올린 연주 중 최고였어요. 후기 읽으니 어제 감동이 되살아나네요. 감사해요~~♡                </div>
                <div class="comment__feed-text"><i class='bx bx-file' ></i></div>
                <div class="comment__writer">Maua</div>
                <div class="comment__regDate">2024-08-25</div>
                <div class="comment__status">정상</div>
                <div class="comment__management">
                  <button class="invisibleBtn">비공개</button>
                  <button class="deleteBtn">삭제</button>
                </div>
              </div>
              <div class="board__details">
                <div class="board__details-contents">
                  <div class="board__details-user-image">
                    <img src="/images/profile12.jpg" alt="user_profile" />
                  </div>
                  <div class="board__details-text-container">
                  <div class="board__details-user-nickbox">
                    <span name="nickname"><strong>Maua</strong></span>
                  </div>
                  <div class="board__details-textbox">
                    <p name="content">
                      오늘이 더 좋았나보네요. 어제도 정말 좋았는데.. <br />
                      저도 호넥 옹 연주가 올해 들은 바이올린 연주 중 최고였어요. <br />
                      후기 읽으니 어제 감동이 되살아나네요. 감사해요~~♡
                    </p>
                  </div>
                  <div class=board__details-info>
                    <span class="board__details-regdate">
                      2024.10.20. 19:46
                    </span>
                  </div>
                  </div>
                </div>
              </div>
            </div> -->
          </div> <!-- END BOARD BODY -->
        </div> <!-- END BOARD LIST-->
      </div>
      <!-- END BOARD CONTAINER -->

      <!-- PAGENATION -->
      <div class="pagination">
        <button type="button" class="page-btn start-page">
          <i class='bx bx-chevrons-left'></i>
        </button>
        <button type="button" class="page-btn prev-page">
          <i class='bx bx-chevron-left'></i>
        </button>
        <button type="button" class="page-btn active">1</button>
        <button type="button" class="page-btn">2</button>
        <button type="button" class="page-btn">3</button>
        <button type="button" class="page-btn">4</button>
        <button type="button" class="page-btn">5</button>
        <button type="button" class="page-btn next-page">
          <i class='bx bx-chevron-right'></i>
        </button>
        <button type="button" class="page-btn end-page">
          <i class='bx bx-chevrons-right'></i>
        </button>
      </div>
      <!-- END PAGINATION -->
    </section>
  </div> <!-- END MAIN WRAP -->

  <!-- SEARCH BAR -->
  <section class="search">
    <div class="search__bar">
      <div class="search__dropdown">
        <div id="drop-text" class="search__text" @click="toggleDropdown">
          <span id="span">{{ selectedCategory }}</span>
          <i id="icon" class='bx bx-chevron-down' :style="{ transform: isOpen ? 'rotate(-180deg)' : 'rotate(0deg)' }"></i>
        </div>
        <ul id="drop-list" class="search__list" :class="{ show: isOpen }">
          <li class="search__item" v-for="item in categories" :key="item" @click="selectCategory(item)">
            {{ item }}
          </li>
        </ul>
      </div>
      <div class="search__box">
        <input type="text" id="search-input" :placeholder="inputPlaceholder" v-model="searchQuery" />
        <i class='bx bx-search'></i>
      </div>
    </div>
  </section>
  <!-- END SEARCH BAR -->
</template>

<script setup>
import { ref } from 'vue';

const visibleDetails = ref(null);

const comments = ref([
  {
    no: 15,
    title: "모짜르트, 베토벤이 환생하면 영화를 하지 않을까 싶어요. 그당시 음악, 미술, 문학, 춤 등 예술의 집대성이 극음악이 아니었을까요.",
    writer: "hellostranger",
    regDate: "2024-08-25",
    status: "정상",
    userImage: "/images/profile12.jpg",
    nickname: "hellostranger",
    content: "모짜르트, 베토벤이 환생하면 영화를 하지 않을까 싶어요. 그당시 음악, 미술, 문학, 춤 등 예술의 집대성이 극음악이 아니었을까요.",
    detailRegDate: "2024.10.20. 19:46"
  },
  {
    no: 14,
    title: `
            바그너는 비종교적 인물은 아니라고 봅니다. 제도화된 종교를 싫어했을뿐, 타락한 근대문명에서 인류를 구원해야 한다는 종교적 소명의식은 차고넘쳤던 사람이라서요. 기독교에 대한 바그너의 관점도 어떻게 보면 애증이죠. 제도로서의 기독교는 싫어하면서, 기독교적 상징과 의례에는 상당히 매료된.. 특히 '자기 부정을 통한 구원', '고통받는 구원자' 같은 신학적 개념은 본인이 생각한 동시대 인류 구원 프로젝트에 도움이 된다고 본것같아요.
            그런면에서 어제 공연 막바지에 자기 부정이 아니라 '자기 파괴(자살)'를 통한 구원이라는 연출을 바그너가 살아돌아와서 본다면 과연 동의했을까 여부에 저는 글쎄??? 싶더군요.
    `,
    writer: "hellostranger",
    regDate: "2024-08-25",
    status: "정상",
    userImage: "/images/profile13.jpg",
    nickname: "바흐",
    content: `
            바그너는 비종교적 인물은 아니라고 봅니다. 제도화된 종교를 싫어했을뿐, 타락한 근대문명에서 인류를 구원해야 한다는 종교적 소명의식은 차고넘쳤던 사람이라서요. 기독교에 대한 바그너의 관점도 어떻게 보면 애증이죠. 제도로서의 기독교는 싫어하면서, 기독교적 상징과 의례에는 상당히 매료된.. 특히 '자기 부정을 통한 구원', '고통받는 구원자' 같은 신학적 개념은 본인이 생각한 동시대 인류 구원 프로젝트에 도움이 된다고 본것같아요.
            그런면에서 어제 공연 막바지에 자기 부정이 아니라 '자기 파괴(자살)'를 통한 구원이라는 연출을 바그너가 살아돌아와서 본다면 과연 동의했을까 여부에 저는 글쎄??? 싶더군요.
    `,
    detailRegDate: "2024.10.20. 19:46"
  },
]);

const toggleDetails = (index) => {
  visibleDetails.value = visibleDetails.value === index ? null : index;
}



// 검색 기능
const categories = ['통합검색', '내용 + 닉네임', '내용', '닉네임']; // 검색 카테고리
const selectedCategory = ref('통합검색');
const inputPlaceholder = ref('검색어를 입력해주세요');
const searchQuery = ref('');
const isOpen = ref(false); // dropdown 상태

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectCategory = (category) => {
  selectedCategory.value = category;
  updatePlaceholder(category);
  isOpen.value = false; // 선택 후 드롭다운 클로즈
};

// const updatePlaceholder = (category) => {
//   if(category === '통합검색') {
//     inputPlaceholder.value = '검색어를 입력해주세요';
//   } else if(category === '아이디') {
//     inputPlaceholder.value = `검색할 ${category}를 입력해주세요`;
//   } else if(category === '닉네임'){
//     inputPlaceholder.value = `검색할 ${category}을 입력해주세요`;
//   } else {
//     inputPlaceholder.value = `검색할 ${category}을 입력해주세요`;
//   }
// };
const updatePlaceholder = (category) => {
  if(category === '통합검색') {
    inputPlaceholder.value = '검색어를 입력해주세요';
  } else {
    inputPlaceholder.value = `검색할 ${category}을 입력해주세요`
  }
};

// 클릭 외부 영역 처리
const handleClickOutside = (e) => {
  if(!e.target.closest('.search')) {
    isOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
});



</script>

<style lang="css" scoped>
@import url('/public/css/admin/feed/comment.css');
</style>