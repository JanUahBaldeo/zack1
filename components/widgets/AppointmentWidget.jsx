import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx'
import { Badge } from '../ui/badge.jsx'
import { Button } from '../ui/button.jsx'
import { Calendar, Clock, Users, Plus, User, MapPin } from 'lucide-react'

export function AppointmentWidget() {
  const mockAppointments = [
    {
      id: '1',
      clientName: 'Sarah Thompson',
      loanOfficer: 'Mike Wilson',
      type: 'consultation',
      time: '9:00 AM',
      duration: '45 min',
      status: 'confirmed',
      location: 'office',
      notes: 'First-time buyer consultation'
    },
    {
      id: '2',
      clientName: 'James Rodriguez',
      loanOfficer: 'Lisa Davis',
      type: 'pre-approval',
      time: '11:00 AM',
      duration: '30 min',
      status: 'scheduled',
      location: 'virtual',
      notes: 'Review documents'
    },
    {
      id: '3',
      clientName: 'Amanda Chen',
      loanOfficer: 'Current User',
      type: 'closing',
      time: '2:00 PM',
      duration: '90 min',
      status: 'confirmed',
      location: 'client-home',
      notes: 'Final walkthrough and signing'
    },
    {
      id: '4',
      clientName: 'Robert Johnson',
      loanOfficer: 'Mike Wilson',
      type: 'follow-up',
      time: '4:00 PM',
      duration: '30 min',
      status: 'pending',
      location: 'virtual',
      notes: 'Rate discussion'
    }
  ]

  const getAppointmentIcon = (type) => {
    switch (type) {
      case 'consultation':
        return <Users className="h-4 w-4 text-blue-500" />
      case 'pre-approval':
        return <User className="h-4 w-4 text-green-500" />
      case 'closing':
        return <Calendar className="h-4 w-4 text-purple-500" />
      case 'follow-up':
        return <Clock className="h-4 w-4 text-orange-500" />
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="text-xs">Scheduled</Badge>
      case 'confirmed':
        return <Badge variant="secondary" className="text-xs">Confirmed</Badge>
      case 'pending':
        return <Badge className="text-xs bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'cancelled':
        return <Badge variant="destructive" className="text-xs">Cancelled</Badge>
    }
  }

  const getLocationIcon = (location) => {
    switch (location) {
      case 'office':
        return '🏢'
      case 'virtual':
        return '💻'
      case 'client-home':
        return '🏠'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'consultation': return 'bg-blue-100 text-blue-800'
      case 'pre-approval': return 'bg-green-100 text-green-800'
      case 'closing': return 'bg-purple-100 text-purple-800'
      case 'follow-up': return 'bg-orange-100 text-orange-800'
    }
  }

  const confirmedCount = mockAppointments.filter(apt => apt.status === 'confirmed').length
  const pendingCount = mockAppointments.filter(apt => apt.status === 'pending').length

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Appointments</CardTitle>
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Today's Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <Calendar className="h-5 w-5 mx-auto mb-1 text-blue-500" />
            <p className="text-sm text-muted-foreground">Today</p>
            <p className="text-lg">{mockAppointments.length}</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <Clock className="h-5 w-5 mx-auto mb-1 text-green-500" />
            <p className="text-sm text-muted-foreground">Next Available</p>
            <p className="text-lg">5:30 PM</p>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Confirmed</span>
            </span>
            <span>{confirmedCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span>Pending</span>
            </span>
            <span>{pendingCount}</span>
          </div>
        </div>

        {/* Appointment List */}
        <div className="space-y-3">
          <h4 className="text-sm text-muted-foreground">Today's Schedule</h4>
          {mockAppointments.map(appointment => (
            <div key={appointment.id} className="border rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getAppointmentIcon(appointment.type)}
                  <div>
                    <span className="text-sm">{appointment.clientName}</span>
                    <p className="text-xs text-muted-foreground">
                      with {appointment.loanOfficer}
                    </p>
                  </div>
                </div>
                {getStatusBadge(appointment.status)}
              </div>
              
              <div className="flex items-center space-x-4 mb-2">
                <Badge className={`text-xs ${getTypeColor(appointment.type)}`}>
                  {appointment.type}
                </Badge>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{appointment.time}</span>
                  <span>({appointment.duration})</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <span>{getLocationIcon(appointment.location)}</span>
                  <span className="capitalize">{appointment.location.replace('-', ' ')}</span>
                </div>
                {appointment.notes && (
                  <span className="text-xs text-muted-foreground truncate max-w-32">
                    {appointment.notes}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline" className="w-full">
              <Calendar className="h-4 w-4 mr-1" />
              View All
            </Button>
            <Button size="sm" variant="outline" className="w-full">
              <Users className="h-4 w-4 mr-1" />
              Schedule
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}