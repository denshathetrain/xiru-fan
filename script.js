document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // 현재 메뉴 active 처리
    // =========================

    const currentPath =
        window.location.pathname.replace(/\/+$/, "") || "/";

    const navLinks = document.querySelectorAll(".nav a");

    navLinks.forEach((link) => {
        const linkPath =
            new URL(link.href).pathname.replace(/\/+$/, "") || "/";

        if (linkPath === currentPath) {
            link.classList.add("active");
        }
    });


    // =========================
    // 메인 화면 CALENDAR 일정
    // =========================

    const preview =
        document.getElementById("home-calendar-preview");

    // 메인 페이지가 아니면 여기서 종료
    if (!preview) return;


    const API_URL =
        "https://script.google.com/macros/s/AKfycbyQFVjE0ZhUW4w59tiPUYssaFJ8R92iKpEYtYVZbp6bp61x7hrW13XGLh0ZOOED1v9s/exec";


    const callbackName = "homeScheduleCallback";


    window[callbackName] = function (schedules) {

        try {

            const now = new Date();

            // 오늘 날짜
            const todayStart = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
            );

            const todayKey =
                `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;


            // 일정 데이터 정리
            const items = (Array.isArray(schedules) ? schedules : [])
                .map(item => {

                    const date = new Date(item.date);

                    if (Number.isNaN(date.getTime())) {
                        return null;
                    }

                    const key =
                        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

                    return {
                        key: key,
                        date: date,
                        content: String(item.content || "")
                    };

                })
                .filter(Boolean)
                .filter(item => item.content.trim() !== "")
                .sort((a, b) => a.date - b.date);


            // =========================
            // 오늘 일정 확인
            // =========================

            const todayItems =
                items.filter(item => item.key === todayKey);


            if (todayItems.length > 0) {

                const text = todayItems
                    .flatMap(item => item.content.split("/"))
                    .map(text => text.trim())
                    .filter(Boolean)
                    .join(" · ");


                preview.textContent =
                    `${now.getMonth() + 1}월 ${now.getDate()}일 · ${text}`;

                return;
            }


            // =========================
            // 오늘 일정이 없으면
            // 가장 가까운 다음 일정 표시
            // =========================

            const nextItem =
                items.find(item => item.date >= todayStart);


            if (nextItem) {

                const date = nextItem.date;

                const text = nextItem.content
                    .split("/")
                    .map(text => text.trim())
                    .filter(Boolean)
                    .join(" · ");


                preview.textContent =
                    `${date.getMonth() + 1}월 ${date.getDate()}일 · ${text}`;

                return;
            }


            // =========================
            // 일정이 아예 없을 때
            // =========================

            preview.textContent =
                "등록된 일정이 없습니다.";


        } catch (error) {

            console.error(
                "메인 캘린더 표시 오류:",
                error
            );

            preview.textContent =
                "일정을 불러오지 못했습니다.";
        }


        // 콜백 삭제
        delete window[callbackName];
    };


    // =========================
    // Google Apps Script 호출
    // =========================

    const script =
        document.createElement("script");


    script.src =
        API_URL +
        "?callback=" +
        callbackName +
        "&t=" +
        Date.now();


    script.onerror = function () {

        console.error(
            "메인 일정 데이터를 불러오지 못했습니다."
        );

        preview.textContent =
            "일정을 불러오지 못했습니다.";

        delete window[callbackName];
    };


    document.body.appendChild(script);

});