import { DashboardStats } from '../components/dashboard/DashboardStats'

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">หน้าหลัก</h1>
        <p className="text-gray-600">ภาพรวมการดำเนินงานขนส่ง</p>
      </div>

      <DashboardStats />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
          <h3 className="font-semibold text-gray-900 mb-2">เพิ่มตารางงานใหม่</h3>
          <p className="text-sm text-gray-600">สร้างตารางงานสำหรับวันนี้</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
          <h3 className="font-semibold text-gray-900 mb-2">เพิ่มเส้นทางใหม่</h3>
          <p className="text-sm text-gray-600">กำหนดเส้นทางการขนส่ง</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
          <h3 className="font-semibold text-gray-900 mb-2">เพิ่มคนขับใหม่</h3>
          <p className="text-sm text-gray-600">ลงทะเบียนคนขับรถ</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
          <h3 className="font-semibold text-gray-900 mb-2">เพิ่มรถใหม่</h3>
          <p className="text-sm text-gray-600">ลงทะเบียนรถใหม่</p>
        </div>
      </div>
    </div>
  )
}