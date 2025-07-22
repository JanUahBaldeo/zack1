import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { Phone, PhoneCall, Voicemail, PhoneMissed, TrendingUp } from 'lucide-react'

export function CallActivityWidget() {
  const mockCallActivity = [
    {
      id: '1',
      contact: 'Sarah Mitchell',
      type: 'outbound',
      status: 'completed',
      duration: '12:34',
      time: '10:30 AM',
      leadStatus: 'Qualified',
      notes: 'Interested in refinancing'
    },
    {
      id: '2',
      contact: 'Tom Rodriguez',
      type: 'inbound',
      status: 'completed',
      duration: '8:15',
      time: '11:45 AM',
      leadStatus: 'New Lead',
      notes: 'First-time buyer inquiry'
    },
    {
      id: '3',
      contact: 'Jennifer Lee',
      type: 'outbound',
      status: 'voicemail',
      duration: '0:45',
      time: '2:15 PM',
      leadStatus: 'Follow-up',
      notes: 'Left callback message'
    },
    {
      id: '4',
      contact: 'Michael Johnson',
      type: 'outbound',
      status: 'missed',
      duration: '0:00',
      time: '3:30 PM',
      leadStatus: 'Cold Lead',
      notes: 'No answer, try again tomorrow'
    }
  ]

  const callStats = {
    totalCalls: 28,
    completed: 18,
    missed: 4,
    voicemail: 6,
    noAnswer: 8,
    avgDuration: '9:23',
    connectionRate: 64
  }

  const getCallIcon = (type, status) => {
    if (status === 'completed') {
      return type === 'outbound' ? 
        <PhoneCall className="h-4 w-4 text-green-500" /> : 
        <Phone className="h-4 w-4 text-blue-500" />
    }
    if (status === 'voicemail') {
      return <Voicemail className="h-4 w-4 text-yellow-500" />
    }
    return <PhoneMissed className="h-4 w-4 text-red-500" />
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="text-xs">Connected</Badge>
      case 'missed':
        return <Badge variant="destructive" className="text-xs">Missed</Badge>
      case 'voicemail':
        return <Badge className="text-xs bg-yellow-100 text-yellow-800">Voicemail</Badge>
      case 'no-answer':
        return <Badge variant="outline" className="text-xs">No Answer</Badge>
    }
  }

  const getLeadStatusColor = (status) => {
    switch (status) {
      case 'Qualified': return 'bg-green-100 text-green-800'
      case 'New Lead': return 'bg-blue-100 text-blue-800'
      case 'Follow-up': return 'bg-yellow-100 text-yellow-800'
      case 'Cold Lead': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Call Activity</CardTitle>
        <Button size="sm" variant="outline">
          <Phone className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Daily Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <Phone className="h-5 w-5 mx-auto mb-1 text-blue-500" />
            <p className="text-sm text-muted-foreground">Total Calls</p>
            <p className="text-lg">{callStats.totalCalls}</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <TrendingUp className="h-5 w-5 mx-auto mb-1 text-green-500" />
            <p className="text-sm text-muted-foreground">Connection Rate</p>
            <p className="text-lg">{callStats.connectionRate}%</p>
          </div>
        </div>

        {/* Connection Rate Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Daily Connection Rate</span>
            <span>{callStats.connectionRate}%</span>
          </div>
          <Progress value={callStats.connectionRate} className="h-2" />
        </div>

        {/* Call Breakdown */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <PhoneCall className="h-3 w-3 text-green-500" />
              <span>Connected</span>
            </span>
            <span>{callStats.completed}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <Voicemail className="h-3 w-3 text-yellow-500" />
              <span>Voicemail</span>
            </span>
            <span>{callStats.voicemail}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <PhoneMissed className="h-3 w-3 text-red-500" />
              <span>Missed</span>
            </span>
            <span>{callStats.missed}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <Phone className="h-3 w-3 text-gray-500" />
              <span>No Answer</span>
            </span>
            <span>{callStats.noAnswer}</span>
          </div>
        </div>

        {/* Recent Calls */}
        <div className="space-y-3">
          <h4 className="text-sm text-muted-foreground">Recent Calls</h4>
          {mockCallActivity.slice(0, 4).map(call => (
            <div key={call.id} className="flex items-center space-x-3 p-2 border rounded-lg">
              <div className="flex-shrink-0">
                {getCallIcon(call.type, call.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm truncate">{call.contact}</span>
                  <span className="text-xs text-muted-foreground">{call.time}</span>
                </div>
                <div className="flex items-center space-x-2 mb-1">
                  {getStatusBadge(call.status)}
                  <Badge className={`text-xs ${getLeadStatusColor(call.leadStatus)}`}>
                    {call.leadStatus}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{call.duration}</span>
                  {call.notes && (
                    <span className="text-xs text-muted-foreground truncate max-w-24">
                      {call.notes}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline" className="w-full">
              <Phone className="h-4 w-4 mr-1" />
              Call List
            </Button>
            <Button size="sm" variant="outline" className="w-full">
              <Voicemail className="h-4 w-4 mr-1" />
              Callbacks
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}