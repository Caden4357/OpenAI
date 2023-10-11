import { useState } from 'react'
import './App.css'
import OpenAI from "openai";
import axios from 'axios'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_API_KEY,
  dangerouslyAllowBrowser: true
});
function App() {
  const [search, setSearch] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [response, setResponse] = useState('')

  // openai.models.list().then(models => {
  //   console.log(models);
  // } );
  const handleImageChange = (e) => {
    setFile(e.target.files[0])
    // ? create object url for image preview
    setPreview(URL.createObjectURL(e.target.files[0]))
  }
  const submitHandler = async (e) => {
    e.preventDefault()
    // ! Neeed to make a fomrdata object to send file
    try {
      let formData = new FormData();
      formData.append("image", file);
      const response = await axios.post('http://localhost:8000/api/createProduct', formData)
      const gptResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `Analyze this photo and provide to your best knowledge what you believe to be the total; calories, carbs, fat, sugar, protein and sodium per serving do not respond with anything besides the listed things above and please put them in a JS object: ${response.data.image}` }],
      });
      let gptObject = gptResponse.choices[0].message.content
      setResponse(JSON.parse(gptObject));
      console.log(gptResponse)
    }
    catch (err) {
      console.log(err)
    }

    // const response = await openai.chat.completions.create({
    //   model: "gpt-3.5-turbo",
    //   messages: [{ role: "user", content: search}],
    // });
    setSearch('')
    setFile(null)
  }
  return (
    <>
      <h1 className='mb-5'>Search Chat GPT</h1>
      <form onSubmit={submitHandler} encType='multipart/form-data'>
        {/* <input type="text" name="search" onChange={(e) => setSearch(e.target.value)} value={search}/> */}
        <textarea className='form-control' name="search" onChange={(e) => setSearch(e.target.value)} value={search}></textarea>
        <br />
        <input className='form-control' type="file" name="file" onChange={handleImageChange} />
        <br />
        {
          preview && <img src={preview} alt="" width='200' />
        }
        <br />
        <input className='form-control btn btn-primary' type="submit" value="Submit" />

      </form>
      {
        response && 
        <div>
          <p>Estimated Calories Per Serving: {response['calories']}</p>
          <p>Estimated Carbs Per Serving: {response['carbs']}</p>
          <p>Estimated Fat Per Serving: {response['fat']}</p>
          <p>Estimated Sugar Per Serving: {response['sugar']}</p>
          <p>Estimated Protein Per Serving: {response['protein']}</p>
          <p>Estimated Sodium Per Serving: {response['sodium']}</p>
          <p>How many servings?</p>
          <button>1</button>
          <button>2</button>
          <button>3</button>
          <button>4</button>
        </div>
      }
    </>
  )
}

export default App
