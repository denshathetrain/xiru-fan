document.addEventListener("DOMContentLoaded", () => {

// ==============================
// 기본 설정
// ==============================

const API_URL =
    "https://script.google.com/macros/s/AKfycbyQFVjE0ZhUW4w59tiPUYssaFJ8R92iKpEYtYVZbp6bp61x7hrW13XGLh0ZOOED1v9s/exec";

const currentPath =
    window.location.pathname.replace(/\/+$/, "") || "/";


// ==============================
// 공통 함수
// ==============================

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatBoardDate(value) {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return `${date.getFullYear()}.${String(
        date.getMonth() + 1
    ).padStart(2, "0")}.${String(
        date.getDate()
    ).padStart(2, "0")}`;
}


// ==============================
// 게시글
// ==============================

const boardList = document.getElementById("board-list");

if (boardList) {

    function loadBoards() {

        fetch(
            API_URL +
            "?action=boards&t=" +
            Date.now()
        )

            .then(response => {

                if (!response.ok) {
                    throw new Error("게시글 API 오류");
                }

                return response.json();
            })

            .then(posts => {

                console.log("게시글 정보:", posts);

                if (
                    !Array.isArray(posts) ||
                    posts.length === 0
                ) {

                    boardList.innerHTML = `
                        <div class="board-empty">
                            등록된 게시글이 없습니다.
                        </div>
                    `;

                    return;
                }

                boardList.innerHTML = posts.map(post => `

                    <a
                        class="board-item"
                        href="${escapeHtml(post.url || "#")}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >

                        <div class="board-item-main">

                            <h3>
                                ${escapeHtml(
                                    post.title || "제목 없음"
                                )}
                            </h3>

                            <p>
                                ${escapeHtml(
                                    post.preview || ""
                                )}
                            </p>

                        </div>

                        <div class="board-item-meta">

                            <span>
                                ${escapeHtml(
                                    post.author || ""
                                )}
                            </span>

                            <span>
                                ${formatBoardDate(
                                    post.regDate
                                )}
                            </span>

                        </div>

                    </a>

                `).join("");
            })

            .catch(error => {

                console.error(
                    "게시글 불러오기 오류:",
                    error
                );

                boardList.innerHTML = `
                    <div class="board-empty">
                        게시글을 불러오지 못했습니다.
                    </div>
                `;
            });
    }

    loadBoards();
}


// ==============================
// 메인 공지
// ==============================

const mainNotice =
    document.getElementById("main-notice");

if (mainNotice) {

    fetch(
        API_URL +
        "?action=boards&t=" +
        Date.now()
    )

        .then(response => {

            if (!response.ok) {
                throw new Error("공지 API 오류");
            }

            return response.json();
        })

        .then(posts => {

            if (
                !Array.isArray(posts) ||
                posts.length === 0
            ) {

                mainNotice.innerHTML = `
                    <span>NOTICE</span>
                    <b>등록된 공지가 없습니다.</b>
                `;

                return;
            }

            const latest = posts[0];

            mainNotice.innerHTML = `
                <span>NOTICE</span>
                <b>
                    ${escapeHtml(
                        latest.title || "제목 없음"
                    )}
                </b>
            `;

            mainNotice.style.cursor = "pointer";

            mainNotice.onclick = () => {
                window.location.href = "/post/";
            };
        })

        .catch(error => {

            console.error(
                "공지 불러오기 오류:",
                error
            );

            mainNotice.innerHTML = `
                <span>NOTICE</span>
                <b>공지사항을 불러오지 못했습니다.</b>
            `;
        });
}


// ==============================
// 네비게이션 현재 페이지 표시
// ==============================

const navLinks =
    document.querySelectorAll(".nav a");

navLinks.forEach(link => {

    const linkPath =
        new URL(link.href)
            .pathname
            .replace(/\/+$/, "") || "/";

    if (linkPath === currentPath) {
        link.classList.add("active");
    }
});


// ==============================
// LIVE 방송
// ==============================

const livePreview =
    document.getElementById("live-preview");

const liveStatus =
    document.getElementById("live-status-text");

if (livePreview) {

    function loadLive() {

        fetch(
            API_URL +
            "?action=live&t=" +
            Date.now()
        )

            .then(response => {

                if (!response.ok) {
                    throw new Error("LIVE API 오류");
                }

                return response.json();
            })

            .then(data => {

                console.log(
                    "LIVE 정보:",
                    data
                );

                // 방송 중
                if (
                    data &&
                    data.online &&
                    data.broadNo
                ) {

                    const broadNo =
                        data.broadNo;

                    const channel =
                        data.channel || "xirus2";

                    const liveUrl =
                        `https://play.sooplive.com/${channel}/${broadNo}`;

                    const thumbnailUrl =
                        `https://liveimg.sooplive.com/m/${broadNo}?t=${Date.now()}`;


                    livePreview.innerHTML = `
                        <img
                            src="${thumbnailUrl}"
                            alt="시루냥 방송 썸네일"
                        >
                    `;

                    if (liveStatus) {
                        liveStatus.textContent =
                            "현재 방송중 · 클릭해서 입장";
                    }

                    livePreview.style.cursor =
                        "pointer";

                    livePreview.onclick = () => {

                        window.open(
                            liveUrl,
                            "_blank",
                            "noopener,noreferrer"
                        );

                    };

                    return;
                }
                // 방송 종료
                livePreview.innerHTML = `
                    <div class="live-placeholder">
                        방송 종료
                    </div>
                `;

                if (liveStatus) {
                    liveStatus.textContent =
                        "현재 방송중이 아닙니다.";
                }

                livePreview.style.cursor =
                    "default";

                livePreview.onclick = null;
            })

            .catch(error => {

                console.error(
                    "LIVE 정보 불러오기 오류:",
                    error
                );

                livePreview.innerHTML = `
                    <div class="live-placeholder">
                        방송 정보를 불러오지 못했습니다.
                    </div>
                `;

                if (liveStatus) {
                    liveStatus.textContent =
                        "잠시 후 다시 확인해주세요.";
                }
                livePreview.style.cursor =
                    "default";
                livePreview.onclick = null;
            });
    }
    // 페이지 처음 열었을 때
    loadLive();
    // 1분마다 방송 상태 + 썸네일 갱신
    setInterval(
        loadLive,
        60 * 1000
    );
}
});

const navMoreBtn =
document.querySelector(".nav-more-btn");
const navMoreMenu =
document.querySelector(".nav-more-menu");
if (
navMoreBtn &&
navMoreMenu
) {
navMoreBtn.addEventListener(
    "click",
    (e) => {
        e.stopPropagation();
        navMoreMenu.classList.toggle(
            "show"
        );
    }
);
document.addEventListener(
    "click",
    (e) => {
        if (
            !e.target.closest(
                ".nav-more"
            )
        ) {
            navMoreMenu.classList.remove(
                "show"
            );
        }
    }
);
}