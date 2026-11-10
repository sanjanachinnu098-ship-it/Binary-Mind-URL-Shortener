async function shortenUrl() {
    const longUrl = document.getElementById("longUrl").value;
    const result = document.getElementById("result");

    if (!longUrl) {
        result.innerHTML = "Please enter a URL!";
        return;
    }

    try {
        new URL(longUrl);

        const response = await fetch("/shorten", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ longUrl })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        result.innerHTML = `
            <p>Your short URL:</p>
            <a href="${data.shortUrl}" target="_blank">
                ${data.shortUrl}
            </a>
            <br><br>
            <button onclick="copyUrl('${data.shortUrl}')">
                Copy Link
            </button>
        `;

    } catch (error) {
        result.innerHTML = "Please enter a valid URL!";
    }
}

function copyUrl(url) {
    navigator.clipboard.writeText(url);
    alert("Link copied!");
}