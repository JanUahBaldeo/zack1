import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Calendar, Clock, AlertTriangle, CheckCircle } from 'lucide-react'

interface Deadline {
  id: string
  title: string
  loanNumber: string
  borrowerName: string
  dueDate: string
  daysUntilDue: number
  priority: 'critical' | 'high' | 'medium' | 'low'
  type: 'milestone' | 'document' | 'task' | 'submission'
  status: 'overdue' | 'due-soon' | 'upcoming' | 'completed'
}

export function DeadlineWidget() {
  const mockDeadlines: Deadline[] = [
    {
      id: '1',
      title: 'Submit to Underwriting',
      loanNumber: 'LN-2024-001',
      borrowerName: 'John Smith',
      dueDate: '2024-02-14',
      daysUntilDue: -1,
      priority: 'critical',
      type: 'submission',
      status: 'overdue'
    },
    {
      id: '2',
      title: 'Appraisal Due',
      loanNumber: 'LN-2024-002',
      borrowerName: 'Robert Johnson',
      dueDate: '2024-02-16',
      daysUntilDue: 1,
      priority: 'high',
      type: 'milestone',
      status: 'due-soon'
    },
    {
      id: '3',
      title: 'Rate Lock Expires',
      loanNumber: 'LN-2024-003',
      borrowerName: 'Maria Garcia',
      dueDate: '2024-02-18',
      daysUntilDue: 3,
      priority: 'high',
      type: 'milestone',
      status: 'due-soon'
    },
    {
      id: '4',
      title: 'Title Work Complete',
      loanNumber: 'LN-2024-004',
      borrowerName: 'David Wilson',
      dueDate: '2024-02-20',
      daysUntilDue: 5,
      priority: 'medium',
      type: 'document',
      status: 'upcoming'
    }
  ]

  const getStatusIcon = (status: Deadline['status']) => {
    switch (status) {
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'due-soon':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'upcoming':
        return <Calendar className="h-4 w-4 text-blue-500" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const getStatusBadge = (status: Deadline['status']) => {
    switch (status) {
      case 'overdue':
        return <Badge variant="destructive" className="text-xs">Overdue</Badge>
      case 'due-soon':
        return <Badge className="text-xs bg-yellow-100 text-yellow-800">Due Soon</Badge>
      case 'upcoming':
        return <Badge variant="outline" className="text-xs">Upcoming</Badge>
      case 'completed':
        return <Badge variant="secondary" className="text-xs">Completed</Badge>
    }
  }

  const getPriorityColor = (priority: Deadline['priority']) => {
    switch (priority) {
      case 'critical': return 'border-l-red-600 bg-red-50'
      case 'high': return 'border-l-red-500 bg-red-50'
      case 'medium': return 'border-l-yellow-500 bg-yellow-50'
      case 'low': return 'border-l-green-500 bg-green-50'
    }
  }

  const formatDaysUntilDue = (days: number) => {
    if (days < 0) return `${Math.abs(days)} days overdue`
    if (days === 0) return 'Due today'
    if (days === 1) return 'Due tomorrow'
    return `Due in ${days} days`
  }

  const overdueCount = mockDeadlines.filter(d => d.status === 'overdue').length
  const dueSoonCount = mockDeadlines.filter(d => d.status === 'due-soon').length

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Deadlines & Milestones</CardTitle>
        <Button size="sm" variant="outline">
          <Calendar className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <AlertTriangle className="h-5 w-5 mx-auto mb-1 text-red-500" />
            <p className="text-sm text-muted-foreground">Overdue</p>
            <p className="text-lg text-red-600">{overdueCount}</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <Clock className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
            <p className="text-sm text-muted-foreground">Due Soon</p>
            <p className="text-lg text-yellow-600">{dueSoonCount}</p>
          </div>
        </div>

        {/* Deadline List */}
        <div className="space-y-3">
          {mockDeadlines.map(deadline => (
            <div key={deadline.id} className={`border-l-4 ${getPriorityColor(deadline.priority)} pl-3 py-3 rounded-r-lg`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    {getStatusIcon(deadline.status)}
                    <span className="text-sm">{deadline.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {deadline.borrowerName} • {deadline.loanNumber}
                  </p>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(deadline.status)}
                    <Badge variant="outline" className="text-xs">
                      {deadline.type}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{deadline.dueDate}</p>
                  <p className={`text-xs ${deadline.daysUntilDue < 0 ? 'text-red-600' : deadline.daysUntilDue <= 2 ? 'text-yellow-600' : 'text-blue-600'}`}>
                    {formatDaysUntilDue(deadline.daysUntilDue)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline" className="w-full">
              <AlertTriangle className="h-4 w-4 mr-1" />
              View Overdue
            </Button>
            <Button size="sm" variant="outline" className="w-full">
              <Clock className="h-4 w-4 mr-1" />
              This Week
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}