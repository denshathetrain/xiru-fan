document.addEventListener("DOMContentLoaded", () => {
    const API_URL =
        "https://script.google.com/macros/s/AKfycbyQFVjE0ZhUW4w59tiPUYssaFJ8R92iKpEYtYVZbp6bp61x7hrW13XGLh0ZOOED1v9s/exec";

    const currentPath =
        window.location.pathname.replace(/\/+$/, "") || "/";

    // =========================
    // 게시글 목록
    // =========================
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

                    if (!Array.isArray(posts) || posts.length === 0) {
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
                            href="${post.url}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div class="board-item-main">
                                <h3>${escapeHtml(post.title || "제목 없음")}</h3>
                                <p>${escapeHtml(post.preview || "")}</p>
                            </div>

                            <div class="board-item-meta">
                                <span>${escapeHtml(post.author || "")}</span>
                                <span>${formatBoardDate(post.regDate)}</span>
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

        loadBoards();
    }

    const navLinks = document.querySelectorAll(".nav a");
    navLinks.forEach((link) => {
        const linkPath =
            new URL(link.href).pathname.replace(/\/+$/, "") || "/";
        if (linkPath === currentPath) {
            link.classList.add("active");
        }
    });
    

    

    
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
                        throw new Error(
                            "LIVE API 오류"
                        );
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(
                        "LIVE 정보:",
                        data
                    );
                // =====================
                // 방송중
                // =====================
                    if (
                        data &&
                        data.online &&
                        data.broadNo
                    ) {
                        const broadNo = data.broadNo;
                        const liveUrl =
                            `https://play.sooplive.com/${data.channel}/${broadNo}`;
                        const thumbnailUrl = `https://liveimg.sooplive.com/m/${broadNo}?t=${Date.now()}`;

                        livePreview.innerHTML = `
                            <img
                                src="${thumbnailUrl}"
                                alt="시루냥 방송 썸네일"
                            >
                        `;
                        liveStatus.textContent =
                            "현재 방송중 · 클릭해서 입장";


                        livePreview.style.cursor =
                            "pointer";


                        livePreview.onclick =
                            () => {
                                window.open(
                                    liveUrl,
                                    "_blank"
                                );
                            };
                        return;
                    }


                // =====================
                // 오프라인
                // =====================
                    livePreview.innerHTML = `
                        <div class="live-placeholder">
                            방송 종료
                        </div>
                    `;
                    liveStatus.textContent =
                        "현재 방송중이 아닙니다.";
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

                    liveStatus.textContent =
                        "잠시 후 다시 확인해주세요.";
                });
        }


    // 최초 실행
        loadLive();


    // 1분마다 갱신
        setInterval(
            loadLive,
            60 * 1000
        );
    }
});