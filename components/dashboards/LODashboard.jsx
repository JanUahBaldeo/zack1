import { PipelineWidget } from '../widgets/PipelineWidget.jsx'
import { TaskWidget } from '../widgets/TaskWidget.jsx'
import { CalendarWidget } from '../widgets/CalendarWidget.jsx'
import { MarketingWidget } from '../widgets/MarketingWidget.jsx'
import { PerformanceWidget } from '../widgets/PerformanceWidget.jsx'
import { LeadAnalyticsWidget } from '../widgets/LeadAnalyticsWidget.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx'
import { Badge } from '../ui/badge.jsx'
import { Button } from '../ui/button.jsx'
import { TrendingUp, TrendingDown, ArrowUpRight, Filter } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export function LODashboard() {
  // Mock data for charts
  const campaignData = [
    { month: 'Jan', leads: 45 },
    { month: 'Feb', leads: 52 },
    { month: 'Mar', leads: 48 },
    { month: 'Apr', leads: 61 },
    { month: 'May', leads: 55 },
    { month: 'Jun', leads: 67 },
    { month: 'Jul', leads: 72 },
    { month: 'Aug', leads: 69 },
    { month: 'Sep', leads: 75 },
    { month: 'Oct', leads: 82 },
    { month: 'Nov', leads: 89 },
    { month: 'Dec', leads: 95 }
  ]

  const leadSourceData = [
    { name: 'Facebook ads', value: 19.8, color: '#ef4444' },
    { name: 'Health and Careers', value: 33, color: '#f97316' },
    { name: 'Lorem Ipsum', value: 29.1, color: '#3b82f6' },
    { name: 'Other', value: 22.2, color: '#8b5cf6' }
  ]

  const marketingMetrics = [
    {
      title: 'Email Open Rate',
      value: '%',
      change: '+18%',
      trend: 'up',
      subtitle: '+3.8k this week'
    },
    {
      title: 'Click-Through Rate', 
      value: '%',
      change: '+18%',
      trend: 'up',
      subtitle: '+3.8k this week'
    },
    {
      title: 'Contact Growth Tracker',
      value: 'XX',
      change: '+18%', 
      trend: 'up',
      subtitle: '+3.8k this week'
    }
  ]

  const taskColumns = [
    {
      title: "Today's Tasks",
      color: 'bg-teal-500',
      tasks: [
        { id: 1, title: 'Follow up with Sarah Johnson', type: 'Call', priority: 'high', time: '9:00 AM' },
        { id: 2, title: 'Review loan documents', type: 'Review', priority: 'medium', time: '10:30 AM' },
        { id: 3, title: 'Client meeting prep', type: 'Meeting', priority: 'high', time: '2:00 PM' }
      ]
    },
    {
      title: 'Overdue Tasks',
      color: 'bg-orange-500',
      tasks: [
        { id: 4, title: 'Submit application', type: 'Submit', priority: 'urgent', time: '2 days ago' },
        { id: 5, title: 'Client callback', type: 'Call', priority: 'high', time: '1 day ago' }
      ]
    },
    {
      title: 'Upcoming in 48 Hours',
      color: 'bg-blue-500',
      tasks: [
        { id: 6, title: 'Property inspection', type: 'Inspection', priority: 'medium', time: 'Tomorrow 3:00 PM' },
        { id: 7, title: 'Loan closing', type: 'Closing', priority: 'high', time: 'Day after 10:00 AM' },
        { id: 8, title: 'Document review', type: 'Review', priority: 'medium', time: 'Day after 2:00 PM' }
      ]
    }
  ]

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white'
      case 'high': return 'bg-orange-500 text-white'
      case 'medium': return 'bg-blue-500 text-white'
      case 'low': return 'bg-gray-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  return (
    <div className="space-y-6">
      {/* Pipeline Section - Full Width */}
      <div className="w-full">
        <PipelineWidget role="LO" />
      </div>

      {/* Marketing Activities Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Marketing Activities</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Marketing Metrics */}
          {marketingMetrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold">{metric.value}</span>
                    <Badge className={`${metric.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {metric.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {metric.change}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{metric.subtitle}</p>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Purpose Statement */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  The purpose of this project is to have a WORKDESK - meaning a place to have Clear and Actionable items. 
                  Wish to put this Statement here to help align what should be in this project. 
                  If something is not actionable then we may not want to have it here or we need to present it differently
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts Section - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Campaigns */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Top Performing Campaigns</CardTitle>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={campaignData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#666' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#666' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="leads" 
                    stroke="#06b6d4" 
                    strokeWidth={3}
                    dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#06b6d4', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Lead Source Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Source Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="relative">
                <ResponsiveContainer width={200} height={200}>
                  <PieChart>
                    <Pie
                      data={leadSourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {leadSourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="ml-6 space-y-2">
                {leadSourceData.map((source, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: source.color }}
                    />
                    <span className="text-sm text-muted-foreground">{source.name}</span>
                    <span className="text-sm font-medium">{source.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Tasks Section</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {taskColumns.map((column, index) => (
            <Card key={index}>
              <CardHeader className={`${column.color} text-white rounded-t-lg`}>
                <CardTitle className="text-sm font-medium">{column.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {column.tasks.map((task) => (
                  <div key={task.id} className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-medium">{task.title}</h4>
                      <Badge className={getPriorityColor(task.priority)} size="sm">
                        {task.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{task.type}</span>
                      <span>{task.time}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">Action</Button>
                      <Button size="sm" variant="outline" className="flex-1">Info</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Calendar Section */}
      <div className="w-full">
        <CalendarWidget role="LO" />
      </div>
    </div>
  )
}