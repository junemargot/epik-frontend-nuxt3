<template>
  <section class="feed">
    <div class="feed__header"> <!-- 맨 첫 줄-->
      <h1 class="feed__title">feed</h1>
      <!-- 검색창 -->
      <!-- <div class="feed__search"> -->
      <form class="feed__form">
        <input class="feed__input" type="text" placeholder="검색어를 입력해주세요">
        <label for="feed-search">
          <i class='bx bx-search'></i>
        </label>
        <input type="submit" value="submit" style="display: none;">
      </form>
      <!-- </div> -->
    </div>

    <div class="feed__menu"> <!--메뉴버튼 줄-->
      <div class="feed__menu-column">
        <!-- 'feed' 페이지에서 'is-active'가 자동으로 적용되며, 'is-inactive'는 'currentRoute'가 일치하지 않으면 적용됨 -->
        <!-- 'feed' 페이지에서 'is-active'가 자동으로 적용되며, 'is-inactive'는 'currentRoute'가 일치하지 않으면 적용됨 -->
        <RouterLink to="/feed" exact :class="{ 'is-inactive': currentRoute !== '/feed' }">
          <span :class="{ 'is-active': currentRoute === '/feed' }">all</span>
        </RouterLink>

        <!-- 'my' 페이지에서 'is-active'가 자동으로 적용되며, 'is-inactive'는 'currentRoute'가 일치하지 않으면 적용됨 -->
        <RouterLink to="/feed/my" exact :class="{ 'is-inactive': currentRoute !== '/feed/my' }">
          <span :class="{ 'is-active': currentRoute === '/feed/my' }">my</span>
        </RouterLink>
      </div>

      <div class="feed__menu-column">
        <span>pop-up</span>
        <span>concert</span>
        <span>musical</span>
        <span>exhibition</span>
      </div>
    </div>

    <div class="feed__container">
      <!-- ######### 피드 item(1) #########  -->
      <div class="feed__info-wrap">
        <div class="feed__info-inner"><!--inner-->
          <div class="feed__user">
            <div class="feed__user-profile"> <!--사진 아이디-->
              <img src="/images/동글이.jpg">
              <span>seungeun</span>
            </div>
            <!-- ######### click 이벤트 처리 #########  -->
            <div class="dropdown">
              <button @click="toggleDropdown">
                <i class='bx bx-dots-horizontal-rounded'></i>
              </button>
              <ul v-if="isDropdownOpen" class="dropdown-list">
                <li><button>수정</button></li>
                <li><button @click.prevent="feedRemove">삭제</button></li>
              </ul>
              <!-- ######### 삭제 모달 추가 #########  -->
              <div v-if="isDeleteFeedModalVisible" class="feed-modal" @click.self="closeModalOnOutsideClick">
                <div class="feed-modal__contents">
                  <h2 class="feed-modal__text">피드를 삭제하시겠습니까?</h2>
                  <div class="feed-modal__buttons">
                    <button @click.prevent="closeDeleteModal" class="feed-modal__cancel">취소</button>
                    <button @click.prevent="deleteFeed" class="feed-modal__delete">삭제</button>
                  </div>
                </div>
              </div>
              <!-- ######### 삭제 모달 추가 #########  -->
            </div>
            <!-- ######### click 이벤트 처리 #########  -->
          </div> <!-- feed__user end -->

          <div class="feed__image">
            <img src="/images/feed.jpg">
          </div>

          <div class="feed__icons">
            <!-- 좋아요 아이콘 -->
            <div class="feed__icons-column">
              <button class="feed__like-icon" @click="toggleLike">
                <i :class="['icon', isLiked ? 'bx bxs-heart' : 'bx bx-heart', { likeCheck: isLiked }]" />
              </button>
              <span>23</span>
            </div>
            <!-- 댓글 아이콘 -->
            <div class="feed__icons-column">
              <button class="feed__comment-icon" @click="toggleComment">
                <i class='bx bx-comment base-icon-style'></i>
              </button>
              <span>23</span>
            </div>
          </div>

          <div class="feed__content"> <!-- 피드 내용  -->
            <div class="feed__text">
              SPO & Tugan Sokhiev<br />
              무소륵스키 전람회의 그림 최고였다..!<br />
              <br />
              <br />
            </div>
            <div class="feed__tags">
              <a>#공연</a>
              <a>#태그</a>
              <a>#태그</a>
              <a>#태그</a>
            </div>
          </div>

          <div class="feed__footer"> <!-- 마지막 버튼 -->
            <button class="feed__comment-icon" @click.stop="toggleComment">댓글 모두 보기</button>
            <a><span>3 min ago</span></a>
          </div>

          <div v-if="isCommentVisible" class="comment">
            <div class="comment__divider"></div>

            <div class="comment__count-wrap">
              <span class="comment__label">댓글</span>
              <span class="comment__count">23</span>
            </div>

            <!-- 댓글 목록 -->
            <div class="comment__list">
              <div class="comment__item">
                <div class="comment__content-wrap">
                  <div class="comment__profile">
                    <img src="/images/동글이.jpg">
                  </div>
                  <div class="comment__details">
                    <div class="comment__info">
                      <span class="comment__username">두브로브니크</span>
                      <span class="comment__time">1시간전</span>
                    </div>
                    <div class="comment__text">
                      <span>넘넘 재밌다</span>
                    </div>
                  </div>
                </div>
                <!-- 댓글 내부 드롭다운 영역 계속 보이고 있으니깐 꺼주자 -->
                <div class="dropdown">
                  <button @click.stop="toggleCommentDropdown">
                    <i class='bx bx-dots-horizontal-rounded'></i>
                  </button>
                  <ul v-if="isCommentDropdownOpen" class="dropdown-list">
                    <li>
                      <button class="dropdown-reply" @click="openReplyForm">답글</button>
                    </li>
                    <li>
                      <button class="dropdown__report" @click.stop="openReportModal">신고</button>
                    </li>
                  </ul>
                </div>
              </div>
              <!-- 대댓글 입력 영역 -->
              <div class="comment__reply" v-if="isReplyFormOpen">
                <span class="comment__reply-id">제육뽁음</span>
                <form>
                  <textarea class="comment__reply-input" placeholder="댓글을 남겨보세요."></textarea>
                  <div class="comment__reply-buttons">
                    <button type="button" class="comment__reply-cancle" @click.stop="closeReplyForm">취소</button>
                    <button type="submit" @click.prevent="submitReply">등록</button>
                  </div>
                </form>
              </div>
            </div>

            <!-- 댓글 작성 영역 -->
            <div class="comment__form-wrap">
              <form class="comment__form">
                <input type="text" placeholder="댓글 달기..." class="comment__input" />
                <button class="comment__submit">게시</button>
              </form>
            </div>
          </div> <!-- comment -->
        </div><!-- one content -->
        <div class="feed__info-inner"><!--inner-->
          <div class="feed__user">
            <div class="feed__user-profile"> <!--사진 아이디-->
              <img src="/images/배추도사.png">
              <span>배추도사</span>
            </div>
            <!-- ######### click 이벤트 처리 #########  -->
            <div class="dropdown">
              <button @click="toggleDropdown">
                <i class='bx bx-dots-horizontal-rounded'></i>
              </button>
              <ul v-if="isDropdownOpen" class="dropdown-list">
                <li><button>수정</button></li>
                <li><button @click.prevent="feedRemove">삭제</button></li>
              </ul>
              <!-- ######### 삭제 모달 추가 #########  -->
              <div v-if="isDeleteFeedModalVisible" class="feed-modal" @click.self="closeModalOnOutsideClick">
                <div class="feed-modal__contents">
                  <h2 class="feed-modal__text">피드를 삭제하시겠습니까?</h2>
                  <div class="feed-modal__buttons">
                    <button @click.prevent="closeDeleteModal" class="feed-modal__cancel">취소</button>
                    <button @click.prevent="deleteFeed" class="feed-modal__delete">삭제</button>
                  </div>
                </div>
              </div>
              <!-- ######### 삭제 모달 추가 #########  -->
            </div>
            <!-- ######### click 이벤트 처리 #########  -->
          </div> <!-- feed__user end -->

          <div class="feed__image">
            <img src="/images/KakaoTalk_20241125_034418958.jpg">
          </div>

          <div class="feed__icons">
            <!-- 좋아요 아이콘 -->
            <div class="feed__icons-column">
              <button class="feed__like-icon" @click="toggleLike">
                <i :class="['icon', isLiked ? 'bx bxs-heart' : 'bx bx-heart', { likeCheck: isLiked }]" />
              </button>
              <span>25</span>
            </div>
            <!-- 댓글 아이콘 -->
            <div class="feed__icons-column">
              <button class="feed__comment-icon" @click="toggleComment">
                <i class='bx bx-comment base-icon-style'></i>
              </button>
              <span>18</span>
            </div>
          </div>

          <div class="feed__content"> <!-- 피드 내용  -->
            <div class="feed__text">
              냉동 스폰지밥<br />
              신기하당<br />
              <br />
              <br />
            </div>
            <div class="feed__tags">
              <a>#스폰지밥</a>
              <a>#전시회</a>
              <a>#나는</a>
              <a>#뚱이가</a>
              <a>#좋아</a>
            </div>
          </div>

          <div class="feed__footer"> <!-- 마지막 버튼 -->
            <button class="feed__comment-icon" @click.stop="toggleComment">댓글 모두 보기</button>
            <a><span>3 min ago</span></a>
          </div>

          <div v-if="isCommentVisible" class="comment">
            <div class="comment__divider"></div>

            <div class="comment__count-wrap">
              <span class="comment__label">댓글</span>
              <span class="comment__count">23</span>
            </div>

            <!-- 댓글 목록 -->
            <div class="comment__list">
              <div class="comment__item">
                <div class="comment__content-wrap">
                  <div class="comment__profile">
                    <img src="/images/동글이.jpg">
                  </div>
                  <div class="comment__details">
                    <div class="comment__info">
                      <span class="comment__username">두브로브니크</span>
                      <span class="comment__time">1시간전</span>
                    </div>
                    <div class="comment__text">
                      <span>넘넘 재밌다</span>
                    </div>
                  </div>
                </div>
                <!-- 댓글 내부 드롭다운 영역 계속 보이고 있으니깐 꺼주자 -->
                <div class="dropdown">
                  <button @click.stop="toggleCommentDropdown">
                    <i class='bx bx-dots-horizontal-rounded'></i>
                  </button>
                  <ul v-if="isCommentDropdownOpen" class="dropdown-list">
                    <li>
                      <button class="dropdown-reply" @click="openReplyForm">답글</button>
                    </li>
                    <li>
                      <button class="dropdown__report" @click.stop="openReportModal">신고</button>
                    </li>
                  </ul>
                </div>
              </div>
              <!-- 대댓글 입력 영역 -->
              <div class="comment__reply" v-if="isReplyFormOpen">
                <span class="comment__reply-id">seungeun</span>
                <form>
                  <textarea class="comment__reply-input" placeholder="댓글을 남겨보세요."></textarea>
                  <div class="comment__reply-buttons">
                    <button type="button" class="comment__reply-cancle" @click.stop="closeReplyForm">취소</button>
                    <button type="submit" @click.prevent="submitReply">등록</button>
                  </div>
                </form>
              </div>
            </div>

            <!-- 댓글 작성 영역 -->
            <div class="comment__form-wrap">
              <form class="comment__form">
                <input type="text" placeholder="댓글 달기..." class="comment__input" />
                <button class="comment__submit">게시</button>
              </form>
            </div>
          </div> <!-- comment -->
        </div>
        <div class="feed__info-inner"><!--inner-->
          <div class="feed__user">
            <div class="feed__user-profile"> <!--사진 아이디-->
              <img src="/images/나미리.jpg">
              <span>jeong</span>
            </div>
            <!-- ######### click 이벤트 처리 #########  -->
            <div class="dropdown">
              <button @click="toggleDropdown">
                <i class='bx bx-dots-horizontal-rounded'></i>
              </button>
              <ul v-if="isDropdownOpen" class="dropdown-list">
                <li><button>수정</button></li>
                <li><button @click.prevent="feedRemove">삭제</button></li>
              </ul>
              <!-- ######### 삭제 모달 추가 #########  -->
              <div v-if="isDeleteFeedModalVisible" class="feed-modal" @click.self="closeModalOnOutsideClick">
                <div class="feed-modal__contents">
                  <h2 class="feed-modal__text">피드를 삭제하시겠습니까?</h2>
                  <div class="feed-modal__buttons">
                    <button @click.prevent="closeDeleteModal" class="feed-modal__cancel">취소</button>
                    <button @click.prevent="deleteFeed" class="feed-modal__delete">삭제</button>
                  </div>
                </div>
              </div>
              <!-- ######### 삭제 모달 추가 #########  -->
            </div>
            <!-- ######### click 이벤트 처리 #########  -->
          </div> <!-- feed__user end -->

          <div class="feed__image">
            <img src="/images/KakaoTalk_20241125_033508175.jpg">
          </div>

          <div class="feed__icons">
            <!-- 좋아요 아이콘 -->
            <div class="feed__icons-column">
              <button class="feed__like-icon" @click="toggleLike">
                <i :class="['icon', isLiked ? 'bx bxs-heart' : 'bx bx-heart', { likeCheck: isLiked }]" />
              </button>
              <span>77</span>
            </div>
            <!-- 댓글 아이콘 -->
            <div class="feed__icons-column">
              <button class="feed__comment-icon" @click="toggleComment">
                <i class='bx bx-comment base-icon-style'></i>
              </button>
              <span>37</span>
            </div>
          </div>

          <div class="feed__content"> <!-- 피드 내용  -->
            <div class="feed__text">
              우연하게도 접한 클래식. 클래식은 고리타분하고 지루하다는 편견.<br>
              간접적으로라도 듣기를 꺼려했는데 지금은 모든 플레이리스트가 클래식으로 도배되는 기묘한 세월을 맞이하였다.<br>
              자주 드나든 익숙한 공연장이지만 그로 인해 참 특별한 공간이었음을 경험했다.<br>
              좀처럼 친숙하게 들려오지 않았던 시마노프스키의 곡을 들을 때는 급기야 눈물이 흐르고야 말았다.<br>
              눈물을 닦는 것 조차도 소리가 나서 연주에 방해가 될까 볼을 타고 내리는 눈물방울이 저절로 마르기를 내버려 두었다.<br>
              이렇게나 처절하고 아름다울 수 있다니.
              <br />
              <br />
            </div>
            <div class="feed__tags">
              <a>#공연</a>
              <a>#클래식</a>
              <a>#시마노프스키</a>

            </div>
          </div>

          <div class="feed__footer"> <!-- 마지막 버튼 -->
            <button class="feed__comment-icon" @click.stop="toggleComment">댓글 모두 보기</button>
            <a><span>7 min ago</span></a>
          </div>

          <div v-if="isCommentVisible" class="comment">
            <div class="comment__divider"></div>

            <div class="comment__count-wrap">
              <span class="comment__label">댓글</span>
              <span class="comment__count">3</span>
            </div>

            <!-- 댓글 목록 -->
            <div class="comment__list">
              <div class="comment__item">
                <div class="comment__content-wrap">
                  <div class="comment__profile">
                    <img src="/images/동글이.jpg">
                  </div>
                  <div class="comment__details">
                    <div class="comment__info">
                      <span class="comment__username">파인애플</span>
                      <span class="comment__time">6분전</span>
                    </div>
                    <div class="comment__text">
                      <span>넘넘 재밌다</span>
                    </div>
                  </div>
                </div>
                <!-- 댓글 내부 드롭다운 영역 계속 보이고 있으니깐 꺼주자 -->
                <div class="dropdown">
                  <button @click.stop="toggleCommentDropdown">
                    <i class='bx bx-dots-horizontal-rounded'></i>
                  </button>
                  <ul v-if="isCommentDropdownOpen" class="dropdown-list">
                    <li>
                      <button class="dropdown-reply" @click="openReplyForm">답글</button>
                    </li>
                    <li>
                      <button class="dropdown__report" @click.stop="openReportModal">신고</button>
                    </li>
                  </ul>
                </div>
              </div>
              <!-- 대댓글 입력 영역 -->
              <div class="comment__reply" v-if="isReplyFormOpen">
                <span class="comment__reply-id">ben</span>
                <form>
                  <textarea class="comment__reply-input" placeholder="댓글을 남겨보세요."></textarea>
                  <div class="comment__reply-buttons">
                    <button type="button" class="comment__reply-cancle" @click.stop="closeReplyForm">취소</button>
                    <button type="submit" @click.prevent="submitReply">등록</button>
                  </div>
                </form>
              </div>
            </div>

            <!-- 댓글 작성 영역 -->
            <div class="comment__form-wrap">
              <form class="comment__form">
                <input type="text" placeholder="댓글 달기..." class="comment__input" />
                <button class="comment__submit">게시</button>
              </form>
            </div>
          </div> <!-- comment -->
        </div>
        <div class="feed__info-inner"><!--inner-->
          <div class="feed__user">
            <div class="feed__user-profile"> <!--사진 아이디-->
              <img src="/images/83416251-파인애플.jpg">
              <span>파인애플</span>
            </div>
            <!-- ######### click 이벤트 처리 #########  -->
            <div class="dropdown">
              <button @click="toggleDropdown">
                <i class='bx bx-dots-horizontal-rounded'></i>
              </button>
              <ul v-if="isDropdownOpen" class="dropdown-list">
                <li><button>수정</button></li>
                <li><button @click.prevent="feedRemove">삭제</button></li>
              </ul>
              <!-- ######### 삭제 모달 추가 #########  -->
              <div v-if="isDeleteFeedModalVisible" class="feed-modal" @click.self="closeModalOnOutsideClick">
                <div class="feed-modal__contents">
                  <h2 class="feed-modal__text">피드를 삭제하시겠습니까?</h2>
                  <div class="feed-modal__buttons">
                    <button @click.prevent="closeDeleteModal" class="feed-modal__cancel">취소</button>
                    <button @click.prevent="deleteFeed" class="feed-modal__delete">삭제</button>
                  </div>
                </div>
              </div>
              <!-- ######### 삭제 모달 추가 #########  -->
            </div>
            <!-- ######### click 이벤트 처리 #########  -->
          </div> <!-- feed__user end -->

          <div class="feed__image">
            <img src="/images/KakaoTalk_20241125_034131221.jpg">
          </div>

          <div class="feed__icons">
            <!-- 좋아요 아이콘 -->
            <div class="feed__icons-column">
              <button class="feed__like-icon" @click="toggleLike">
                <i :class="['icon', isLiked ? 'bx bxs-heart' : 'bx bx-heart', { likeCheck: isLiked }]" />
              </button>
              <span>111</span>
            </div>
            <!-- 댓글 아이콘 -->
            <div class="feed__icons-column">
              <button class="feed__comment-icon" @click="toggleComment">
                <i class='bx bx-comment base-icon-style'></i>
              </button>
              <span>23</span>
            </div>
          </div>

          <div class="feed__content"> <!-- 피드 내용  -->
            <div class="feed__text">
              9년 만에 열린 비 콘서트 ㅠㅠㅠ <br>
              너무 신나고 행복했다.
              <br />
              <br />
            </div>
            <div class="feed__tags">
              <a>#비와구름</a>
              <a>#구름11기</a>
              <a>#Still Raining</a>
            </div>
          </div>

          <div class="feed__footer"> <!-- 마지막 버튼 -->
            <button class="feed__comment-icon" @click.stop="toggleComment">댓글 모두 보기</button>
            <a><span>3 hours ago</span></a>
          </div>

          <div v-if="isCommentVisible" class="comment">
            <div class="comment__divider"></div>

            <div class="comment__count-wrap">
              <span class="comment__label">댓글</span>
              <span class="comment__count">11</span>
            </div>

            <!-- 댓글 목록 -->
            <div class="comment__list">
              <div class="comment__item">
                <div class="comment__content-wrap">
                  <div class="comment__profile">
                    <img src="/images/동글이.jpg">
                  </div>
                  <div class="comment__details">
                    <div class="comment__info">
                      <span class="comment__username">두브로브니크</span>
                      <span class="comment__time">1시간전</span>
                    </div>
                    <div class="comment__text">
                      <span>넘넘 재밌다</span>
                    </div>
                  </div>
                </div>
                <!-- 댓글 내부 드롭다운 영역 계속 보이고 있으니깐 꺼주자 -->
                <div class="dropdown">
                  <button @click.stop="toggleCommentDropdown">
                    <i class='bx bx-dots-horizontal-rounded'></i>
                  </button>
                  <ul v-if="isCommentDropdownOpen" class="dropdown-list">
                    <li>
                      <button class="dropdown-reply" @click="openReplyForm">답글</button>
                    </li>
                    <li>
                      <button class="dropdown__report" @click.stop="openReportModal">신고</button>
                    </li>
                  </ul>
                </div>
              </div>
              <!-- 대댓글 입력 영역 -->
              <div class="comment__reply" v-if="isReplyFormOpen">
                <span class="comment__reply-id">seungeun</span>
                <form>
                  <textarea class="comment__reply-input" placeholder="댓글을 남겨보세요."></textarea>
                  <div class="comment__reply-buttons">
                    <button type="button" class="comment__reply-cancle" @click.stop="closeReplyForm">취소</button>
                    <button type="submit" @click.prevent="submitReply">등록</button>
                  </div>
                </form>
              </div>
            </div>

            <!-- 댓글 작성 영역 -->
            <div class="comment__form-wrap">
              <form class="comment__form">
                <input type="text" placeholder="댓글 달기..." class="comment__input" />
                <button class="comment__submit">게시</button>
              </form>
            </div>
          </div> <!-- comment -->
        </div>
        <div class="feed__info-inner"><!--inner-->
          <div class="feed__user">
            <div class="feed__user-profile"> <!--사진 아이디-->
              <img src="/images/다운로드.jpg">
              <span>yeo</span>
            </div>
            <!-- ######### click 이벤트 처리 #########  -->
            <div class="dropdown">
              <button @click="toggleDropdown">
                <i class='bx bx-dots-horizontal-rounded'></i>
              </button>
              <ul v-if="isDropdownOpen" class="dropdown-list">
                <li><button>수정</button></li>
                <li><button @click.prevent="feedRemove">삭제</button></li>
              </ul>
              <!-- ######### 삭제 모달 추가 #########  -->
              <div v-if="isDeleteFeedModalVisible" class="feed-modal" @click.self="closeModalOnOutsideClick">
                <div class="feed-modal__contents">
                  <h2 class="feed-modal__text">피드를 삭제하시겠습니까?</h2>
                  <div class="feed-modal__buttons">
                    <button @click.prevent="closeDeleteModal" class="feed-modal__cancel">취소</button>
                    <button @click.prevent="deleteFeed" class="feed-modal__delete">삭제</button>
                  </div>
                </div>
              </div>
              <!-- ######### 삭제 모달 추가 #########  -->
            </div>
            <!-- ######### click 이벤트 처리 #########  -->
          </div> <!-- feed__user end -->


          <div class="feed__image">
            <img src="/images/KakaoTalk_20241125_033811741.jpg">
          </div>

          <div class="feed__icons">
            <!-- 좋아요 아이콘 -->
            <div class="feed__icons-column">
              <button class="feed__like-icon" @click="toggleLike">
                <i :class="['icon', isLiked ? 'bx bxs-heart' : 'bx bx-heart', { likeCheck: isLiked }]" />
              </button>
              <span>26</span>
            </div>
            <!-- 댓글 아이콘 -->
            <div class="feed__icons-column">
              <button class="feed__comment-icon" @click="toggleComment">
                <i class='bx bx-comment base-icon-style'></i>
              </button>
              <span>8</span>
            </div>
          </div>

          <div class="feed__content"> <!-- 피드 내용  -->
            <div class="feed__text">
              홍대 메이드바이에서 석새날 팝업하길래 다녀왔당.<br>
              귀여운 것들을 보면 기분이 좋아용🤎
              <br />
              <br />
            </div>
            <div class="feed__tags">
              <a>#문구</a>
              <a>#팝업</a>
              <a>#기여운게</a>
              <a>#최고야</a>
            </div>
          </div>

          <div class="feed__footer"> <!-- 마지막 버튼 -->
            <button class="feed__comment-icon" @click.stop="toggleComment">댓글 모두 보기</button>
            <a><span>3 min ago</span></a>
          </div>

          <div v-if="isCommentVisible" class="comment">
            <div class="comment__divider"></div>

            <div class="comment__count-wrap">
              <span class="comment__label">댓글</span>
              <span class="comment__count">23</span>
            </div>

            <!-- 댓글 목록 -->
            <div class="comment__list">
              <div class="comment__item">
                <div class="comment__content-wrap">
                  <div class="comment__profile">
                    <img src="/images/동글이.jpg">
                  </div>
                  <div class="comment__details">
                    <div class="comment__info">
                      <span class="comment__username">두브로브니크</span>
                      <span class="comment__time">1시간전</span>
                    </div>
                    <div class="comment__text">
                      <span>넘넘 재밌다</span>
                    </div>
                  </div>
                </div>
                <!-- 댓글 내부 드롭다운 영역 계속 보이고 있으니깐 꺼주자 -->
                <div class="dropdown">
                  <button @click.stop="toggleCommentDropdown">
                    <i class='bx bx-dots-horizontal-rounded'></i>
                  </button>
                  <ul v-if="isCommentDropdownOpen" class="dropdown-list">
                    <li>
                      <button class="dropdown-reply" @click="openReplyForm">답글</button>
                    </li>
                    <li>
                      <button class="dropdown__report" @click.stop="openReportModal">신고</button>
                    </li>
                  </ul>
                </div>
              </div>
              <!-- 대댓글 입력 영역 -->
              <div class="comment__reply" v-if="isReplyFormOpen">
                <span class="comment__reply-id">seungeun</span>
                <form>
                  <textarea class="comment__reply-input" placeholder="댓글을 남겨보세요."></textarea>
                  <div class="comment__reply-buttons">
                    <button type="button" class="comment__reply-cancle" @click.stop="closeReplyForm">취소</button>
                    <button type="submit" @click.prevent="submitReply">등록</button>
                  </div>
                </form>
              </div>
            </div>

            <!-- 댓글 작성 영역 -->
            <div class="comment__form-wrap">
              <form class="comment__form">
                <input type="text" placeholder="댓글 달기..." class="comment__input" />
                <button class="comment__submit">게시</button>
              </form>
            </div>
          </div> <!-- comment -->
        </div>
        <div class="feed__info-inner"><!--inner-->
          <div class="feed__user">
            <div class="feed__user-profile"> <!--사진 아이디-->
              <img src="/images/오리.jpg">
              <span>오리</span>
            </div>
            <!-- ######### click 이벤트 처리 #########  -->
            <div class="dropdown">
              <button @click="toggleDropdown">
                <i class='bx bx-dots-horizontal-rounded'></i>
              </button>
              <ul v-if="isDropdownOpen" class="dropdown-list">
                <li><button>수정</button></li>
                <li><button @click.prevent="feedRemove">삭제</button></li>
              </ul>
              <!-- ######### 삭제 모달 추가 #########  -->
              <div v-if="isDeleteFeedModalVisible" class="feed-modal" @click.self="closeModalOnOutsideClick">
                <div class="feed-modal__contents">
                  <h2 class="feed-modal__text">피드를 삭제하시겠습니까?</h2>
                  <div class="feed-modal__buttons">
                    <button @click.prevent="closeDeleteModal" class="feed-modal__cancel">취소</button>
                    <button @click.prevent="deleteFeed" class="feed-modal__delete">삭제</button>
                  </div>
                </div>
              </div>
              <!-- ######### 삭제 모달 추가 #########  -->
            </div>
            <!-- ######### click 이벤트 처리 #########  -->
          </div> <!-- feed__user end -->

          <div class="feed__image">
            <img src="/images/KakaoTalk_20241125_034217645.jpg">
          </div>

          <div class="feed__icons">
            <!-- 좋아요 아이콘 -->
            <div class="feed__icons-column">
              <button class="feed__like-icon" @click="toggleLike">
                <i :class="['icon', isLiked ? 'bx bxs-heart' : 'bx bx-heart', { likeCheck: isLiked }]" />
              </button>
              <span>56</span>
            </div>
            <!-- 댓글 아이콘 -->
            <div class="feed__icons-column">
              <button class="feed__comment-icon" @click="toggleComment">
                <i class='bx bx-comment base-icon-style'></i>
              </button>
              <span>8</span>
            </div>
          </div>

          <div class="feed__content"> <!-- 피드 내용  -->
            <div class="feed__text">
              내가 제일 좋아하는 작곡가 구스타프 말러. <br>
              말러의 교향곡은 대체로 1번과 2번이 인기가 많은데 이번 공연을 통해 3번을 처음 들어봤는데 너무 재치있으면서도 아름다운 곡이다. <br>
              한 시간에 가까운 긴 곡이지만 하나도 지루하지 않았다~!
              <br />
              <br />
            </div>
            <div class="feed__tags">
              <a>#잉끼많은지휘자잉끼넨</a>
              <a>#K향</a>
            </div>
          </div>

          <div class="feed__footer"> <!-- 마지막 버튼 -->
            <button class="feed__comment-icon" @click.stop="toggleComment">댓글 모두 보기</button>
            <a><span>3 min ago</span></a>
          </div>

          <div v-if="isCommentVisible" class="comment">
            <div class="comment__divider"></div>

            <div class="comment__count-wrap">
              <span class="comment__label">댓글</span>
              <span class="comment__count">23</span>
            </div>

            <!-- 댓글 목록 -->
            <div class="comment__list">
              <div class="comment__item">
                <div class="comment__content-wrap">
                  <div class="comment__profile">
                    <img src="/images/동글이.jpg">
                  </div>
                  <div class="comment__details">
                    <div class="comment__info">
                      <span class="comment__username">두브로브니크</span>
                      <span class="comment__time">1시간전</span>
                    </div>
                    <div class="comment__text">
                      <span>넘넘 재밌다</span>
                    </div>
                  </div>
                </div>
                <!-- 댓글 내부 드롭다운 영역 계속 보이고 있으니깐 꺼주자 -->
                <div class="dropdown">
                  <button @click.stop="toggleCommentDropdown">
                    <i class='bx bx-dots-horizontal-rounded'></i>
                  </button>
                  <ul v-if="isCommentDropdownOpen" class="dropdown-list">
                    <li>
                      <button class="dropdown-reply" @click="openReplyForm">답글</button>
                    </li>
                    <li>
                      <button class="dropdown__report" @click.stop="openReportModal">신고</button>
                    </li>
                  </ul>
                </div>
              </div>
              <!-- 대댓글 입력 영역 -->
              <div class="comment__reply" v-if="isReplyFormOpen">
                <span class="comment__reply-id">seungeun</span>
                <form>
                  <textarea class="comment__reply-input" placeholder="댓글을 남겨보세요."></textarea>
                  <div class="comment__reply-buttons">
                    <button type="button" class="comment__reply-cancle" @click.stop="closeReplyForm">취소</button>
                    <button type="submit" @click.prevent="submitReply">등록</button>
                  </div>
                </form>
              </div>
            </div>

            <!-- 댓글 작성 영역 -->
            <div class="comment__form-wrap">
              <form class="comment__form">
                <input type="text" placeholder="댓글 달기..." class="comment__input" />
                <button class="comment__submit">게시</button>
              </form>
            </div>
          </div> <!-- comment -->
        </div>
        <div class="feed__info-inner"><!--inner-->
          <div class="feed__user">
            <div class="feed__user-profile"> <!--사진 아이디-->
              <img src="/images/빵빵이.jpg">
              <span>빵빵이</span>
            </div>
            <!-- ######### click 이벤트 처리 #########  -->
            <div class="dropdown">
              <button @click="toggleDropdown">
                <i class='bx bx-dots-horizontal-rounded'></i>
              </button>
              <ul v-if="isDropdownOpen" class="dropdown-list">
                <li><button>수정</button></li>
                <li><button @click.prevent="feedRemove">삭제</button></li>
              </ul>
              <!-- ######### 삭제 모달 추가 #########  -->
              <div v-if="isDeleteFeedModalVisible" class="feed-modal" @click.self="closeModalOnOutsideClick">
                <div class="feed-modal__contents">
                  <h2 class="feed-modal__text">피드를 삭제하시겠습니까?</h2>
                  <div class="feed-modal__buttons">
                    <button @click.prevent="closeDeleteModal" class="feed-modal__cancel">취소</button>
                    <button @click.prevent="deleteFeed" class="feed-modal__delete">삭제</button>
                  </div>
                </div>
              </div>
              <!-- ######### 삭제 모달 추가 #########  -->
            </div>
            <!-- ######### click 이벤트 처리 #########  -->
          </div> <!-- feed__user end -->

          <div class="feed__image">
            <img src="/images/KakaoTalk_20241125_034814523.jpg">
          </div>

          <div class="feed__icons">
            <!-- 좋아요 아이콘 -->
            <div class="feed__icons-column">
              <button class="feed__like-icon" @click="toggleLike">
                <i :class="['icon', isLiked ? 'bx bxs-heart' : 'bx bx-heart', { likeCheck: isLiked }]" />
              </button>
              <span>26</span>
            </div>
            <!-- 댓글 아이콘 -->
            <div class="feed__icons-column">
              <button class="feed__comment-icon" @click="toggleComment">
                <i class='bx bx-comment base-icon-style'></i>
              </button>
              <span>3</span>
            </div>
          </div>

          <div class="feed__content"> <!-- 피드 내용  -->
            <div class="feed__text">
              옥지얌..!<br />
              <br />
              <br />
            </div>
            <div class="feed__tags">
              <a>#팝업</a>
              <a>#굿즈</a>
              <a>#빵빵이</a>
              <a>#더현대</a>
            </div>
          </div>

          <div class="feed__footer"> <!-- 마지막 버튼 -->
            <button class="feed__comment-icon" @click.stop="toggleComment">댓글 모두 보기</button>
            <a><span>7 hours ago</span></a>
          </div>

          <div v-if="isCommentVisible" class="comment">
            <div class="comment__divider"></div>

            <div class="comment__count-wrap">
              <span class="comment__label">댓글</span>
              <span class="comment__count">1</span>
            </div>

            <!-- 댓글 목록 -->
            <div class="comment__list">
              <div class="comment__item">
                <div class="comment__content-wrap">
                  <div class="comment__profile">
                    <img src="/images/동글이.jpg">
                  </div>
                  <div class="comment__details">
                    <div class="comment__info">
                      <span class="comment__username">두브로브니크</span>
                      <span class="comment__time">1시간전</span>
                    </div>
                    <div class="comment__text">
                      <span>넘넘 재밌다</span>
                    </div>
                  </div>
                </div>
                <!-- 댓글 내부 드롭다운 영역 계속 보이고 있으니깐 꺼주자 -->
                <div class="dropdown">
                  <button @click.stop="toggleCommentDropdown">
                    <i class='bx bx-dots-horizontal-rounded'></i>
                  </button>
                  <ul v-if="isCommentDropdownOpen" class="dropdown-list">
                    <li>
                      <button class="dropdown-reply" @click="openReplyForm">답글</button>
                    </li>
                    <li>
                      <button class="dropdown__report" @click.stop="openReportModal">신고</button>
                    </li>
                  </ul>
                </div>
              </div>
              <!-- 대댓글 입력 영역 -->
              <div class="comment__reply" v-if="isReplyFormOpen">
                <span class="comment__reply-id">seungeun</span>
                <form>
                  <textarea class="comment__reply-input" placeholder="댓글을 남겨보세요."></textarea>
                  <div class="comment__reply-buttons">
                    <button type="button" class="comment__reply-cancle" @click.stop="closeReplyForm">취소</button>
                    <button type="submit" @click.prevent="submitReply">등록</button>
                  </div>
                </form>
              </div>
            </div>

            <!-- 댓글 작성 영역 -->
            <div class="comment__form-wrap">
              <form class="comment__form">
                <input type="text" placeholder="댓글 달기..." class="comment__input" />
                <button class="comment__submit">게시</button>
              </form>
            </div>
          </div> <!-- comment -->
        </div>

      </div> <!-- feed__info-wrap -->
    </div>

    <!-- 신고 모달 코드 -->
    <div class="modal-report" v-if="isReportModalOpen">
      <div class=" modal-report__contents">
        <h3 class="modal-report__title">신고하기</h3>
        <span class="modal-report__subtitle">신고 사유 선택</span>
        <form class="modal-report__form">
          <div class="modal-report__radio-group">
            <div class="modal-report__radio-item">
              <input type="radio" id="reason1" name="report-reason">
              <label for="reason1">욕설, 비방, 차별, 혐오</label>
            </div>
            <div class="modal-report__radio-item">
              <input type="radio" id="reason2" name="report-reason">
              <label for="reason2">홍보, 영리목적</label>
            </div>
            <div class="modal-report__radio-item">
              <input type="radio" id="reason3" name="report-reason">
              <label for="reason3">불법 정보</label>
            </div>
            <div class="modal-report__radio-item">
              <input type="radio" id="reason4" name="report-reason">
              <label for="reason4">음란, 청소년 유해</label>
            </div>
            <div class="modal-report__radio-item">
              <input type="radio" id="reason5" name="report-reason">
              <label for="reason5">개인 정보 유출, 유포, 거래</label>
            </div>
            <div class="modal-report__radio-item">
              <input type="radio" id="reason6" name="report-reason">
              <label for="reason6">도배, 스팸</label>
            </div>
            <div class="modal-report__radio-item">
              <input class="report-reason" type="radio" id="reason7" name="report-reason">
              <label class="report-reason" for="reason7">기타</label>
              <div class="modal-report__text-input">
                <textarea placeholder="신고 사유를 직접 입력해주세요.(최대 500자)"></textarea>
              </div>
            </div>
          </div>
          <p class="modal-report__warning">
            ** 허위 신고일 경우, 신고자의 서비스 활동이 제한될 수 있습니다.<br>
            이 점 유의하시어 신중하게 신고해주세요.
          </p>
          <div class="modal-report__buttons">
            <button type="button" class="modal-report__cancel" @click="closeReportModal">취소</button>
            <button type="button" class="modal-report__check" @click.stop="confirmReport">확인</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 신고 확인 모달 코드 -->
    <div class="modal-check" v-if="isReportCheckModalOpen">
      <div class="modal-check__contents">
        <h2 class="modal-check__title">신고가 완료되었습니다.</h2>
        <p class="modal-check__text">
          신고해주셔서 감사합니다.<br>
          <br>
          보내주신 신고는 EPIK에서 빠르게 확인 후<br> 처리하도록 하겠습니다!<br>
          <br>
          EPIK을 이용해주셔서 감사합니다.
        </p>
        <button class="modal-check__close" @click.stop="closeReportCheckModal">확인</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
// 현재 경로를 추적
const currentRoute = computed(() => route.path);


// ######### user dorpdown click 이벤트 처리 #########
const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  console.log('드롭다운 버튼 클릭');
  isDropdownOpen.value = !isDropdownOpen.value;
  console.log(isDropdownOpen.value);
}


// ######### user dorpdown delete click 이벤트 처리 #########
// modal open
const isDeleteFeedModalVisible = ref(false);

const feedRemove = () => {
  console.log('드롭다운 삭제 버튼 클릭시 삭제 모달 열림');
  isDropdownOpen.value = false;
  isDeleteFeedModalVisible.value = !isDeleteFeedModalVisible.value
}

// modal 삭제 버튼을 클릭하면 -> 모달이 닫히는 메서드 호출
const deleteFeed = () => {
  console.log('삭제모달 삭제 버튼 클릭');
  hideFeedDeleteModal();
}

// 취소 버튼 클릭시 모달 닫히게
const closeDeleteModal = () => {
  hideFeedDeleteModal();
}

// 삭제 모달 닫히는 메서드 정의
const hideFeedDeleteModal = () => {
  isDeleteFeedModalVisible.value = false;
}

const closeModalOnOutsideClick = (e) => {
  if (e.target === e.currentTarget) {
    hideFeedDeleteModal();
  }
};

// ######### 좋아요 아이콘 이벤트 처리 #########
const isLiked = ref(false);

const toggleLike = () => {
  isLiked.value = !isLiked.value;
}

// ######### 댓글 창 이벤트 처리 #########
const isCommentVisible = ref(false);

const toggleComment = () => {
  event.stopPropagation(); // 이벤트 버블링 방지
  isCommentVisible.value = !isCommentVisible.value;
}


// ######### 댓글 창 dropdown 이벤트 처리 #########
const isCommentDropdownOpen = ref(false);

const toggleCommentDropdown = (e) => {
  e.stopPropagation(); // 이벤트 버블링 방지
  isCommentDropdownOpen.value = !isCommentDropdownOpen.value;
}


// ######### 신고모달 ######### 
const isReportModalOpen = ref(false);
const isReportCheckModalOpen = ref(false);

const openReportModal = () => {
  isReportModalOpen.value = !isReportModalOpen.value
  isCommentVisible.value = false;
}

const closeReportModal = () => {
  isReportModalOpen.value = false;
}

const confirmReport = () => {
  closeReportModal();
  isReportCheckModalOpen.value = !isReportCheckModalOpen.value;
}

const closeReportCheckModal = () => {
  isReportCheckModalOpen.value = false;
}

// ######### 대댓글 창  ######### 
const isReplyFormOpen = ref(false);

// 대댓글창 열기
const openReplyForm = () => {
  console.log('대댓글창 클릭 성공')
  isReplyFormOpen.value = !isReplyFormOpen.value;
}

// 취소 버튼 클릭
const closeReplyForm = () => {
  isReplyFormOpen.value = false;
}

// 등록 버튼 클릭
const submitReply = (e) => {
  e.stopPropagation(); // 이벤트 버블링 방지
  isReplyFormOpen.value = false;
}


// ######### 외부영역클릭시 닫기 #########
const handleOutsideClick = (e) => {
  // feed dropdown 
  if (!e.target.closest('.dropdown')) {
    isDropdownOpen.value = false;
  }
  // comment
  if (isCommentVisible.value && !e.target.closest('.comment') && !e.target.closest('.feed__comment-icon')) {
    isCommentVisible.value = false;
  }
  // comment dropdown
  if (isCommentDropdownOpen.value && !e.target.closest('.comment-dropdown')) {
    isCommentDropdownOpen.value = false;
  }
  // reportcheck modal
  if (isReportCheckModalOpen.value && !e.target.closest('mldao-check')) {
    isReportCheckModalOpen.value = false;
  }
}

// ######### hook ######### 
onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
});

</script>

<style scoped>
@import url('public/css/feed/index.css');
@import url('public/css/feed/check-report-modal.css');
@import url('public/css/feed/report-modal.css');
</style>