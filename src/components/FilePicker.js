import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDropzone } from 'react-dropzone'
import './FilePicker.css'

const FilePicker = ({ onFile }) => {
  const onDrop = useCallback(
    files => {
      ;[...files].forEach(file => {
        const reader = new FileReader()

        reader.addEventListener('load', e => {
          onFile({
            name: file.name,
            content: e.target.result,
          })
        })

        reader.readAsText(file)
      })
    },
    [onFile],
  )

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <div {...getRootProps({ className: 'filepicker' })}>
      <input {...getInputProps()} />
      <p>Перетащите несколько один или несколько XML файлов с отчетами</p>
    </div>
  )
}

FilePicker.propTypes = {
  onFile: PropTypes.func.isRequired,
}

export default FilePicker
