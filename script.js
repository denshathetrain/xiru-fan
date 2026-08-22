
document.addEventListener("DOMContentLoaded", () => {
    const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
    const navLinks = document.querySelectorAll(".nav a");

    navLinks.forEach((link) => {
        const linkPath = new URL(link.href).pathname.replace(/\/+$/, "") || "/";
        if (linkPath === currentPath) {
            link.classList.add("active");
        }
    });
});
