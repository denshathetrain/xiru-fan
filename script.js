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
// 더보기 메뉴
// ==============================
const navMoreBtn =
    document.querySelector(".nav-more-btn");
const navMoreMenu =
    document.querySelector(".nav-more-menu");

if (navMoreBtn && navMoreMenu) {
    navMoreBtn.addEventListener(
        "click",
        (e) => {
            e.stopPropagation();
            navMoreMenu.classList.toggle("show");
        }
    );

    document.addEventListener(
        "click",
        (e) => {
            if (!e.target.closest(".nav-more")) {
                navMoreMenu.classList.remove("show");
            }
        }
    );
}

});