import { Home, PieChart, BarChart3} from 'lucide-react'


import Link from 'next/link';

export default function Sidebar() {
    
  return (
    <div className="flex flex-col w-64 bg-white">
      <div className="flex items-center justify-center h-20 shadow-md">
        <h1 className="text-3xl uppercase text-black">CapX</h1>
      </div>
      <ul className="flex flex-col py-4">
        {[
          { icon: Home, text: "Dashboard", link:'/'},
          { icon: PieChart, text: "Stock Holding",link:'/Stock-holdings' },
          { icon: BarChart3, text: "Track your Portfolio", link:'/portfolio'},
          
        ].map((item, index) => (
          <li key={index}>
            <Link href={item.link} className="w-full justify-start text-black hover:bg-gray-200" >
            <span className='flex flex-row m-4'>
              <item.icon className="mr-3 h-5 w-5" />
              {item.text}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

