<div align="center">

# CRYPTBOUND

**카드 한 장, 에너지 한 번, 그리고 서로의 선택을 읽는 짧고 날카로운 승부.**

[![Build Add-On](https://github.com/ymkzz123/boudcriptblabla/actions/workflows/ci.yml/badge.svg)](https://github.com/ymkzz123/boudcriptblabla/actions/workflows/ci.yml)
![Minecraft Bedrock](https://img.shields.io/badge/Minecraft-Bedrock-62B47A?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Status](https://img.shields.io/badge/status-early_development-F2A65A?style=flat-square)

Minecraft Bedrock Edition에서 즐기는 1대1 턴제 전략 카드게임 애드온

</div>

---

## 이 프로젝트는 무엇인가요?

Cryptbound는 서로 다른 성격을 가진 동물 카드와 제한된 에너지를 조합해 상대의 선택을 읽는 게임입니다.

플레이어는 손에 들어온 카드 가운데 한 장을 비공개로 선택합니다. 양쪽의 선택이 끝나면 카드를 동시에 공개하고, 카드의 기본 능력과 상성, 각자가 배분한 에너지를 바탕으로 라운드 결과를 결정합니다. 높은 등급의 카드가 언제나 정답은 아닙니다. 상대의 정보를 읽거나, 이미 사용한 카드를 되살리거나, 상대 능력을 막는 선택이 판을 바꿀 수 있습니다.

한 판은 짧게 끝나지만 선택마다 다음 라운드에 영향을 남기는 게임을 목표로 하고 있습니다.

> [!IMPORTANT]
> 현재 프로젝트는 **초기 개발 단계**입니다. 애드온 골격과 자동 빌드는 준비됐지만 실제 게임 규칙은 아직 구현되지 않았습니다. 세부 규칙을 문서로 확정한 뒤 게임 엔진을 추가할 예정입니다.

## 게임의 뼈대

- 두 플레이어가 맞붙는 1대1 경기
- 제비, 두루미, 사슴, 나비, 멧돼지로 구성된 다섯 종류의 카드
- 중복될 수 있는 세 장의 시작 손패
- 상대에게 보이지 않는 동시 선택
- 카드 점수, 상성, 에너지 배분을 이용한 라운드 판정
- 카드마다 다른 정보전·방어·재사용 능력
- 모바일에서도 조작하기 쉬운 메뉴 중심 인터페이스

세부 계산식, 동점 처리, 효과 발동 순서는 현재 검토 중이며 확정 전까지 코드에 고정하지 않습니다.

## 다섯 장의 카드

| 카드 | 등급 | 기본 점수 | 역할 |
|---|:---:|---:|---|
| 나비 | S | 10 | 지나간 선택을 다시 활용하는 카드 |
| 두루미 | A | 8 | 라운드 결과의 변화를 크게 만드는 카드 |
| 제비 | B | 6 | 상대의 선택에서 정보를 얻는 카드 |
| 사슴 | C | 4 | 상대 손패의 패턴을 읽는 카드 |
| 멧돼지 | D | 2 | 상대의 카드 능력을 차단하는 카드 |

이 표는 카드의 기본 콘셉트만 보여 줍니다. 정확한 효과와 우선순위는 룰 문서가 확정된 뒤 업데이트됩니다.

## 현재 진행 상황

- [x] Bedrock Behavior Pack / Resource Pack 골격
- [x] TypeScript 빌드 환경
- [x] GitHub Codespaces 설정
- [x] GitHub Actions 자동 빌드
- [x] `.mcaddon` 패키징
- [ ] 공식 룰 문서 확정
- [ ] 순수 게임 엔진과 단위 테스트
- [ ] 모바일 카드 선택 UI
- [ ] 다섯 카드의 특수 능력
- [ ] 카드 아이템과 텍스처
- [ ] 공개 애니메이션과 사운드
- [ ] 2인 모바일 플레이 테스트

## 기술 구성

| 영역 | 사용 기술 |
|---|---|
| 게임 스크립트 | TypeScript |
| Minecraft 연동 | `@minecraft/server`, `@minecraft/server-ui` |
| 콘텐츠 | Behavior Pack, Resource Pack |
| 빌드 | Minecraft Core Build Tasks |
| 개발 환경 | GitHub Codespaces, Node.js 22 |
| 자동 검사 | GitHub Actions |

게임 규칙은 Minecraft API에서 분리된 순수 TypeScript 영역에 작성합니다. 덕분에 점수 계산과 카드 충돌을 게임을 켜지 않고도 테스트할 수 있고, Bedrock 관련 코드는 UI·Scoreboard·저장 기능에 집중할 수 있습니다.

## 프로젝트 구조

```text
.
├─ behavior_packs/cryptbound_bp/   # 게임 동작과 스크립트 manifest
├─ resource_packs/cryptbound_rp/   # 카드 이미지, 모델, 애니메이션, 번역
├─ scripts/
│  ├─ core/                        # Minecraft와 분리된 게임 상태와 규칙
│  └─ adapters/bedrock/            # Bedrock 이벤트와 화면 연결
├─ assets/card-art/                # 카드 원본 디자인
├─ docs/rules/                     # 확정된 규칙과 판정 예시
├─ tests/                          # 게임 엔진 테스트
└─ .github/workflows/              # 자동 빌드와 패키징
```

## 개발 시작하기

### Codespaces

저장소 상단의 **Code → Codespaces → Create codespace on main**을 누르면 필요한 Node.js 환경이 자동으로 준비됩니다.

### 직접 실행

Node.js 22 이상이 필요합니다.

```bash
git clone https://github.com/ymkzz123/boudcriptblabla.git
cd boudcriptblabla
npm install
```

타입 검사와 빌드:

```bash
npm run typecheck
npm run build
```

배포 가능한 애드온 패키지 만들기:

```bash
npm run mcaddon:production
```

완성된 파일은 다음 위치에 생성됩니다.

```text
dist/packages/cryptbound.mcaddon
```

## 모바일에서 확인하기

1. GitHub Actions의 성공한 **Build Add-On** 실행을 엽니다.
2. Artifacts에서 `cryptbound-mcaddon`을 내려받습니다.
3. 압축을 풀어 나온 `cryptbound.mcaddon` 파일을 휴대폰으로 옮깁니다.
4. 파일을 Minecraft로 열어 애드온을 가져옵니다.
5. 테스트 월드에서 Behavior Pack과 Resource Pack을 활성화합니다.

현재 애드온을 불러오면 접속 시 기초 구조가 로드되었다는 메시지만 표시됩니다. 실제 카드게임 기능은 후속 버전에서 추가됩니다.

## 개발 원칙

1. **규칙을 먼저 문서화합니다.** 애매한 판정을 코드가 임의로 결정하지 않습니다.
2. **비공개 정보는 서버가 관리합니다.** 선택한 카드와 에너지를 다른 플레이어에게 미리 노출하지 않습니다.
3. **모바일을 기준으로 설계합니다.** 작은 화면과 터치 조작에서도 불편하지 않아야 합니다.
4. **계산과 연출을 분리합니다.** 게임 엔진은 테스트 가능하게, 연출은 교체 가능하게 만듭니다.
5. **실제 돈이나 유료·환전 가능 재화는 사용하지 않습니다.** 이 프로젝트는 비금전 전략 카드게임입니다.

## 기여하기

작은 변경도 브랜치를 만든 뒤 Pull Request로 보내 주세요.

```text
feature/rules-engine
feature/mobile-ui
feature/card-items
fix/round-resolution
docs/rulebook
```

PR에는 변경 이유, 확인한 명령, Minecraft에서 직접 테스트했는지를 적어 주세요. 게임 규칙을 바꾸는 PR은 반드시 판정 예시와 테스트를 함께 추가해야 합니다.

## 안내

- 현재 별도의 라이선스가 정해지지 않았습니다. 라이선스가 추가되기 전에는 코드와 디자인의 재배포 범위를 저장소 관리자에게 확인해 주세요.
- Minecraft는 Mojang Studios 및 Microsoft의 상표입니다.
- 이 프로젝트는 Mojang Studios 또는 Microsoft의 공식 프로젝트가 아닙니다.

---

<div align="center">

**Built for Minecraft Bedrock Edition · Work in progress**

</div>
