import React,{useState} from 'react'
import Notes from '../components/Notes'

const ToDo = () => {

    const[noteList,setNoteList]=useState(null)
    const[selectedButton,setSelectedBUtton]=useState('#e9ff70')
    const notes = [{note:"sssssssssssssscxczxczx",date:'06/02/2025',color:'#e9ff70'},{note:"sssssssssssssscxczxczx",date:'06/02/2025',color:'#ffd670'}
        ,{note:"sssssssssssssscxczxczx",date:'06/02/2025',color:'#ff9770'}
        ,{note:"sssssssssssssscxczxczx",date:'06/02/2025',color:'#ff70a6'}
        ,{note:"sssssssssssssscxczxczx",date:'06/02/2025',color:'#e9ff70'}
        ,{note:"sssssssssssssscxczxczx",date:'06/02/2025',color:'#ff70a6'}
        ,{note:"sssssssssssssscxczxczx",date:'06/02/2025',color:'#ff9770'}
        ,{note:"sssssssssssssscxczxczx",date:'06/02/2025',color:'#70d6ff'}

    ]

  return (
    <div className='h-[91vh] p-5 flex flex-col '>
<div className='h-[50%] border-2 border-black text-black relative'>
  <form action="" className='w-full h-full flex flex-col p-4'>
    {/* Form Section with textarea and input */}
    <div className='flex-1 mb-4'>
      <div className='border-2 border-[yellow] mb-4'>
        <textarea name="note" id="note" cols={40} rows={4} className='w-full p-2'></textarea>
      </div>
      <div>
        <input type="date" name="date" id="date" className='w-full border-2 border-gray-300 p-2'/>
      </div>
    </div>

    {/* Buttons Section */}
    <div className='flex justify-center '>
      <div className='flex w-full justify-center gap-5'>
        <button type="button" className={`w-12 h-12 bg-[#e9ff70] rounded-full  border-2 ${selectedButton == '#e9ff70'? 'border-[white]' : 'border-black'}`} onClick={()=>setSelectedBUtton('#e9ff70')}></button>
        <button type="button" className={`w-12 h-12 bg-[#ffd670] rounded-full border-2 ${selectedButton == '#ffd670'? 'border-[white]' : 'border-black'}`} onClick={()=>setSelectedBUtton('#ffd670')}></button>
        <button type="button" className={`w-12 h-12 bg-[#ff9770] rounded-full border-2 ${selectedButton == '#ff9770'? 'border-[white]' : 'border-black'}`} onClick={()=>setSelectedBUtton('#ff9770')}></button>
        <button type="button" className={`w-12 h-12 bg-[#ff70a6] rounded-full border-2 ${selectedButton == '#ff70a6'? 'border-[white]' : 'border-black'}`} onClick={()=>setSelectedBUtton('#ff70a6')}></button>
        <button type="button" className={`w-12 h-12 bg-[#70d6ff] rounded-full border-2 ${selectedButton == '#70d6ff'? 'border-[white]' : 'border-black'}`} onClick={()=>setSelectedBUtton('#70d6ff')}></button>
      </div>

      {/* Submit button on the side */}
      <button type="submit" className='w-24 h-10 bg-blue-500 text-white rounded-md'>
        Submit
      </button>
    </div>
  </form>
</div>


        <div className='h-[80%] p-5 flex flex-row flex-wrap justify-start items-center gap-4'>
        {
            notes.map((items,index)=>{
                return(
                <Notes notes={items} index={index}/>
            )
        })
    }
    </div>
    </div>
  )
}

export default ToDo