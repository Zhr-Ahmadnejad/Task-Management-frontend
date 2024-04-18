import React, { useState } from 'react' 
import Header from './Components/Header'
import Center from './Components/Center'

function App() {

  const [boardModalOpen, setBoardModalOpen] = useState(false) /// تعریف دو ورودی با مقدار اولیه ی فالس
  return ( 
  
  <div>

  {/* Header Section */}

  <Header boardModalOpen = {boardModalOpen} setBoardModalOpen={setBoardModalOpen}/>


  {/* Center Section */}
  <Center/>


</div>
)
}

export default  App