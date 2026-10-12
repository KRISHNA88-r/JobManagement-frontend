// icon = Devicon slug (logo comes from the Devicon CDN). null = no logo, a letter tile is shown instead.
const s = (name, icon, ...aliases) => ({ name, icon, aliases });

export const SKILLS = [
  // programming languages
  s("C Programming", "c", "c", "c language"),
  s("C++", "cplusplus", "cpp", "c plus plus"),
  s("C#", "csharp", "c sharp", "csharp"),
  s("Java", "java", "core java"),
  s("Python", "python"),
  s("JavaScript", "javascript", "js"),
  s("TypeScript", "typescript", "ts"),
  s("Go", "go", "golang"),
  s("Kotlin", "kotlin"),
  s("Swift", "swift"),
  s("PHP", "php"),
  s("Ruby", "ruby"),
  s("Rust", "rust"),
  s("Dart", "dart"),
  s("R", "r", "r language"),
  s("MATLAB", "matlab"),
  s("Scala", "scala"),
  s("Bash", "bash", "shell", "shell scripting"),

  // web
  s("HTML5", "html5", "html"),
  s("CSS3", "css3", "css"),
  s("React", "react", "reactjs", "react.js"),
  s("Angular", "angularjs", "angular js"),
  s("Vue.js", "vuejs", "vue"),
  s("Next.js", "nextjs", "next"),
  s("Node.js", "nodejs", "node"),
  s("Express.js", "express", "express"),
  s("Tailwind CSS", "tailwindcss", "tailwind"),
  s("Bootstrap", "bootstrap"),
  s("jQuery", "jquery"),
  s("Redux", "redux"),
  s("Sass", "sass", "scss"),
  s("Webpack", "webpack"),
  s("Vite", "vitejs", "vite"),

  // backend and frameworks
  s("Spring Boot", "spring", "spring", "spring framework"),
  s("Hibernate", "hibernate", "jpa"),
  s("Django", "django"),
  s("Flask", "flask"),
  s("FastAPI", "fastapi"),
  s(".NET", "dotnetcore", "dotnet", "asp.net"),
  s("Laravel", "laravel"),
  s("REST APIs", null, "rest", "restful api", "web services"),
  s("Microservices", null),

  // databases
  s("MySQL", "mysql"),
  s("PostgreSQL", "postgresql", "postgres"),
  s("MongoDB", "mongodb", "mongo"),
  s("SQLite", "sqlite"),
  s("Redis", "redis"),
  s("Oracle", "oracle", "oracle database"),
  s("Firebase", "firebase"),
  s("SQL", null, "structured query language", "database"),

  // tools and cloud
  s("Git", "git", "version control"),
  s("GitHub", "github"),
  s("GitLab", "gitlab"),
  s("Docker", "docker"),
  s("Kubernetes", "kubernetes", "k8s"),
  s("Jenkins", "jenkins", "ci/cd"),
  s("Linux", "linux"),
  s("AWS", "amazonwebservices", "amazon web services"),
  s("Microsoft Azure", "azure"),
  s("Google Cloud", "googlecloud", "gcp"),
  s("Nginx", "nginx"),
  s("Maven", "maven"),
  s("Gradle", "gradle"),
  s("Postman", "postman", "api testing"),
  s("VS Code", "vscode", "visual studio code"),
  s("Jira", "jira"),
  s("Figma", "figma", "ui design", "ux design"),
  s("Android", "android", "android development"),
  s("Flutter", "flutter"),

  // data and AI
  s("Machine Learning", null, "ml", "ai"),
  s("Deep Learning", null),
  s("TensorFlow", "tensorflow"),
  s("PyTorch", "pytorch"),
  s("Pandas", "pandas"),
  s("NumPy", "numpy"),
  s("OpenCV", "opencv"),
  s("Data Analysis", null, "analytics"),
  s("Power BI", null),
  s("Microsoft Excel", null, "excel", "spreadsheets"),

  // computer science basics
  s("Data Structures and Algorithms", null, "dsa", "data structures", "algorithms"),
  s("Object-Oriented Programming", null, "oop", "oops"),
  s("Operating Systems", null, "os"),
  s("Computer Networks", null, "networking"),
  s("Cyber Security", null, "cybersecurity", "security"),
  s("Software Testing", null, "qa", "manual testing", "selenium"),

  // general skills
  s("Communication", null),
  s("Teamwork", null, "collaboration"),
  s("Leadership", null),
  s("Problem Solving", null),
  s("Time Management", null),
  s("Project Management", null),
  s("Public Speaking", null),
  s("Customer Service", null),
  s("Sales", null),
  s("Digital Marketing", null, "seo", "marketing"),
  s("Content Writing", null, "writing", "copywriting"),
  s("Accounting", null, "tally", "finance"),
];

export function findSkill(name) {
  if (!name) return null;
  const q = name.trim().toLowerCase();
  return (
    SKILLS.find(
      (sk) => sk.name.toLowerCase() === q || sk.aliases.some((a) => a.toLowerCase() === q)
    ) || null
  );
}

// Best matches first: exact, starts with, a word starts with, contains
export function searchSkills(query, excludeNames = [], limit = 8) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const taken = new Set(excludeNames.map((n) => n.toLowerCase()));
  const scored = [];

  for (const skill of SKILLS) {
    if (taken.has(skill.name.toLowerCase())) continue;
    const names = [skill.name, ...skill.aliases].map((n) => n.toLowerCase());

    let score = -1;
    if (names.some((n) => n === q)) score = 0;
    else if (names.some((n) => n.startsWith(q))) score = 1;
    else if (names.some((n) => n.split(/[\s/.+#-]+/).some((w) => w.startsWith(q)))) score = 2;
    else if (names.some((n) => n.includes(q))) score = 3;

    if (score >= 0) scored.push({ skill, score });
  }

  scored.sort((a, b) => a.score - b.score || a.skill.name.localeCompare(b.skill.name));
  return scored.slice(0, limit).map((x) => x.skill);
}