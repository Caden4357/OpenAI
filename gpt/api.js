
const form = document.querySelector(".search-form");
// console.log(form);
form.addEventListener("submit", handleSubmit);
// responseURL 'https://api.openai.com/v1/images/generations'
const image1 = document.querySelector(".response1");
const image2 = document.querySelector(".response2");

async function handleSubmit (e) {
    e.preventDefault();
    // console.log(e.target);
    const newForm = new FormData(form);
    // console.log(newForm.get("search-input"));
    const prompt = newForm.get("search-input");
    form.reset();
    const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            prompt: prompt,
            n: 2,
            size: "512x512",
        })
    
    })
    const data = await response.json();
    console.log(data);
    image1.src = data.data[0].url;
    image2.src = data.data[1].url;
}