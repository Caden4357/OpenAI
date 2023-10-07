// import { Configuration, OpenAIApi } from "openai-api";
// require('dotenv').config();
// import.meta.env.API_KEY;

// const configuration = new Configuration({
//     apiKey: API_KEY,
// });
// const openai = new OpenAIApi(configuration);

const form = document.querySelector("search-form");
form.addEventListener("submit", handleSubmit);

async function handleSubmit () {
    const newForm = new FormData(form);
    console.log(newForm.get("search"));
    // const response = await openai.createImage({
    //     prompt: "A beautiful, rotating, 3D model of a galaxy with stars and planets.",
    //     n: 2,
    //     size: "512x512",
    // });
    console.log(response.data.data);
}

// async function getModels(){
//     const response = await fetch("https://api.openai.com/v1/completions", {
//         method: "POST",
//         headers: {
//             Authorization: `Bearer ${process.env.API_KEY}`,
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             model: "text-davinci-003",
//             prompt: "Say hi Caden",
//             max_tokens: 5
//         })
    
//     })
//     const data = await response.json();
//     console.log(data);
// }
// getModels();
