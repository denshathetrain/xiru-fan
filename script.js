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

const uhList = document.getElementById("uh-list");

if (uhList) {
    const uhMeta = document.getElementById("uh-meta-text");
    const UH_ENDPOINT = "/api/upbo-history";
    const UH_INTERVAL = 30 * 1000; // 30초마다 새로 확인
    let uhLast = "";

    function uhCell(className, text) {
        const el = document.createElement("span");
        el.className = className;
        el.textContent = text; // 닉네임 등은 외부 데이터라 textContent로만 넣음
        return el;
    }

    function uhMessage(text) {
        uhList.replaceChildren();
        const li = document.createElement("li");
        li.className = "uh-empty";
        li.textContent = text;
        uhList.appendChild(li);
    }

    function uhRender(items) {
        if (!items.length) {
            uhMessage("아직 획득 기록이 없어요.");
            return;
        }

        const frag = document.createDocumentFragment();

        items.forEach(item => {
            const li = document.createElement("li");
            li.className = "uh-row";

            const set = uhCell("uh-set", item.set || "—");
            if (!item.set || item.set === "—") set.classList.add("none");

            li.append(
                uhCell("uh-nick", item.nickname || ""),
                uhCell("uh-item", item.item || ""),
                set,
                uhCell("uh-time", item.time || "")
            );

            frag.appendChild(li);
        });

        uhList.replaceChildren(frag);
    }

    async function uhLoad() {
        try {
            const res = await fetch(UH_ENDPOINT);
            if (!res.ok) throw new Error("HTTP " + res.status);

            const data = await res.json();
            const items = Array.isArray(data.items) ? data.items : [];

            // 내용이 바뀐 경우에만 다시 그려서 깜빡임/스크롤 튐 방지
            const signature = JSON.stringify(items);
            if (signature !== uhLast) {
                uhLast = signature;
                uhRender(items);
            }

            uhMeta.textContent =
                `총 ${items.length}건` +
                (data.updatedAt ? ` · 마지막 반영 ${data.updatedAt}` : "");
        } catch (error) {
            console.error("획득 기록 불러오기 오류:", error);

            // 이미 보여주던 목록이 있으면 그대로 두고, 처음부터 실패한 경우만 안내
            if (!uhLast) uhMessage("획득 기록을 불러오지 못했어요.");
            uhMeta.textContent = "불러오지 못했어요. 잠시 후 다시 시도할게요.";
        }
    }

    uhLoad();

    // 탭이 보이는 동안에만 주기적으로 확인
    setInterval(() => {
        if (!document.hidden) uhLoad();
    }, UH_INTERVAL);

    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) uhLoad();
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