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
        const articlesContainer = document.getElementById("articles");
        articlesContainer.innerHTML = "";
        const start = (currentPage - 1) * articlesPerPage;
        const end = start + articlesPerPage;
        const currentArticles = articles.slice(start, end);

        currentArticles.forEach((article) => {
            const card = document.createElement("div");
            card.className = "col-md-3 mb-4";
            card.innerHTML = `
                <div class="card bg-secondary text-white h-100">
                    <div class="card-body">
                        <h5 class="card-title">${article.title}</h5>
                        <p class="card-text">${article.description}</p>
                    </div>
                </div>`;
            card.addEventListener("click", () => {
                localStorage.setItem(
                    "selectedArticle",
                    JSON.stringify(article)
                );
                window.location.href = "article.html";
            });
            articlesContainer.appendChild(card);
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
