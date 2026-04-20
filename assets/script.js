const CONFIG = {
    name: "Shasanka Acharya",
    handle: "@8dsasb",
    title: ["MSc Artificial Intelligence", "Software Engineer", "ML Enthusiast", "Open Source Builder"],
    university: "Macquarie University",
    location: "Sydney, Australia",
    timezone: "AEST (UTC+10)",
    bio: "I'm a Software Engineer & AI specialist who loves experimenting with machine learning to solve real-world problems. When I'm not training neural nets, you'll find me making music, playing RPGs, or exploring data science challenges.",
    linkedin: "https://linkedin.com/in/shasanka-acharya",
    email: "shasanka.acharya@hdr.mq.edu.au",
    github: "https://github.com/8dsasb",
    cvUrl: "#",
    profileImage: "https://avatars.githubusercontent.com/u/25223893?v=4",
    pinnedRepos: ["foodSnapID", "domain-ranking-app", "explainable-churn-prediction"],
    skills: {
        "Languages & Frameworks": ["HTML", "CSS", "PHP", "Laravel", "JavaScript", "React.js", "Python", "NumPy", "Pandas", "TensorFlow", "Keras", "OpenCV", "SQL"],
        "Data Science & ML": ["Supervised Learning", "Deep Learning", "NLP", "LangChain", "Computer Vision", "Transformers", "spaCy", "NLTK"],
        "Tools & Cloud": ["AWS", "Google Cloud", "Git", "Flask", "Gradio", "Jupyter", "Matplotlib", "Seaborn"]
    },
    languages: [
        { name: "English", level: "Fluent" },
        { name: "Nepali", level: "Fluent" },
        { name: "Hindi", level: "Fluent" },
        { name: "Russian", level: "Beginner" }
    ]
};

const LANGUAGE_COLORS = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    HTML: "#e34c26",
    CSS: "#563d7c",
    PHP: "#4F5D95",
    Java: "#b07219",
    "C++": "#f34b7d",
    "C#": "#178600",
    Ruby: "#701516",
    Go: "#00ADD8",
    Rust: "#dea584",
    Lua: "#000080"
};

let repos = [];
let currentFilter = "all";

document.addEventListener("DOMContentLoaded", () => {
    initProfileImage();
    initBio();
    initSkills();
    initLanguages();
    initTypingEffect();
    initScrollAnimations();
    initContactLinks();
    initYear();
    fetchRepos();
    initFilterButtons();
});

function initProfileImage() {
    const container = document.getElementById("profile-image-container");
    if (CONFIG.profileImage) {
        container.innerHTML = `<img src="${CONFIG.profileImage}" alt="${CONFIG.name}">`;
    }
}

function initBio() {
    document.getElementById("bio-text").textContent = CONFIG.bio;
}

function initSkills() {
    const container = document.getElementById("skills-container");
    let html = '<div class="language-chips">';
    CONFIG.languages.forEach(lang => {
        html += `<span class="language-chip">${lang.name} <span class="level">• ${lang.level}</span></span>`;
    });
    html += '</div>';

    for (const [category, skills] of Object.entries(CONFIG.skills)) {
        html += `<div class="skill-category">`;
        html += `<h3>${category}</h3>`;
        html += `<div class="skill-chips">`;
        skills.forEach(skill => {
            html += `<span class="skill-chip">${skill}</span>`;
        });
        html += '</div></div>';
    }
    container.innerHTML = html;
}

function initLanguages() {
}

function initTypingEffect() {
    const typingText = document.querySelector(".typing-text");
    const titles = CONFIG.title;
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentTitle = titles[titleIndex];

        if (isDeleting) {
            typingText.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingText.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentTitle.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1000);
}

function initScrollAnimations() {
    const fadeElements = document.querySelectorAll(".section, .project-card, .hobby-category");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => {
        el.classList.add("fade-in");
        observer.observe(el);
    });
}

function initContactLinks() {
    document.getElementById("linkedin-link").href = CONFIG.linkedin;
    document.getElementById("email-link").href = `mailto:${CONFIG.email}`;
    document.getElementById("github-link").href = CONFIG.github;
    document.getElementById("location-text").textContent = CONFIG.location;
}

function initYear() {
    document.getElementById("current-year").textContent = new Date().getFullYear();
}

function initFilterButtons() {
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.dataset.filter;
            renderRepos();
        });
    });
}

async function fetchRepos() {
    try {
        const response = await fetch("https://api.github.com/users/8dsasb/repos?sort=updated&per_page=100");
        if (!response.ok) throw new Error("Failed to fetch repos");
        repos = await response.json();
        renderRepos();
    } catch (error) {
        console.error("Error fetching repos:", error);
        document.getElementById("projects-grid").innerHTML = `
            <div class="projects-loading">
                <p>Unable to load repositories. Please check your connection.</p>
            </div>
        `;
    }
}

function renderRepos() {
    const grid = document.getElementById("projects-grid");

    let filteredRepos = [...repos];

    if (currentFilter !== "all") {
        filteredRepos = filteredRepos.filter(repo =>
            repo.language === currentFilter
        );
    }

    filteredRepos.sort((a, b) => {
        const aPinned = CONFIG.pinnedRepos.includes(a.name);
        const bPinned = CONFIG.pinnedRepos.includes(b.name);
        if (aPinned && !bPinned) return -1;
        if (!aPinned && bPinned) return 1;
        return new Date(b.updated_at) - new Date(a.updated_at);
    });

    if (filteredRepos.length === 0) {
        grid.innerHTML = `
            <div class="projects-loading">
                <p>No repositories found for this filter.</p>
            </div>
        `;
        return;
    }

    const reposToShow = currentFilter === "all" ? filteredRepos.slice(0, 9) : filteredRepos.slice(0, 12);

    grid.innerHTML = reposToShow.map(repo => {
        const isFeatured = CONFIG.pinnedRepos.includes(repo.name);
        const languageColor = LANGUAGE_COLORS[repo.language] || "#6e7681";

        return `
            <div class="project-card ${isFeatured ? 'featured' : ''}">
                ${isFeatured ? '<span class="featured-badge">Featured</span>' : ''}
                <div class="project-header">
                    <a href="${repo.html_url}" target="_blank" class="project-name">${repo.name}</a>
                </div>
                <p class="project-description">${repo.description || "No description yet"}</p>
                <div class="project-meta">
                    <div class="project-language">
                        <span class="language-dot" style="background: ${languageColor}"></span>
                        ${repo.language || "—"}
                    </div>
                    <div class="project-stats">
                        <span>★ ${repo.stargazers_count}</span>
                    </div>
                </div>
                <a href="${repo.html_url}" target="_blank" class="project-link">View on GitHub →</a>
            </div>
        `;
    }).join("");
}