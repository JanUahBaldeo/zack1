import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { Progress } from '../ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { 
  MoreHorizontal, 
  Plus, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  MessageCircle,
  Bell,
  Search,
  Edit,
  ChevronRight,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { useState } from 'react'

export function LOADashboard() {
  const [selectedFilters, setSelectedFilters] = useState({
    loanOfficer: 'all',
    status: 'all',
    priority: 'all'
  })

  // Mock data for pipeline stages
  const pipelineStages = [
    { name: 'Application Received', color: 'bg-teal-500', count: 2 },
    { name: 'Pre-Approval Issued', color: 'bg-gray-500', count: 1 },
    { name: 'In Processing', color: 'bg-blue-500', count: 3 },
    { name: 'Submitted to Underwriting', color: 'bg-red-500', count: 2 },
    { name: 'Conditional Approval', color: 'bg-orange-500', count: 1 },
    { name: 'Docs Out / Scheduled to Close', color: 'bg-green-500', count: 2 }
  ]

  const pipelineData = [
    {
      id: '1',
      borrowerName: 'John Smith',
      loanId: 'LN-001',
      propertyAddress: '123 Main St',
      loanType: 'Conventional',
      targetCloseDate: '2024-02-15',
      stage: 'Application Received'
    },
    {
      id: '2',
      borrowerName: 'Sarah Johnson', 
      loanId: 'LN-002',
      propertyAddress: '456 Oak Ave',
      loanType: 'FHA',
      targetCloseDate: '2024-02-20',
      stage: 'In Processing'
    }
  ]

  // Task Management Categories
  const taskCategories = [
    {
      title: 'Documentation Collection',
      color: 'bg-teal-500',
      tasks: [
        { id: 1, title: 'W2s', status: 'On Track', priority: 'High' },
        { id: 2, title: 'Pay Stubs', status: 'Pending', priority: 'Medium' }
      ]
    },
    {
      title: 'Order Services',
      color: 'bg-blue-500',
      tasks: [
        { id: 3, title: 'Appraisal', status: 'On Track', priority: 'High' },
        { id: 4, title: 'Title', status: 'Pending', priority: 'Medium' }
      ]
    },
    {
      title: 'Compliance & Disclosures',
      color: 'bg-purple-500',
      tasks: [
        { id: 5, title: 'Initial', status: 'On Track', priority: 'High' },
        { id: 6, title: 'Assessments', status: 'Pending', priority: 'Medium' }
      ]
    },
    {
      title: 'LO/Processor Follow-ups',
      color: 'bg-green-500',
      tasks: [
        { id: 7, title: 'Call Client', status: 'On Track', priority: 'High' },
        { id: 8, title: 'Assessments', status: 'Pending', priority: 'Medium' }
      ]
    },
    {
      title: 'Client Communication Touchpoints',
      color: 'bg-orange-500',
      tasks: [
        { id: 9, title: 'Update', status: 'On Track', priority: 'High' },
        { id: 10, title: 'Assessments', status: 'Pending', priority: 'Medium' }
      ]
    }
  ]

  const dueTodayTasks = [
    { id: 1, title: 'LOA', subtitle: 'Follow up', dueDate: '2024-02-15', status: 'On Track', priority: 'Pending' },
    { id: 2, title: 'LOA', subtitle: 'Due date', dueDate: '2024-02-15', status: 'On Track', priority: 'Pending' },
    { id: 3, title: 'LOA', subtitle: 'Follow up', dueDate: '2024-02-15', status: 'On Track', priority: 'Pending' }
  ]

  const followUpTasks = [
    { id: 1, title: 'LOA', subtitle: 'Due date', dueDate: '2024-02-16', status: 'On Track', priority: 'Pending' },
    { id: 2, title: 'LOA', subtitle: 'Follow up', dueDate: '2024-02-17', status: 'On Track', priority: 'Pending' },
    { id: 3, title: 'LOA', subtitle: 'Due date', dueDate: '2024-02-18', status: 'On Track', priority: 'Pending' }
  ]

  const documentChecklist = [
    { id: 1, name: 'Document 1', status: 'REQUIRED', date: 'Feb 15, 2024', checked: false },
    { id: 2, name: 'Document 2', status: 'REQUIRED', date: 'Feb 16, 2024', checked: false },
    { id: 3, name: 'Document 3', status: 'RECEIVED', date: 'Feb 17, 2024', checked: true },
    { id: 4, name: 'Document 4', status: 'PENDING', date: 'Feb 18, 2024', checked: false }
  ]

  const notifications = [
    { id: 1, type: 'error', title: 'LOREM IPSUM DOLOR', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', time: '31 July, 2025 at 3:01pm' },
    { id: 2, type: 'warning', title: 'LOREM IPSUM DOLOR', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', time: '29 July, 2025 at 5:00pm' },
    { id: 3, type: 'success', title: 'LOREM IPSUM DOLOR', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', time: '29 July, 2025 at 8:00am' },
    { id: 4, type: 'success', title: 'LOREM IPSUM DOLOR', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', time: '28 July, 2025 at 11:55pm' },
    { id: 5, type: 'warning', title: 'LOREM IPSUM DOLOR', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', time: '28 July, 2025 at 1:45pm' }
  ]

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'error': return 'bg-red-500'
      case 'warning': return 'bg-orange-500'
      case 'success': return 'bg-green-500'
      default: return 'bg-blue-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REQUIRED': return 'bg-red-500 text-white'
      case 'RECEIVED': return 'bg-green-500 text-white'
      case 'PENDING': return 'bg-yellow-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  return (
    <div className="space-y-6">
      {/* Pipeline Section */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="flex space-x-4 overflow-x-auto pb-4 px-6">
            {pipelineStages.map((stage) => (
              <div key={stage.name} className="flex-shrink-0 w-64">
                <div className={`${stage.color} text-white rounded-t-lg p-3 text-center`}>
                  <h3 className="font-medium text-sm">{stage.name}</h3>
                </div>
                <div className="bg-gray-100 rounded-b-lg min-h-48 p-3">
                  {/* Sample cards */}
                  {stage.name === 'Application Received' && (
                    <>
                      <Card className="mb-3">
                        <CardContent className="p-3">
                          <div className="space-y-2">
                            <div className="font-medium text-sm">Borrower Name</div>
                            <div className="text-xs text-muted-foreground">Loan # / Property Address</div>
                            <div className="text-xs text-muted-foreground">Loan Type</div>
                            <div className="text-xs text-muted-foreground">Target Close Date</div>
                            <div className="flex space-x-1">
                              <Badge className="bg-green-500 text-white text-xs">On Track</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-3">
                          <div className="space-y-2">
                            <div className="font-medium text-sm">Borrower Name</div>
                            <div className="text-xs text-muted-foreground">Loan # / Property Address</div>
                            <div className="text-xs text-muted-foreground">Loan Type</div>
                            <div className="text-xs text-muted-foreground">Target Close Date</div>
                            <div className="flex space-x-1">
                              <Badge className="bg-yellow-500 text-white text-xs">Pending</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Task Management Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Task Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {taskCategories.map((category) => (
            <Card key={category.title}>
              <CardHeader className={`${category.color} text-white rounded-t-lg py-3`}>
                <CardTitle className="text-sm">{category.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-2">
                {category.tasks.map((task) => (
                  <div key={task.id} className="space-y-1">
                    <div className="text-sm font-medium">{task.title}</div>
                    <div className="flex justify-between items-center">
                      <Badge className="bg-green-500 text-white text-xs">{task.status}</Badge>
                      <Badge className="bg-yellow-500 text-white text-xs">{task.priority}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">Notes</div>
                    <div className="text-xs text-muted-foreground">Assignments</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Due Today, Follow-up, and Documentation Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Due Today */}
        <Card className="bg-pink-50">
          <CardHeader>
            <CardTitle>Due today</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dueTodayTasks.map((task) => (
              <div key={task.id} className="space-y-2">
                <div className="font-medium text-sm">{task.title}</div>
                <div className="text-xs text-muted-foreground">{task.subtitle}</div>
                <div className="text-xs text-muted-foreground">Due date</div>
                <div className="flex space-x-2">
                  <Badge className="bg-green-500 text-white text-xs">{task.status}</Badge>
                  <Badge className="bg-yellow-500 text-white text-xs">{task.priority}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Follow-up */}
        <Card className="bg-yellow-50">
          <CardHeader>
            <CardTitle>Follow-up</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {followUpTasks.map((task) => (
              <div key={task.id} className="space-y-2">
                <div className="font-medium text-sm">{task.title}</div>
                <div className="text-xs text-muted-foreground">{task.subtitle}</div>
                <div className="text-xs text-muted-foreground">Due date</div>
                <div className="flex space-x-2">
                  <Badge className="bg-green-500 text-white text-xs">{task.status}</Badge>
                  <Badge className="bg-yellow-500 text-white text-xs">{task.priority}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Documentation Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Documentation Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4 text-xs font-medium text-muted-foreground border-b pb-2">
                <span>STATUS ↑</span>
                <span>DOCUMENTS ↑</span>
                <span>DATE ↑</span>
              </div>
              {documentChecklist.map((doc) => (
                <div key={doc.id} className="grid grid-cols-3 gap-4 items-center">
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={doc.checked} />
                    <Badge className={`text-xs ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-blue-600 underline cursor-pointer">
                    {doc.name} <Edit className="inline w-3 h-3" />
                  </div>
                  <div className="text-xs text-muted-foreground">{doc.date}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications and Communication Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card>
          <CardHeader className="flex flex-row items-center space-x-2">
            <Bell className="w-5 h-5 text-orange-500" />
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start space-x-3">
                <div className={`w-16 h-6 rounded text-white text-xs flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                  {notification.type.toUpperCase()}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="font-medium text-sm">{notification.title}</div>
                  <div className="text-xs text-muted-foreground">{notification.message}</div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {notification.time}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="text-sm text-muted-foreground mb-2">% of loans on schedule</div>
              <div className="text-3xl font-bold">%</div>
            </div>
            <div className="bg-yellow-100 p-4 rounded">
              <div className="text-sm font-medium mb-2">Top overdue files</div>
            </div>
            <div className="bg-blue-100 p-4 rounded">
              <div className="text-sm font-medium mb-2">Avg days in processing</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Communication Log and Collaboration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Communication Log */}
        <Card>
          <CardHeader className="flex flex-row items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-green-500" />
            <CardTitle>Communication Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-4 border-b">
                <Button variant="ghost" className="text-blue-600 border-b-2 border-blue-600">
                  Borrower Updates <Badge className="ml-2 bg-blue-500 text-white">15</Badge>
                </Button>
                <Button variant="ghost">
                  Processor Feedback <Badge className="ml-2 bg-gray-500 text-white">0</Badge>
                </Button>
                <Button variant="ghost">
                  Agent updates <Badge className="ml-2 bg-gray-500 text-white">15</Badge>
                </Button>
                <Button variant="ghost">
                  Messages <Badge className="ml-2 bg-gray-500 text-white">25</Badge>
                </Button>
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs font-medium text-muted-foreground border-b pb-2">
                <span>LOREM IPSUM ↑</span>
                <span>LOREM IPSUM ↑</span>
                <span>LOREM IPSUM ↑</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Joshua Bennett</div>
                    <div className="text-xs text-muted-foreground">MM/DD/YYYY</div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Daniel Peters</div>
                    <div className="text-xs text-muted-foreground">MM/DD/YYYY</div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Collaboration & Handoff */}
        <Card>
          <CardHeader className="flex flex-row items-center space-x-2">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <CardTitle>Collaboration & Handoff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-4 border-b">
                <Button variant="ghost" className="text-blue-600 border-b-2 border-blue-600">
                  Loan Type 1 <Badge className="ml-2 bg-blue-500 text-white">15</Badge>
                </Button>
                <Button variant="ghost">
                  Loan Type 2 <Badge className="ml-2 bg-gray-500 text-white">0</Badge>
                </Button>
                <Button variant="ghost">
                  Loan Type 3 <Badge className="ml-2 bg-gray-500 text-white">15</Badge>
                </Button>
                <Button variant="ghost">
                  Loan Type 4 <Badge className="ml-2 bg-gray-500 text-white">25</Badge>
                </Button>
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs font-medium text-muted-foreground border-b pb-2">
                <span>POINT OF CONTACT ↑</span>
                <span>PROGRESS ↑</span>
                <span>UPDATES ↑</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Leo Martinez</div>
                  </div>
                  <div>
                    <Badge className="bg-red-500 text-white text-xs">MAKE READY FOR NEXT STAGE</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Susan Lawrence</div>
                  </div>
                  <div>
                    <Badge className="bg-red-500 text-white text-xs">MAKE READY FOR NEXT STAGE</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Lorem ipsum dolor sit amet
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}