import React, { useState, useEffect, useRef } from 'react'
import classNames from 'classnames'

import './FileList.css'

const parser = new DOMParser()
const parse = str => parser.parseFromString(str, 'application/xml')

const Img = ({ data, rootClassName, ...props }) => {
  const [magnified, setMagnified] = useState(false)

  const toggle = e => {
    console.log('toggle')
    e.stopPropagation()
    setMagnified(magnified => !magnified)
  }

  const ref = useRef(null)

  useEffect(() => {
    if (magnified) {
      const listener = e => {
        if (!ref.current || ref.current.contains(e.target)) {
          return
        }

        setMagnified(false)
      }
      document.addEventListener('click', listener)

      return () => document.removeEventListener('click', listener)
    }
  }, [magnified])

  return (
    <div
      ref={ref}
      onClick={toggle}
      className={classNames(
        'filelist-img-container',
        rootClassName,
        magnified && 'filelist-img-container__magnified',
      )}
    >
      <img src={`data:image/png;base64,${data}`} alt="" {...props} />
    </div>
  )
}

const FileList = ({ files, onRemove }) => (
  <table className="filelist">
    <thead>
      <tr>
        <th>Название</th>
        <th>Распознанные данные</th>
        <th>Номер</th>
        <th>Т/С</th>
        <th>Дополнительные изображения</th>
      </tr>
    </thead>
    <tbody>
      {files.map(file => {
        const document = parse(file.content)

        const knownNodes = new Set(['v_photo_grz', 'v_photo_ts'])
        return (
          <tr key={file.name}>
            <td>
              {file.name}{' '}
              <button
                className="filelist-remove"
                onClick={() => onRemove(file.name)}
              >
                <span role="img" aria-label="remove">
                  ❎
                </span>
              </button>
            </td>
            <td>
              <ul>
                {[...document.querySelector('tr_checkIn').childNodes]
                  .filter(
                    node =>
                      node.nodeType === node.ELEMENT_NODE &&
                      !knownNodes.has(node.nodeName),
                  )
                  .map(node => (
                    <li key={node.nodeName}>
                      {node.nodeName} - {node.textContent}
                    </li>
                  ))}
              </ul>
            </td>
            <td>
              <Img
                data={document.querySelector('v_photo_grz').textContent}
                alt="Номер"
              />
            </td>
            <td>
              <Img
                data={document.querySelector('v_photo_ts').textContent}
                alt="Транспортное средство"
                rootClassName="filelist-img__main"
              />
            </td>
            <td>
              {[...document.querySelectorAll('v_photo_extra')].map(
                (extra, i) => (
                  <Img
                    key={i}
                    data={extra.textContent}
                    alt="Дополнительное фото"
                    rootClassName="filelist-img__additional"
                  />
                ),
              )}
            </td>
          </tr>
        )
      })}
      {files.length === 0 && (
        <tr>
          <td colSpan={5} className="filelist-empty">
            Нет файлов
          </td>
        </tr>
      )}
    </tbody>
  </table>
)

export default FileList
