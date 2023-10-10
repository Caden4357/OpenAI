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
      const gptRespponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `Analyze this photo and provide a detailed ingredients list for it with nutrition infor: ${response.data.image}` }],
      });
      setResponse(gptRespponse.choices[0].message.content);
      console.log(response.data.image)
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
        response && <p>{response}</p>
      }
    </>
  )
}

export default App
