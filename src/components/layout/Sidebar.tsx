import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Route, 
  Users, 
  Truck, 
  Calendar, 
  Building,
  Wrench,
  X
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navigation = [
  { name: 'หน้าหลัก', href: '/', icon: LayoutDashboard },
  { name: 'ตารางงาน', href: '/schedules', icon: Calendar },
  { name: 'เส้นทาง', href: '/routes', icon: Route },
  { name: 'ลูกค้า', href: '/customers', icon: Building },
  { name: 'คนขับ', href: '/drivers', icon: Users },
  { name: 'รถ', href: '/vehicles', icon: Truck },
  { name: 'ประเภทรถ', href: '/vehicle-types', icon: Wrench },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-white shadow-lg border-r border-gray-200 z-50 transition-all duration-300 w-64
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">ระบบจัดการขนส่ง</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <nav className="mt-6">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors
                ${isActive 
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  )
}