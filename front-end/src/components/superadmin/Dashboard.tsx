import { useState, useEffect } from "react"
import { Toaster, toast } from "react-hot-toast"
import MasterTable from "../Table/MasterTable"
import { TableAction } from "../Table/TableAction"
import { useDeleteHostelMutation, useGetAllHostelQuery, useUpdateHostelMutation } from "../../state-management/api/hostel-api"
import { useDeleteUserMutation, useGetAllUserQuery, useUpdateUserMutation } from "../../state-management/api/user-api"
import { useDeleteBookingMutation, useGetAllBookingQuery, useUpdateBookingMutation } from "../../state-management/api/booking-api"
import { useSelector } from "react-redux"
import { RootState } from "../../state-management/store/store"
import { Footer } from "../home/footer/footer"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [editingItem, setEditingItem] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const user:any= useSelector((state: RootState) => state.localAuth.user);
  const [filters, setFilters] = useState({ 
    page: 1, 
    limit: 10,
    search: "",
    status: "",
    role: "",
    isActiveStatus: ""
  })
  
  // Search input state for each tab
  const [searchInput, setSearchInput] = useState("")
   
  // API calls
  const { data: roomsData, isLoading: roomsLoading, refetch: refetchRooms } = useGetAllHostelQuery({
    page: filters.page,
    limit: filters.limit,
    search: filters.search
  })
  
  const { data: bookingsData, isLoading: bookingsLoading, refetch: refetchBookings } = useGetAllBookingQuery({
    page: filters.page,
    limit: filters.limit,
    // status: filters.status,
    search: filters.search,
    // isActiveStatus: filters.isActiveStatus
  })
  
  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = useGetAllUserQuery({
    page: filters.page,
    limit: filters.limit,
    role: filters.role,
    search: filters.search
  })

  // Mutation hooks
  const [deleteHostel] = useDeleteHostelMutation()
  const [deleteBooking] = useDeleteBookingMutation()
  const [deleteUser] = useDeleteUserMutation()
  const [updateBooking] = useUpdateBookingMutation()
  const [updateUser] = useUpdateUserMutation()
  const [updateRoom] = useUpdateHostelMutation();

  // Calculate metrics from real data
  const metrics = {
    totalRooms: roomsData?.data?.length || 0,
    totalBookings: bookingsData?.data?.length || 0,
    totalUsers: usersData?.data?.length || 0,
    tenants: usersData?.data?.filter((user: any) => user.role === 'tenant')?.length || 0,
    owners: usersData?.data?.filter((user: any) => user.role === 'owner')?.length || 0,
  }

  useEffect(() => {
    // Refetch data when tab changes
    if (activeTab === "rooms") refetchRooms()
    if (activeTab === "bookings") refetchBookings()
    if (activeTab === "users") refetchUsers()
    
    // Reset search input when tab changes
    setSearchInput("")
  }, [activeTab])

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (activeTab !== "overview") {
        setFilters(prev => ({
          ...prev,
          search: searchInput,
          page: 1 // Reset to first page when searching
        }))
      }
    }, 500) // 500ms debounce
    
    return () => clearTimeout(timeoutId)
  }, [searchInput, activeTab])

  const handleEdit = (item: any, type: string) => {
    // Set the correct status value based on the entity type
    let statusValue;
    
    switch (type) {
      case "booking":
        statusValue = item.isActiveStatus ? "1" : "0";
        break;
      case "room":
        statusValue = item.isAvailable ? "1" : "0";
        break;
      case "user":
        statusValue = item.isVerify ? "1" : "0";
        break;
      default:
        statusValue = "0";
    }
    
    setEditingItem({ 
      ...item, 
      type,
      status: statusValue
    });
    setShowModal(true);
  }

  const handleDelete = async (id: number, type: string) => {
    try {
     
      switch (type) {
        case "room":
           await deleteHostel(id).unwrap()
          break
        case "booking":
          await deleteBooking(id).unwrap()
          break
        case "user":
           await deleteUser(id).unwrap()
          break
        default:
          return
      }
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`)
      // Refetch data
      if (type === "room") refetchRooms()
      if (type === "booking") refetchBookings()
      if (type === "user") refetchUsers()
      
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to delete ${type}`)
    }
  }

  const handleSaveChanges = async () => {
    if (!editingItem) return
    
    try {
 
      // Convert the string status to number (0 or 1) as expected by backend
      const statusValue = parseInt(editingItem.status);
      
      switch (editingItem.type) {
        case "booking":
              await updateBooking({
            id: editingItem.id,
            body: {
              isActiveStatus: statusValue
            }
          }).unwrap()
          break
        case "user":
          await updateUser({
            id: editingItem.id,
            body: {
              isVerify: statusValue
            }
          }).unwrap()
          break
        case "room":
          await updateRoom({
            id: editingItem.id,
            body: {
              isAvailable: statusValue
            }
          }).unwrap()
          break
        default:
          return
      }
      
      toast.success("Changes saved successfully")
      setShowModal(false)
      // Refetch data
      if (editingItem.type === "booking") refetchBookings()
      if (editingItem.type === "user") refetchUsers()
      if (editingItem.type === "room") refetchRooms()
      
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save changes")
    }
  }

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: "",
      status: "",
      role: "",
      isActiveStatus: ""
    })
    setSearchInput("")
  }

  const MetricCard = ({
    title,
    value,
    subtitle,
    color,
  }: { title: string; value: number; subtitle?: string; color: string }) => (
    <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-brand text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div
          className={`w-12 h-12 rounded-full ${color.includes("primary") ? "bg-text-secondaryBrand opacity-60" : color.includes("secondary") ? "bg-secondary/10" : "bg-success"} flex items-center justify-center`}
        >
          <div
            className={`w-6 h-6 rounded ${color.includes("primary") ? "bg-fav" : color.includes("secondary") ? "bg-secondary" : "bg-text-secondaryBrand"}`}
          ></div>
        </div>
      </div>
    </div>
  )

  // Prepare data for MasterTable based on active tab
  const getTableData = () => {
    switch (activeTab) {
      case "rooms":
        const rooms = roomsData?.data || []
        return {
          columns: [
            { key: "aawasName", title: "Aawas Name" },
            { key: "roomTitle", title: "Room Title" },
            { key: "location", title: "Location" },
            { key: "price", title: "Price" },
            { key: "status", title: "Status" },
            { key: "owner", title: "Owner" },
            { key: "actions", title: "Actions" },
          ],
          rows: rooms.map((room: any) => ({
            aawasName: room.hostelName,
            roomTitle: room.title,
            location: room.location,
            price: `Rs. ${room.price}`,
            status: (
              <span className={`px-2 py-1 rounded text-xs ${
                room.isAvailable ? "bg-complete text-other-white-100" : "bg-danger text-love"
              }`}>
                {room.isAvailable ? "Available" : "Unavailable"}
              </span>
            ),
            owner: room.ownerEmail,
            actions: (
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(room, "room")}
                  className="bg-brand text-other-white-100 px-3 py-1 rounded text-xs hover:bg-dark"
                >
                  Edit
                </button>
                <TableAction onDelete={() => handleDelete(room.id, "room")} />
              </div>
            )
          }))
        }
      case "bookings":
        const bookings = bookingsData?.data || []
        return {
          columns: [
            { key: "roomTitle", title: "Awaas Name" },
            { key: "tenant", title: "Tenant" },
            { key: "checkIn", title: "Check In" },
            { key: "checkOut", title: "Check Out" },
            { key: "amount", title: "Amount" },
            { key: "status", title: "Status" },
            { key: "actions", title: "Actions" },
          ],
          rows: bookings.map((booking: any) => ({
            roomTitle: booking.room?.hostelName || "N/A",
            tenant: booking.user?.userName || "N/A",
            checkIn: new Date(booking.checkInDate).toLocaleDateString(),
            checkOut: booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : "N/A",
            amount: `Rs. ${booking.payment || 0}`,
            status: (
              <span className={`px-2 py-1 rounded text-xs ${
                booking.isActiveStatus ? "bg-complete text-black" : "bg-danger text-love"
              }`}>
                {booking.isActiveStatus ? "Active" : "Inactive"}
              </span>
            ),
            actions: (
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(booking, "booking")}
                  className="bg-brand text-other-white-100 px-3 py-1 rounded text-xs hover:bg-dark"
                >
                  Edit
                </button>
                <TableAction onDelete={() => handleDelete(booking.id, "booking")} />
              </div>
            )
          }))
        }
      
      case "users":
        const users = usersData?.data || []
        return {
          columns: [
            { key: "name", title: "Name" },
            { key: "email", title: "Email" },
            { key: "type", title: "Type" },
            { key: "phone", title: "Phone" },
            { key: "joinDate", title: "Join Date" },
            { key: "status", title: "Status" },
            { key: "actions", title: "Actions" },
          ],
          rows: users.map((user: any) => ({
            name: user.userName,
            email: user.email,
            type: (
              <span className={`px-2 py-1 rounded text-xs uppercase ${
                user.role === "superadmin" ? "bg-complete text-black" : user.role === "owner" ? "bg-brand text-input-bg" :
                "bg-other-black-600 text-input-bg"
              }`}>
                {user.role}
              </span>
            ),
            phone: user.contact,
            joinDate: new Date(user.createdAt).toLocaleDateString(),
            status: (
              <span className={`px-2 py-1 rounded text-xs ${
                user.isVerify ? "bg-complete text-black" : "bg-danger text-love"
              }`}>
                {user.isVerify? "Verified" : "Not Verified"}
              </span>
            ),
            actions: (
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(user, "user")}
                  className="bg-brand text-other-white-100 px-3 py-1 rounded text-xs hover:bg-dark"
                >
                  Edit
                </button>
                <TableAction onDelete={() => handleDelete(user.id, "user")} />
              </div>
            )
          }))
        }
      
      default:
        return { columns: [], rows: [] }
    }
  }

  const tableData = getTableData()
  const isLoading = roomsLoading || bookingsLoading || usersLoading

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand">Sajilo Aawas</h1>
            <p className="text-muted-foreground">Superadmin Dashboard</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="bg-other-white-100 text-secondary-foreground px-2 py-2 rounded-lg text-sm font-normal uppercase text-justify" >
              {user.userName}
            </div>
            <p className="text-sm uppercase border-green-300 border text-slate-700 px-2 py-1 rounded-lg">{user.role}</p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-card border-b border-border px-6 py-3">
        <div className="flex gap-4 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8">
          {["overview", "rooms", "bookings", "users"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "bg-brand text-other-white-100"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <MetricCard title="Total Rooms" value={metrics.totalRooms} color="text-primary" />
              <MetricCard title="Total Bookings" value={metrics.totalBookings} color="text-secondary" />
              <MetricCard title="Total Users" value={metrics.totalUsers} color="text-accent" />
              <MetricCard
                title="Tenants"
                value={metrics.tenants}
                subtitle="Active renters"
                color="text-chart-1"
              />
              <MetricCard
                title="Owners"
                value={metrics.owners}
                subtitle="Property owners"
                color="text-chart-2"
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {bookingsData?.data?.slice(0, 3).map((booking: any) => (
                    <div key={booking.id} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-chart-1 rounded-full"></div>
                      <span className="text-sm text-foreground">
                        New booking for {booking.room?.title || "a room"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">System Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Available Rooms</span>
                    <span className="text-sm font-medium text-chart-2">
                      {roomsData?.data?.filter((room: any) => room.isAvailable)?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Pending Bookings</span>
                    <span className="text-sm font-medium text-chart-3">
                      {bookingsData?.data?.filter((booking: any) => booking.status === "pending")?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Maintenance Required</span>
                    <span className="text-sm font-medium text-destructive">
                      {roomsData?.data?.filter((room: any) => !room.isAvailable)?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab !== "overview" && (
          <div className="bg-card rounded-lg overflow-hidden">
            <div className="px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-card-foreground capitalize">
                {activeTab} Management
              </h3>
              
              {/* Search and Reset Controls */}
              <div className="flex gap-2 items-center">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    className="px-4 py-2 border border-border rounded-lg bg-input text-foreground pr-10"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  {searchInput && (
                    <button
                      onClick={() => setSearchInput("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-text-secondaryBrand text-bg-brand rounded-lg hover:bg-muted/80"
                >
                  Reset
                </button>
              </div>
            </div>
            {isLoading ? (
              <div className="p-8 text-center">Loading...</div>
            ) : (
              <MasterTable
                rows={tableData.rows}
                columns={tableData.columns}
                loading={false}
                showCheckbox={false}
                pagination={{
                  currentPage: filters.page,
                  totalPage: Math.ceil(tableData.rows.length / filters.limit),
                  limit: filters.limit,
                  onClick: ({ page, limit }) => {
                    setFilters((prev) => ({
                      ...prev,
                      page: page || prev.page,
                      limit: limit || prev.limit,
                    }))
                  },
                }}
              />
            )}
          </div>
        )}
               <Footer />
      </main>

      {/* Modal for Edit/Add */}
      {showModal && editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-md mx-4 border border-border">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Edit {editingItem.type}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Name/Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground"
                  value={editingItem?.room?.hostelName || editingItem.hostelName|| editingItem.userName || ""}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Status</label>
                <select 
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground"
                  value={editingItem.status}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    status: e.target.value
                  })}
                >
                  {editingItem.type === "booking" && (
                    <>
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </>
                  )}
                  {editingItem.type === "room" && (
                    <>
                      <option value="1">Available</option>
                      <option value="0">Unavailable</option>
                    </>
                  )}
                  {editingItem.type === "user" && (
                    <>
                      <option value="1">Verified</option>
                      <option value="0">Not Verified</option>
                    </>
                  )}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-text-secondaryBrand  text-bg-brand px-4 py-2 rounded-lg hover:bg-muted/80"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="flex-1 bg-second-brand text-bg-brand px-4 py-2 rounded-lg hover:bg-primary/90"
              >
                Save Changes
              </button>
            </div>
          </div>
 
        </div>
      )}
      
    </div>
  )
}