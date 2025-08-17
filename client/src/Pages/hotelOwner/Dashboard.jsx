import React, { useEffect } from 'react'
import Title from '../../Components/Title'
import { assets } from '../../assets/assets'
import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

const Dashboard = () => {
  const { currency, user, getToken, toast, axios } = useAppContext();



  // Making a State variable 
  const [dashboardData, setDashboardData] = useState({
    bookings: [],
    totalBookings: 0,
    totalRevenue: 0,
  });
  // now we can use this data

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get(
        `/api/bookings/hotel`,
        { headers: { Authorization: `Bearer ${await getToken()}` } })
      if (data.success) {
        setDashboardData(data.dashboardData)
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }


useEffect(()=>{
  if (user) {
    fetchDashboardData();
  }
}, [user])

return (
  <div>
    <Title align='left' font='outfit' title='Dashboard'
      subTitle="Monitor your room listings, track bookings and anaylze revenue-all in one place. Stay
      updated with real-time insights to ensure smooth operations" />
    {/* Now we will display two cards for total booking and Total Revenue */}

    <div className='flex gap-4 my-8'>
      {/* Total Bookings */}
      <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
        <img src={assets.totalBookingIcon} alt="" className='max-sm:hidden h-10' />
        <div className='flex flex-col sm:ml-4 font-medium'>
          <p className='text-blue-500 text-lg' >Total Bookings</p>
          <p className='text-neutral-400 text-base' >{currency} {dashboardData.totalBookings}</p>

        </div>
      </div>


      {/* Total Revenue Card */}
      <div className='flex-1 bg-white border border-primary/10 rounded-lg p-4 pr-8 shadow-sm flex items-center min-w-0 sm:flex-grow-0 sm:basis-1/2 lg:basis-auto'>
        <img src={assets.totalRevenueIcon} alt="Total Revenue Icon" className='max-sm:hidden h-10 w-10 mr-4 flex-shrink-0' />
        <div className='flex flex-col font-medium flex-grow min-w-0'> {/* Added min-w-0 to prevent overflow */}
          <p className='text-blue-500 text-lg sm:text-base'>Total Revenue</p>
          <p className='text-neutral-700 text-base font-semibold sm:text-lg'>{currency} {dashboardData.totalRevenue}</p>
        </div>
      </div>
    </div>

    {/* Recent Bookings Section Title */}
    <h2 className='text-xl text-blue-950/70 font-medium mb-5'>Recent Bookings</h2>

    {/* Table Container - Critical for mobile responsiveness */}
    {/* Added `overflow-scroll` which combines x and y auto if needed, or `overflow-x-auto` specifically */}
    {/* `w-full` for full width, `block` to ensure overflow-x-auto works, `rounded-lg` here is fine */}
    <div className='w-full overflow-x-auto border border-gray-300 rounded-lg'> {/* No max-w-full needed, removed max-h-80 for now to debug scrolling */}
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'> {/* Removed sticky top-0 and z-10 for mobile for simplicity, add back if needed after fixing layout */}
          <tr>
            <th scope="col" className='py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>User Name</th>
            <th scope="col" className='py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell'>Room Name</th>
            <th scope="col" className='py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>Total Amount</th>
            <th scope="col" className='py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>Payment Status</th>
          </tr>
        </thead>

        <tbody className='bg-white divide-y divide-gray-200'>
          {dashboardData.bookings.map((item, index) => (
            <tr key={index}>
              <td className='py-3 px-4 text-gray-700 whitespace-nowrap text-sm'>
                {item.user.username}
              </td>
              <td className='py-3 px-4 text-gray-700 whitespace-nowrap hidden sm:table-cell text-sm'>
                {item.room.roomType}
              </td>
              <td className='py-3 px-4 text-gray-700 whitespace-nowrap text-right text-sm'>
                {currency}  {item.totalPrice}
              </td>
              <td className='py-3 px-4 text-gray-700 whitespace-nowrap text-sm'>
                <div className="flex justify-center">
                  <button
                    className={`py-1 px-3 text-xs rounded-full font-semibold
                                  ${item.isPaid ? "bg-green-100 text-green-600" : "bg-amber-100 text-yellow-600"}`}>
                    {item.isPaid ? "Completed" : "Pending"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
};

export default Dashboard