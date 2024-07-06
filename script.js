document.addEventListener("DOMContentLoaded", () => {
    const articlesPerPage = 12;
    let currentPage = 1;
    let articles = [];

    const fetchArticles = async () => {
        const response = await fetch("articles/index.json");
        articles = await response.json();
        renderArticles();
    };

    const renderArticles = () => {
        const gridContainer = document.getElementById("articles");
        gridContainer.innerHTML = "";
        const start = (currentPage - 1) * articlesPerPage;
        const end = start + articlesPerPage;
        const currentArticles = articles.slice(start, end);

        currentArticles.forEach((article) => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `<h3>${article.title}</h3><p>${article.description}</p>`;
            card.addEventListener("click", () => {
                localStorage.setItem(
                    "selectedArticle",
                    JSON.stringify(article)
                );
                window.location.href = "article.html";
            });
            gridContainer.appendChild(card);
        });

        document.getElementById("prevPage").disabled = currentPage === 1;
        document.getElementById("nextPage").disabled = end >= articles.length;
    };

    document.getElementById("prevPage").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderArticles();
        }
    });

    document.getElementById("nextPage").addEventListener("click", () => {
        if (currentPage * articlesPerPage < articles.length) {
            currentPage++;
            renderArticles();
        }
    });

    fetchArticles();

    if (window.location.pathname.endsWith("article.html")) {
        const articleContent = document.getElementById("articleContent");
        const selectedArticle = JSON.parse(
            localStorage.getItem("selectedArticle")
        );
        if (selectedArticle) {
            fetch(`articles/${selectedArticle.file}`)
                .then((response) => response.text())
                .then((markdown) => {
                    articleContent.innerHTML = `<h2>${
                        selectedArticle.title
                    }</h2><p>${marked.parse(markdown)}</p>`;
                });
        }
    }
});
