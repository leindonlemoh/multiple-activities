import React from 'react'
import MarkdownPreview from '../components/MarkdownPreview'
import MarkDownNotes from '../components/MarkDownNotes'

const Markdown = () => {

  return (
<div className="flex flex-row w-[100%] h-[91vh] border-2 border-[black]">
  <div className=" p-4 border-2 w-[25%] border-[yellow]">
    <div className='text-black'><MarkDownNotes/></div>
  </div>
  <div className=" p-4 border-2 w-[75%]  border-[blue]">
    <MarkdownPreview />
  </div>
</div>

  )
}

export default Markdown