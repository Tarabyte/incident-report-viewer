import React, { useState } from 'react'
import './App.css'
import FilePicker from './components/FilePicker'
import FileList from './components/FileList'

function App() {
  const [files, setFiles] = useState([])

  const addFile = file => {
    setFiles(files => [file, ...files.filter(item => item.name !== file.name)])
  }

  const removeFile = name =>
    setFiles(files => files.filter(file => file.name !== name))

  return (
    <div className="app">
      <header className="app-header">
        <FilePicker onFile={addFile} />
      </header>

      <main className="app-main">
        <FileList files={files} onRemove={removeFile} />
      </main>
      <footer />
    </div>
  )
}

export default App
