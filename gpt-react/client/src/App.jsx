import { useState } from 'react'
import './App.css'
import OpenAI from "openai";
import axios from 'axios'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_API_KEY,
  dangerouslyAllowBrowser: true
});
function App() {
  let singleServing = {}
  const [search, setSearch] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [response, setResponse] = useState('')

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
        messages: [{role:'system', content:'Your a nutritionist and a client sends you a photo of a food item and asks you to analyze it first figure out what the food is and then provide the nutrition facts per serving. Respond with only 1 JSON object with the following keys: servingSize, totalCalories, fat, saturatedFat totalCarbohydrates, sugar, fiber, protein, sodium and cholesterol, per serving and what you think the food is.'},
          { role: "user", content: `${response.data.image}`}],
      });
      let gptObject = gptResponse.choices[0].message.content
      console.log(gptObject);
      setResponse(JSON.parse(gptObject));
      setSearch('')
      setFile(null)
    }
    catch (err) {
      console.log(err)
    }
  }
  // ! Still working on this 
  const changeServingSize = (serving) => {
    for (let key in response) {
      setResponse(prev => {
        return {
          ...prev,
          [key]: prev[key] * serving
        }
      }
      )
    }
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
        <div className='mt-5 p-2 border bg-white text-dark w-75 mx-auto'>
          <h2>Nutrition Facts</h2>
          <hr />
          <div className='d-flex justify-content-between'>
            <p className='fw-bold'>Serving Size: </p>
            <p className='fw-bold'>{response['servingSize']}</p>
          </div>
          <div className='bg-black w-100' style={{ height: '10px' }}></div>
          <p className='text-start fw-bold'>Amounts per serving</p>
          <div className='d-flex justify-content-between'>
            <h2 className='fw-bold'>Calories: </h2>
            <h2>{response['totalCalories']}</h2>
          </div>
          <div className='bg-black w-100' style={{ height: '5px' }}></div>
          <div>
            <b>Fat: </b><span>{response['fat']}</span>
          </div>
          <div>
            <b>Saturated Fat: </b><span>{response['saturatedFat']}</span>
          </div>
          <div>
            <b>Total Carbohydrate: </b><span>{response['totalCarbohydrates']}</span>
          </div>
          <div>
            <b>Fiber: </b><span>{response['fiber']}</span>
          </div>
          <div>
            <b>Sodium: </b><span>{response['sodium']}</span>
          </div>
          <div>
            <b>Protein: </b><span>{response['protein']}</span>
          </div>
          <div>
            <b>Sugar: </b><span>{response['sugar']}</span>
          </div>
          <div>
            <b>Cholesterol: </b><span>{response['cholesterol']}</span>
          </div>
          <p>How many servings?</p>
          <button onClick={() => changeServingSize(1)}>1</button>
          <button onClick={() => changeServingSize(2)}>2</button>
          <button onClick={() => changeServingSize(3)}>3</button>
          <button onClick={() => changeServingSize(4)}>4</button>
        </div>
      }
    </>
  )
}

export default App
