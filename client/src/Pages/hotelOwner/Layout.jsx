import React, { useEffect } from 'react'
import Navbar from '../../Components/hotelOwner/Navbar'
import Sidebar from '../../Components/hotelOwner/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const Layout = () => {

  const {isOwner, navigate} = useAppContext()

  useEffect(()=>{
    if(!isOwner){
      navigate('/')
    }
  },[isOwner])
  
  return (
    <div className='flex flex-col h-screen'>

        {/* Importing and Mounting the Navbar from HotelOwner Folder */}
        <Navbar/>  
        <div className='flex h-full'>
            <Sidebar/>

            {/* due to property flex-1 it will use the entire space available and it will be displayed in the right side */}
            <div className='flex-1 p-4 pt-10 md:px-10 h-full'>
                <Outlet/>
            </div>
        </div>

    </div>
  )
}

export default Layout