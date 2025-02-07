'use client'
import React,{useState,useEffect} from 'react'
import ToDo from '../pages/ToDo'
import GoogleDrive from '../pages/GoogleDrive'
import FoodReview from '../pages/FoodReview'
import PokemonReview from '../pages/PokemonReview'
import Markdown from '../pages/Markdown'
import NavBar from '../components/NavBar'
import { useRouter,useSearchParams } from 'next/navigation';
const page = () => {
    const [currentTab,setCurrentTab] = useState('to-do')
const searchParams = useSearchParams();

 const tab = searchParams.get('tab');
  useEffect(() => {
    if (tab) {
      setCurrentTab(tab);
    }
  }, [tab]);
    

     const onShow = (activeTab: string) => {
    switch (activeTab) {
      case 'To-Do':
        return <ToDo />;
      case 'Google-Drive':
        return <GoogleDrive />;
      case 'Food-Review':
        return <FoodReview />;
      case 'Pokemon-Review':
        return <PokemonReview />;
      case 'Markdown':
        return <Markdown />;
      default:
        return <div>Loading.....</div>;
    }
  };

  return (
    <div>
        <NavBar activeTab={currentTab} setActiveTab={setCurrentTab}/>
       {currentTab && onShow(currentTab)}

    </div>
  )
}

export default page