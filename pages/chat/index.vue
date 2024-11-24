<template>
<main class="chat-wrap">
  <section class="chat-group__wrap chat-group-wrap">

    <div class="chat-group-selector-wrap">

      <div class="chat-group__info">
        <h1 class="chat-group__title" hidden>
          채팅 화면
        </h1>

        <div class="chat-group__chatoption-wrap">
          <div class="chat-group__current-wrap">
            <div class="chat-group__groupchat">
              <span class="chat-group__groupchat-title" :class="{ active: groupchatVisible }"
                @click="groupChatBtn">그룹채팅</span>
              <nav>
                <ul class="chat-group__groupchat-list" v-show="groupchatListVisible">
                  <li class="chat-group__groupchat-every small_btn_grey_unclick"
                    :class="{ active: groupchatEveryVisible }" @click="everyChatBtn" id="group-chat-every">전체</li>

                  <li class="chat-group__groupchat-in small_btn_grey_unclick" :class="{ active: groupchatinVisible }"
                    @click="inChatBtn" id="group-chat-in">참여중</li>
                </ul>
              </nav>
            </div>
            <div class="chat-group__personalchat">
              <span class="chat-group__personalchat-title" :class="{ active: personalchatVisible }"
                @click="personalChatBtn">1:1 채팅</span>
            </div>
          </div>

          <!--검색 &세팅-->
          <div class="chat-group__menu-wrap">
            <nav>
              <ul class="chat-group__menu-list">
                <li class="chat-group__menu-search" @click="menuSearchBtn">
                  <i class='searchform-icon bx bx-search' id="menu-search"></i>
                  <span class="sr-only" hidden>검색</span>
                </li>
                <li class="chat-group__menu-setting" id="menu-setting" @click="MenuSettingBtn">
                  <i class='bx bx-cog'></i>
                  <span class="sr-only" hidden>설정</span>
                  <nav>
                    <ul class="chat-group__menu-setting-list" :class="{ active: chatSettingList }">
                      <li class="chat-group__sort">채팅방정렬</li>
                      <li class="chat-group__sort-newest">최신 메세지 순</li>
                      <li class="chat-group__sort-unread">안 읽은 메세지 순</li>
                      <li class="chat-group__sort-delete">편집</li>
                    </ul>
                  </nav>
                </li>
              </ul>
            </nav>
          </div>

          <!--검색창-->
          <div class="chat-group__chat-name-search-wrap" :class="{ active: chatSearchWrap }">
            <div class="chat-group__chat-name-search">
              <form class="chat-group__chat-name-searchform">
                <label hidden>대화방 검색</label>
                <i class='searchform-icon bx bx-search'></i>
                <input class="chat-group__chat-name-searchform-input" type="text" />
              </form>
              <div class="chat-group__in-chat-search-close" @click="searchCloseBtn">
                <i class='bx bx-x'></i>
              </div>
            </div>
          </div>

        </div>

        <hr class="hr">

        <div class="chat-group__list chat-list-wrap">
          <ul>
            <li class="chat-group__item" v-for="(groupchat, index) in chatlist" :key="index">
              <img class="chat-group__img" :src="groupchat.img" alt="채팅방 대표 이미지">
              <div class="chat-group__details">
                <div class="chat-group__name-info">
                  <a class="chat-group__name">{{ groupchat.name }}</a>
                  <span class="chat-group__current-member">{{ groupchat.currentmembernum }}</span>
                </div>
                <div class="chat-group__last-message-wrap">
                  <span class="chat-group__last-message">{{ groupchat.lastchat }}</span>
                  <span class="chat-group__timestamp">{{ groupchat.lastchattime }}</span>
                </div>
              </div>
              <hr class="middle-hr">
            </li>
          </ul>
        </div>

      </div>

      <!-- 현재 참여 채팅방  -->
      <div class="chat-group__in-wrap">

        <div class="chat-group__chat-container" :class="{ active: chatContainer }"> <!--채팅창-->

          <!-- 현재 참여 채팅 제목바  -->
          <div class="chat-group__in-chat">
            <div class="chat-group__in-name-wrap">
              <div class="chat-group__in-name-info">
                <img class="chat-group__in-img" src="/public/images/chat/우연히.png" alt="">
                <a class="chat-group__in-name">망그러진 곰과 비밀의 다락방</a>
                <span class="chat-group__in-current-member">50</span>
              </div>

              <div class="chat-group__in-menu-wrap">
                <nav>
                  <ul class="chat-group__in-menu-list">
                    <li class="chat-group__in-menu-search" @click="inChatSearchBtn">
                      <i class='bx bx-search'></i>
                      <span class="sr-only" hidden>검색</span>
                    </li>
                    <li class="chat-group__in-menu-bar" @click="inMenuBarBtn">
                      <i class='bx bx-menu'></i>
                      <span class="sr-only" hidden>메뉴</span>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>

          <!--접히는 검색 바-->
          <div class="chat-group__in-chat-search-wrap" :class="{ active: inChatSearchWrap }">
            <div class="chat-group__in-chat-search">
              <form class="chat-group__in-chat-searchform">
                <label hidden>대화방 검색</label>
                <i class='bx bx-search in-chat-searchform-icon'></i>
                <input class="chat-group__in-chat-searchform-input" type="text" />

              </form>
              <div class="chat-group__in-chat-search-close" @click="inChatSearchCloseBtn">
                <i class='bx bx-x-circle'></i>
              </div>
            </div>
          </div>

          <!--접히는 메뉴바 긴 부분-->
          <div class="chat-group__in-chat-menu" :class="{ active: inChatMenu }">
            <div class="test">
              <!--채팅이름및정보-->
              <div class="chat-group__in-chat-info-wrap">
                <div class="chat-group__in-chat-info">
                  <div class="chat-group__in-chat-info-name">[16세 작가 전이수 X 월드비전] 기부 특별 전시회 푸른고백아아</div>
                  <div class="chat-group__in-chat-info-count">30명 참여 중</div>
                  <div>
                    <span class="chat-group__in-chat-info-date">개설일 2028-8-10 |</span>
                    <span class="chat-group__in-chat-info-like">좋아요 9</span>
                  </div>
                </div>
              </div>

              <!--채팅방사진-->
              <div class="chat-group__in-chat-pic-wrap">
                <div class="chat-group__in-chat-pic">
                  <div class="chat-group__in-chat-pic-title-wrap">
                    <div>
                      <i class='bx bx-images'></i>
                      <span class="chat-group__in-chat-pic-title">사진</span>
                    </div>
                  </div>
                  <div class="chat-group__in-chat-pics">
                    <img class="chat-group__in-chat-pic-img" src="/public/images/chat/chat-img-1.png">
                    <img class="chat-group__in-chat-pic-img" src="/public/images/chat/chat-img-2.png">
                  </div>
                </div>
              </div>


              <!--채팅방참여인원-->
              <div class="chat-group__in-chat-member-wrap">
                <div class="chat-group__in-chat-member">
                  <div class="chat-group__in-chat-member-title-wrap">
                    <div>
                      <i class='bx bx-group'></i>
                      <span class="chat-group__in-chat-member-title">참여 멤버</span>
                    </div>
                  </div>
                  <div v-for="(member) in members" class="chat-group__in-chat-members">
                    <div class="chat-group__in-chat-member-profile">
                      <img class="chat-group__in-chat-member-pic" :src="member.profile">
                      <span class="chat-group__in-chat-member-name">{{ member.name }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="chat-group__in-chat-out-wrap">
                <div class="chat-group__in-chat-out" @click="inChatOutBtn">
                  <i class='bx bx-exit'></i>
                  <span hidden>채팅방 나가기</span>
                </div>
              </div>

            </div>
          </div>


          <!--공지사항-->
          <div class="chat-group__notice-wrap">
            <div class="chat-group__notice-box">
              <div class="chat-group__notice-fixed-wrap">
                <i class='chat-group__notice-icon bx bx-volume-low'></i>
                <div class="chat-group__notice-fixed">망그러진 곰과 비밀의 다락방 팝업 오픈채팅방 입니다.<br>
                  팝업이 종료되면 채팅방도 종료됩니다.
                </div>
                <i class='chat-group__down-icon bx bx-chevron-down'></i>
                <i class='chat-group__up-icon bx bx-chevron-up'></i>
              </div>
              <ul class="chat-group__notice-add-list">
                <li class="chat-group__notice-add">
                  <span class="chat-group__notice-add-content">해당 방에서 광고, 욕설, 음란 발언의 경우,<br> 신고 및 강제 퇴장이 가능합니다.</span>
                </li>
                <li class="chat-group__notice-add">
                  <span class="chat-group__notice-add-content">해당 방에서 광고, 욕설, 음란 발언의 경우,<br> 신고 및 강제 퇴장이 가능합니다.</span>
                </li>
              </ul>
            </div>
          </div>


          <div class="chat-group__message-body"><!--채팅 메세지 묶음-->

            <div class="chat-group__recieve-wrap"> <!--받은 메세지 전체 랩-->
              <img class="chat-group__sender-img" src="/public/images/chat/최다니엘.png">

              <div class="chat-group__recieve-content-wrap"><!--받은 메세지 내용 랩-->

                <span class="chat-group__nickname">fox11</span>

                <div class="chat-group__recieve-message-wrap">
                  <div class="chat-group__recieve-message-content recieve-message-form">망그러진 곰 팝업 가신 분
                    지금 굿즈 수량 얼마나 남았을까요?</div>
                  <div class="chat-group__recieve-check-wrap">
                    <span class="chat-group__readcheck">1</span>
                    <span class="chat-group__recieve-time">오후 12시 20분</span>
                  </div>
                </div>

              </div><!--받은 메세지 내용 데스트-->
            </div><!--받은 메세지 전체 랩-->

            <div class="chat-group__send-wrap"><!--보낸 메세지 전체 랩-->
              <div class="chat-group__send-time-wrap"><!--보낸 메세지 시간 랩-->
                <span class="chat-group__send-time">오후 12시 24분</span>
              </div>

              <div class="chat-group__send-content-wrap"><!--보낸 메세지 내용 랩-->
                <div class="chat-group__send-message-content send-message-form">망그러진 곰 팝업 가신 분 지금 굿즈
                  수량 얼마나 남았을까요?</div>
              </div>

            </div>

          </div> <!--채팅 메세지 묶음-->


          <div class="chat-group__input-wrap chat-input-form"><!--채팅 입력 폼-->
            <i class='hat-group__input-img-icon bx bx-image'></i>
            <input class="chat-group__input-form " type="text">
            <i class='chat-group__input-send-icon bx bx-up-arrow-circle'></i>
          </div><!--채팅 입력 폼-->


        </div> <!--채팅창-->

      </div> <!--현재 참여 채팅방-->

      <div class="chat-group__in-chat-out-modal-wrap" :class="{ active: inChatOutModalWrap }"><!--나가기 모달창-->
        <ul>
          <li class="chat-group__in-chat-out-info">
            <div>
              <img class="in-chat-modal-img" src="/public/images/chat/우연히.png" />
              <div>망그러진 곰과 비밀의 다락방</div>
              <div>채팅방을 나가시겠어요?</div>
            </div>
          </li>
          <li class="chat-group__in-chat-exit">나가기</li>
          <li class="chat-group__in-chat-cancel" @click="inChatCancelBtn">취소</li>
        </ul>
      </div><!--나가기 모달창-->

    </div>

  </section>
</main>
</template>

<script setup>
import { ref } from 'vue';

// 그룹 버튼 클릭 핸들러
const groupchatVisible = ref(false);
const groupchatListVisible = ref(false);

const groupChatBtn = () => {
  console.log("그룹채팅 버튼 클릭")

  groupchatListVisible.value = !groupchatListVisible.value;

  //검색 아이콘을 눌렀을때 그룹채팅 스타일 사라지는 것 대비
  if (groupchatVisible.value == true)
    groupchatVisible.value = true;
  else
    groupchatVisible.value = !groupchatVisible.value;

  //개인버튼 -unclick
  if (personalchatVisible.value == true)
    personalchatVisible.value = !personalchatVisible.value;

  //검색 -unclick
  if (chatSearchWrap.value == true)
    chatSearchWrap.value = !chatSearchWrap.value;
};


// 개인채팅 버튼 클릭 핸들러
const personalchatVisible = ref(false);

const personalChatBtn = () => {
  console.log("개인 채팅 버튼 클릭");
  personalchatVisible.value = !personalchatVisible.value;

  //그룹버튼 눌려있다면 풀기
  if (groupchatVisible.value == true)
    groupchatVisible.value = !groupchatVisible.value;
  if (groupchatListVisible.value == true)
    groupchatListVisible.value = !groupchatListVisible.value;

};

//전체, 참여 중 유지
const groupchatEveryVisible = ref(false);
const groupchatinVisible = ref(false);

const everyChatBtn = () => {
  console.log("전체 채팅 클릭");
  groupchatEveryVisible.value = !groupchatEveryVisible.value;

  if (groupchatinVisible.value == true)
    groupchatinVisible.value = !groupchatinVisible.value;
};

const inChatBtn = () => {
  console.log("참여중 채팅 클릭");
  groupchatinVisible.value = !groupchatinVisible.value;

  if (groupchatEveryVisible.value == true)
    groupchatEveryVisible.value = !groupchatEveryVisible.value;
}

//채팅검색아이콘 클릭, 채팅세팅아이콘
//채팅검색
const chatSearchWrap = ref(false);

const menuSearchBtn = () => {
  console.log("검색 버튼 클릭");
  chatSearchWrap.value = !chatSearchWrap.value;

  //화면 겹침으로 그룹 채팅 접기
  if (groupchatListVisible.value == true)
    groupchatListVisible.value = !groupchatListVisible.value;
  else groupchatListVisible.value = false;
};

//채팅 검색 닫기 버튼 
const searchCloseBtn = () => {
  console.log("닫기 버튼 클릭")
  chatSearchWrap.value = !chatSearchWrap.value;
};

//메뉴바 클릭
const chatSettingList = ref(false);

const MenuSettingBtn = () => {
  console.log("세팅버튼 클릭");
  chatSettingList.value = !chatSettingList.value;
};

//채팅방 내 검색 클릭
const inChatSearchWrap = ref(false);

const inChatSearchBtn = () => {
  console.log("채팅장 내 검색 버튼 클릭");
  inChatSearchWrap.value = !inChatSearchWrap.value;
};

//채팅방 내 검색 닫기 버튼
const inChatSearchCloseBtn = () => {
  console.log("닫기 버튼 클릭")
  inChatSearchWrap.value = !inChatSearchWrap.value;
};

//채팅방 메뉴바 핸들러
const inChatMenu = ref(false);

const inMenuBarBtn = () => {
  console.log("채팅방 메뉴 버튼 클릭");
  inChatMenu.value = !inChatMenu.value;
};

//채팅방 메뉴바 나가기 핸들러
const inChatOutModalWrap = ref(false);
const chatContainer = ref(false);

const inChatOutBtn = () => {
  console.log("채팅방 메뉴 나가기 버튼 클릭");
  chatContainer.value = !inChatOutModalWrap.value
  inChatOutModalWrap.value = !inChatOutModalWrap.value;

};

//나가기 클릭 후 취소 클릭
const inChatCancelBtn = () => {
  chatContainer.value = !inChatOutModalWrap.value
  inChatOutModalWrap.value = !inChatOutModalWrap.value;
};



const chatlist = ref([
  {
    img: '/images/chat/우연히.png',
    name: '망그러진 곰과 비밀의 다락방',
    currentmembernum: '50',
    lastchat: '망그러진 곰과팝업 가신 분 지금 굿즈 수량 얼마나남았을까요???',
    lastchattime: '오전 8시 30분'
  },
  {
    img: '/images/chat/우연히.png',
    name: '망그러진 곰과 비밀의 다락방',
    currentmembernum: '50',
    lastchat: '망그러진 곰과팝업 가신 분 지금 굿즈 수량 얼마나남았을까요???',
    lastchattime: '오전 8시 30분'
  },
  {
    img: '/images/chat/우연히.png',
    name: '망그러진 곰과 비밀의 다락방',
    currentmembernum: '50',
    lastchat: '망그러진 곰과팝업 가신 분 지금 굿즈 수량 얼마나남았을까요???',
    lastchattime: '오전 8시 30분'
  },
])


const members = ref([
  { name: '가나다', profile: '/images/chat/ping2.png', },
  { name: '카밀레아', profile: '/images/chat/ping3.png', },
  { name: '비빔비빔비미비미빔', profile: '/images/chat/ping4.png', },
  { name: '고양이강아지송아지 호라잉', profile: '/images/chat/ping5.png', },
  { name: '음', profile: '/images/chat/ping6.png', },
])



</script>

<style scoped>
@import url('/public/css/chat/chat.css');
</style>