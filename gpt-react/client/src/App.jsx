import { useState } from 'react'
import './App.css'
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_API_KEY,
    dangerouslyAllowBrowser: true
});
function App() {
  const [search, setSearch] = useState('')
  const [response, setResponse] = useState('')
  
  const submitHandler = async (e) => {
    e.preventDefault()
    const response = await openai.chat.completions.create({
      model: "gpt-4-32k",
      messages: [{ role: "user", content: search }],
    });
    setSearch('')
    console.log(response)
    console.log(response.choices[0].message.content);
    setResponse(response.choices[0].message.content)
  }
  return (
    <>
      <h1>Search Chat GPT</h1>
      <form onSubmit={submitHandler}>
        <input type="text" name="search" onChange={(e) => setSearch(e.target.value)} value={search}/>
        <input type="submit" value="Submit" />
      </form>
      {
        response && <p>{response}</p>
      }
    </>
  )
}

export default App
