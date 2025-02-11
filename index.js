let selectLanguage = document.querySelector(".lang");
let refresh = document.querySelector(".refresh");
let retry = document.querySelector(".retry");
let content = document.querySelector(".content");
let repoName = document.querySelector(".repoName");

let repoDesc = document.createElement("div");
repoDesc.className = "repoDesc";
let repoInfo = document.createElement("div");
repoInfo.className = "repoInfo";
let repoInfoPL = document.createElement("div");
repoInfoPL.className = "repoInfoPL";
let repoInfoWatchers = document.createElement("div");
repoInfoWatchers.className = "repoInfoWatchers";
let repoInfoForks = document.createElement("div");
repoInfoForks.className = "repoInfoForks";
let repoInfoOI = document.createElement("div");
repoInfoOI.className = "repoInfoOI";

refresh.style.display = "none";
retry.style.display = "none";

const handleState = (state) => {
  switch (state) {
    case "empty":
      repoName.textContent = "No language selected";
      break;
    case "loading":
      repoName.textContent = "Loading please wait...";
      break;
    case "success":
      content.style.background = "rgb(235, 235, 235)";
      content.style.border = "2px solid black";
      repoName.textContent = "Please select a language";
      break;
    case "error":
      repoName.textContent = "Error fetching repositories";
      content.style.background = "rgb(255, 100, 100)";
      break;
    default:
      repoName.textContent = "";
  }
};

const handleSelectLanguage = async () => {
  const language = selectLanguage.value;

  if (!language) {
    handleState("empty");
    return;
  }

  handleState("loading");

  try {
    refresh.style.display = "block";

    const resp = await fetch(
      `https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc`
    );
    const data = await resp.json();
    handleState("success");
    let mathRandom = Math.floor(Math.random() * data.items.length);
    let randomRepo = data.items[mathRandom];

    content.appendChild(repoDesc);
    content.appendChild(repoInfo);

    repoInfo.appendChild(repoInfoPL);
    repoInfo.appendChild(repoInfoWatchers);
    repoInfo.appendChild(repoInfoForks);
    repoInfo.appendChild(repoInfoOI);

    repoName.textContent = randomRepo.name;
    repoDesc.textContent =
      randomRepo.description === ""
        ? "Has not description"
        : randomRepo.description;

    repoInfoPL.innerHTML = "&#10086" + " " + randomRepo.language;
    repoInfoWatchers.innerHTML = "&#9733" + " " + randomRepo.watchers;
    repoInfoForks.innerHTML = "&#9732" + " " + randomRepo.forks;
    repoInfoOI.innerHTML = "&#8505" + " " + randomRepo["open_issues"];
    console.log(randomRepo);

    refresh.addEventListener("click", handleSelectLanguage);
    retry.style.display = "none";
  } catch (error) {
    handleState("error");
    retry.style.display = "block";
    retry.textContent = "Retry";
    refresh.style.display = "none";
    retry.addEventListener("click", () => window.location.reload());
  }
};

const resp = async () => {
  try {
    handleState("loading");

    const response = await fetch(
      "https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json"
    );
    const data = await response.json();
    data.forEach((language) => {
      const option = document.createElement("option");
      option.value = language.title;
      option.textContent = language.title;
      selectLanguage.appendChild(option);
    });

    handleState("success");
  } catch (error) {
    handleState("error");
    console.error("Error fetching languages:", error);
  }
};

selectLanguage.addEventListener("change", handleSelectLanguage);

resp();
