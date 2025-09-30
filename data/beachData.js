export const beaches = [
  {
    id: "haeundae",
    name: "해운대 해수욕장",
    region: "부산 해운대구",
    status: "safe",
    seaTemperature: 23.4,
    waveHeight: 0.6,
    windSpeed: 3.2,
    ripCurrentRisk: "낮음",
    jellyfishAlert: "관심",
    safetyNotes: ["오전 10시부터 안전요원 상시 배치", "해양경찰 순찰 차량 30분 간격 운행"],
    emergencyContacts: [
      { type: "안전요원 본부", phone: "051-123-4567" },
      { type: "해운대 해양경찰", phone: "112" }
    ],
    amenities: ["샤워장 5곳", "탈의실 3곳", "물놀이 용품 대여"],
    events: [
      {
        name: "해운대 모래축제",
        date: "6월 15일 - 6월 23일",
        description: "샌드 보딩 체험, 야간 라이브 공연, 드론 라이트 쇼"
      },
      {
        name: "썸머 무비 나이트",
        date: "7월 매주 토요일",
        description: "해변에서 즐기는 야외 영화 상영"
      }
    ],
    buddyPosts: [
      {
        title: "새벽 서핑 같이 하실 분",
        author: "연구원 김민수",
        message: "06:00 입수 예정, 장비 대여 가능, 초보 환영"
      },
      {
        title: "야간 피크닉 팀 모집",
        author: "부산살아요",
        message: "저녁 7시 모래사장, 간단한 보드게임 함께해요"
      }
    ],
    sports: [
      {
        name: "스탠드업 패들보드",
        difficulty: "초급",
        contact: "해운대 워터클럽 051-345-9876"
      },
      {
        name: "바나나보트",
        difficulty: "가족형",
        contact: "썸머웨이브 051-781-2234"
      }
    ],
    personalizedTips: [
      "일출 시간은 오전 5시 15분. 일찍 방문하면 한적한 분위기를 즐길 수 있어요.",
      "해운대 전통시장과 연계한 먹거리 투어를 추천합니다."
    ]
  },
  {
    id: "gwangalli",
    name: "광안리 해수욕장",
    region: "부산 수영구",
    status: "caution",
    seaTemperature: 22.1,
    waveHeight: 1.1,
    windSpeed: 5.6,
    ripCurrentRisk: "중간",
    jellyfishAlert: "주의",
    safetyNotes: [
      "오후 2시 이후 파고 증가 예상",
      "광안대교 인근 구역 출입 제한: 드론 촬영 행사"
    ],
    emergencyContacts: [
      { type: "안내 센터", phone: "051-765-4321" },
      { type: "수영구청 재난 상황실", phone: "051-610-4000" }
    ],
    amenities: ["무장애 데크 산책로", "반려견 동반 구역", "무료 공공 와이파이"],
    events: [
      {
        name: "광안리 드론 라이트 쇼",
        date: "상시 주말",
        description: "국내 최대 규모의 정기 드론 불빛 공연"
      },
      {
        name: "비치 클린업 데이",
        date: "6월 29일",
        description: "시민 참여형 해변 정화 캠페인"
      }
    ],
    buddyPosts: [
      {
        title: "야경 촬영 크루 구합니다",
        author: "사진가 최지훈",
        message: "삼각대 공유 가능, 20시 광안대교 앞 집결"
      },
      {
        title: "비치 발리볼 팀",
        author: "광안리주민",
        message: "매주 수/금 19시 연습, 초보 환영"
      }
    ],
    sports: [
      {
        name: "요트 세일링 체험",
        difficulty: "체험형",
        contact: "광안리 요트투어 051-555-4412"
      },
      {
        name: "카약 나이트 투어",
        difficulty: "초중급",
        contact: "문탠로드 카약 051-889-7771"
      }
    ],
    personalizedTips: [
      "야경 명소로 유명한 만큼, 삼각대와 망원 렌즈를 준비하면 좋아요.",
      "광안리 해변로 카페 거리에서 야간 라이브 공연을 즐겨보세요."
    ]
  },
  {
    id: "songjeong",
    name: "송정 해수욕장",
    region: "부산 해운대구",
    status: "safe",
    seaTemperature: 21.7,
    waveHeight: 0.8,
    windSpeed: 4.0,
    ripCurrentRisk: "낮음",
    jellyfishAlert: "관심",
    safetyNotes: [
      "송정포구 인근 야간 취사 금지",
      "서핑 강습 구역과 일반 물놀이 구역이 분리되어 있어요"
    ],
    emergencyContacts: [
      { type: "송정 안전센터", phone: "051-123-1109" },
      { type: "해운대구청 관광과", phone: "051-749-7641" }
    ],
    amenities: ["서핑 보드 렌탈샵 다수", "주차장 실시간 잔여석 안내", "캠핑 가능 구역"],
    events: [
      {
        name: "송정 서핑 페스티벌",
        date: "7월 6일 - 7월 7일",
        description: "서핑 대회, 보드 시연, 해양 안전 워크숍"
      },
      {
        name: "해변 요가 클래스",
        date: "매주 일요일 08:00",
        description: "현지 요가 강사와 함께 하는 모닝 요가"
      }
    ],
    buddyPosts: [
      {
        title: "초보 서핑 클래스 같이 들을 분",
        author: "서핑입문자",
        message: "10시 강습, 장비 대여 포함, 3명 모집"
      },
      {
        title: "드론 촬영 협업",
        author: "콘텐츠제작자",
        message: "서핑 영상 함께 제작하실 분 연락주세요"
      }
    ],
    sports: [
      {
        name: "서핑 강습",
        difficulty: "초중급",
        contact: "송정서프스쿨 051-123-9090"
      },
      {
        name: "프리다이빙 체험",
        difficulty: "중급",
        contact: "딥블루다이브 051-333-8880"
      }
    ],
    personalizedTips: [
      "물때 확인 후 방문하면 더 좋은 파도를 만날 수 있어요.",
      "송정포구 횟집 거리에서 신선한 해산물을 맛보세요."
    ]
  }
];

export const featuredEvents = [
  {
    beachId: "haeundae",
    title: "해운대 해양안전 캠프",
    date: "6월 18일",
    description: "해양경찰과 함께하는 안전 체험 프로그램",
    tags: ["가족", "체험"]
  },
  {
    beachId: "gwangalli",
    title: "비치 요가 & 명상",
    date: "6월 25일",
    description: "해질녘 광안리에서 즐기는 웰니스 프로그램",
    tags: ["웰니스", "무료"]
  },
  {
    beachId: "songjeong",
    title: "서핑 입문 원데이 클래스",
    date: "6월 21일",
    description: "전문 강사진과 함께 안전한 서핑 체험",
    tags: ["서핑", "초보환영"]
  }
];

export const buddyBoardPosts = [
  {
    title: "해양 쓰레기 줍깅 번개",
    beach: "해운대",
    time: "6월 16일 09:00",
    message: "함께 쓰레기 줍고 브런치하실 분 모집해요",
    tags: ["환경", "봉사"]
  },
  {
    title: "비치 사운드 피크닉",
    beach: "광안리",
    time: "6월 22일 18:30",
    message: "감성 플레이리스트 공유하면서 피크닉 해요",
    tags: ["음악", "피크닉"]
  },
  {
    title: "프리다이빙 버디",
    beach: "송정",
    time: "6월 29일 07:30",
    message: "안전한 버디 다이빙 함께 하실 분 연락주세요",
    tags: ["다이빙", "중급"]
  }
];

export const marineSportsGuides = [
  {
    title: "부산 서핑 레벨 가이드",
    description: "파도 크기와 수온에 따라 입문 · 중급 · 상급 포인트를 확인하세요."
  },
  {
    title: "패들보드 안전 수칙",
    description: "구명조끼 착용, 기상 체크, 리쉬 스트랩 확인은 필수!"
  },
  {
    title: "야간 해변 활동 체크리스트",
    description: "야간 조명 위치, CCTV 구간, 경찰 순찰 시간표를 확인하세요."
  }
];
