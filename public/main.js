// Form Submit Handler
const form = document.querySelector("#url-form");
const copyBtn = document.querySelector("#copyBtn");
const shortenedUrl = document.querySelector("#new-url");
const oldText = document.querySelector("#oldText");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const urlInput = document.querySelector("#url");
    const reqBody = {
        url: urlInput.value,
    };

    try {
        const res = await fetch(`${window.location}createUrl`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reqBody),
        });
        const json = await res.json();

        oldText.style.display = "none";
        copyBtn.setAttribute("disabled", "false");
        shortenedUrl.style.display = "block";
        shortenedUrl.innerHTML = json.shortUrl;
        shortenedUrl.setAttribute("href", json.shortUrl);
    } catch (err) {
        console.log(err);
        if (err) alert("An error occured. Try again later");
    }
});
