import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Checkbox } from '../ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Plus, Filter, Phone, Mail, Calendar, FileText, AlertTriangle, Clock } from 'lucide-react'
import { fetchTasks } from './api';

export function TaskWidget({ role, token }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchTasks(token)
      .then(data => {
        setTasks(data.tasks || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load tasks');
        setLoading(false);
      });
  }, [token]);

  const getTaskIcon = (type) => {
    switch (type) {
      case 'call': return <Phone className="h-4 w-4" />
      case 'email': return <Mail className="h-4 w-4" />
      case 'meeting': return <Calendar className="h-4 w-4" />
      case 'document': return <FileText className="h-4 w-4" />
      case 'follow-up': return <Clock className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'overdue':
        return <Badge variant="destructive" className="text-xs">Overdue</Badge>
      case 'today':
        return <Badge variant="secondary" className="text-xs">Today</Badge>
      case 'upcoming':
        return <Badge variant="outline" className="text-xs">Upcoming</Badge>
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-yellow-500'
      case 'low': return 'border-l-green-500'
    }
  }

  // Group tasks by status
  const overdueTasks = tasks.filter(task => task.status === 'overdue')
  const todayTasks = tasks.filter(task => task.status === 'today')
  const upcomingTasks = tasks.filter(task => task.status === 'upcoming')

  if (loading) {
    return <div className="text-center py-8">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Tasks</CardTitle>
        <div className="flex items-center space-x-2">
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="type">By Type</SelectItem>
              <SelectItem value="priority">By Priority</SelectItem>
              <SelectItem value="assignee">By Assignee</SelectItem>
              {role === 'LOA' && <SelectItem value="loan-officer">By LO</SelectItem>}
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overdue Tasks */}
        {overdueTasks.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <h4 className="text-red-600">Overdue ({overdueTasks.length})</h4>
            </div>
            {overdueTasks.map(task => (
              <div key={task.id} className={`border-l-4 ${getPriorityColor(task.priority)} pl-3 py-2 bg-red-50 rounded-r`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2">
                    <Checkbox className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        {getTaskIcon(task.type)}
                        <span className="text-sm">{task.title}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusBadge(task.status)}
                        <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                        <span className="text-xs text-muted-foreground">• {task.timeInStatus}</span>
                      </div>
                      {role === 'LOA' && task.loanOfficer && (
                        <p className="text-xs text-muted-foreground mt-1">LO: {task.loanOfficer}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Today's Tasks */}
        {todayTasks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-orange-600">Today ({todayTasks.length})</h4>
            {todayTasks.map(task => (
              <div key={task.id} className={`border-l-4 ${getPriorityColor(task.priority)} pl-3 py-2 bg-orange-50 rounded-r`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2">
                    <Checkbox className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        {getTaskIcon(task.type)}
                        <span className="text-sm">{task.title}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusBadge(task.status)}
                        <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                        <span className="text-xs text-muted-foreground">• {task.timeInStatus}</span>
                      </div>
                      {role === 'LOA' && task.loanOfficer && (
                        <p className="text-xs text-muted-foreground mt-1">LO: {task.loanOfficer}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upcoming Tasks */}
        {upcomingTasks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-blue-600">Upcoming ({upcomingTasks.length})</h4>
            {upcomingTasks.map(task => (
              <div key={task.id} className={`border-l-4 ${getPriorityColor(task.priority)} pl-3 py-2 bg-blue-50 rounded-r`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2">
                    <Checkbox className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        {getTaskIcon(task.type)}
                        <span className="text-sm">{task.title}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusBadge(task.status)}
                        <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                        <span className="text-xs text-muted-foreground">• {task.timeInStatus}</span>
                      </div>
                      {role === 'LOA' && task.loanOfficer && (
                        <p className="text-xs text-muted-foreground mt-1">LO: {task.loanOfficer}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}