import { useState } from 'react'


function App() {

  return (
    <BrowserRouter>
    <Route>
      <Route path="/login" element={<Login/>}/>
    </Route>
    </BrowserRouter>
  )
}

export default App
