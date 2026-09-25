# 화면 밀림 보정 (QR · HTML 복사)

QR 보물함과 로그 발췌 확장의 화면 밀림을 보정하는 SillyTavern용 독립 확장입니다.
버전: 1.0.0

## 기능

- **QR 보물함:** 오른쪽 끝의 세트 탭을 선택할 때 탭 목록 안에서만 가로로 이동합니다.
- **HTML 복사:** 대체 복사 방식의 투명한 임시 입력칸을 화면 안에 배치하고, 포커스로 인한 자동 스크롤을 막습니다.
- 사용자 환경에서 효과를 확인한 콘솔/북마크 코드를 확장으로 묶었습니다.
- 원본 확장의 파일, QR 데이터, 채팅, 테마 설정을 수정하지 않습니다. 외부 통신이 없습니다.
- 별도 설정 없이 모바일과 PC에서 자동 적용됩니다.

## 설치: ZIP 파일로 수동 설치

**술집 서버가 실제로 설치된 기기**에서 작업하세요. 폰이 PC의 술집에 접속하는 구조라면 PC에 설치합니다.

1. ZIP 압축을 풀면 `scroll-guard` 폴더가 나옵니다.
2. 그 폴더를 SillyTavern의 `data/<사용자 핸들>/extensions/` 안에 넣으세요.
   기본 사용자라면 보통 `data/default-user/extensions/`입니다.
3. 최종 파일 위치가 아래처럼 되어야 합니다. 같은 이름의 폴더가 두 번 겹치지 않게 하세요.

   `SillyTavern/data/default-user/extensions/scroll-guard/manifest.json`

   `SillyTavern/data/default-user/extensions/scroll-guard/index.js`

4. 술집을 새로고침하세요. 목록에 나타나지 않으면 술집 서버를 재시작한 뒤 새로고침하세요.
5. 확장 관리에서 **화면 밀림 보정 (QR · HTML 복사)**가 활성화되어 있는지 확인하세요.
6. 폰과 PC에서 열려 있는 술집 페이지를 각각 새로고침하세요.

두 원본 확장도 계속 활성화해서 사용합니다. 테스트용 북마크나 콘솔 코드는 다시 실행할 필요가 없습니다.
이전에 원본 `QR-the-jewelry/index.js`를 수정본으로 교체했다면, 원본으로 복원한 뒤 이 확장을 사용하세요.
이전에 안내했던 드래그용 커스텀 CSS는 이번 보정에 필요하지 않습니다.

## GitHub URL로 설치하고 싶은 경우

이 ZIP은 아직 GitHub에 게시되지 않았으므로 다운로드 링크를 술집의 설치 URL 칸에 넣을 수는 없습니다.
자신의 새 GitHub 저장소 최상위에 `manifest.json`, `index.js`, `README.md`를 올리면,
그 저장소 URL을 **확장 → 확장 설치**에 입력하여 설치할 수 있습니다.

## 동작 확인

1. 모바일에서 QR 보물함의 끝쪽 세트(예: 명왕성QR)를 눌러 화면이 밀리지 않는지 확인합니다.
2. HTML 복사를 눌러 화면이 밀리지 않는지 확인하고, 붙여넣기로 복사 내용도 확인합니다.
3. 새로고침한 후에도 두 보정이 적용되는지 확인합니다.

PC 개발자 도구 콘솔에는 시작 시 `[화면 밀림 보정]` 메시지가 한 번 표시됩니다.
필요하면 콘솔에서 `window.__stScrollGuardV1`을 확인할 수 있습니다.
`active`는 활성 여부, `qrCorrections`와 `copyCorrections`는 이 페이지에서의 보정 횟수입니다.
브라우저가 기본 클립보드 API로 복사했다면 `copyCorrections`가 증가하지 않는 것이 정상입니다.

## 끄기 / 제거

확장 관리에서 비활성화하고 폰과 PC의 페이지를 새로고침하세요.
수동으로 제거하려면 `scroll-guard` 폴더만 삭제하고 새로고침하면 됩니다.

## 적용 범위

- QR 보정은 `#qrm-drawer .qrm-set-tab`의 `scrollIntoView()` 호출에만 적용합니다.
- 복사 보정은 `body` 바로 아래의 `position: fixed`, `opacity: 0`, `pointer-events: none`인 임시 textarea에 적용합니다.
  다른 확장이 완전히 같은 형태의 복사칸을 만들면 그 복사칸에도 적용될 수 있습니다.
- 일반 입력칸과 그 밖의 `focus()` / `scrollIntoView()` 호출은 기존 함수로 전달합니다.
- 대상 확장의 구조나 복사 방식이 바뀌면 보정도 갱신해야 할 수 있습니다.

확인한 원본: QR-the-jewelry 1.7.0 (`7f56bf8`), text-to-image-converter 1.5.1 (`a05bb07`).

참고: https://docs.sillytavern.app/for-contributors/writing-extensions/
