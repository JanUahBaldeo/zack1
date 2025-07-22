import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Mail, MessageSquare, Phone, Users, Reply, Clock } from 'lucide-react'
import { fetchCommunications } from './api';

export function CommunicationWidget({ token }) {
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchCommunications(token)
      .then(data => {
        setCommunications(data.communications || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load communications');
        setLoading(false);
      });
  }, [token]);

  // Remove mockCommunications, use communications from state
  if (loading) {
    return <div className="text-center py-8">Loading communications...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  const getCommunicationIcon = (type) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4 text-blue-500" />
      case 'text':
        return <MessageSquare className="h-4 w-4 text-green-500" />
      case 'call':
        return <Phone className="h-4 w-4 text-purple-500" />
      case 'voicemail':
        return <Phone className="h-4 w-4 text-orange-500" />
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'unread':
        return <Badge variant="destructive" className="text-xs">Unread</Badge>
      case 'replied':
        return <Badge variant="secondary" className="text-xs">Replied</Badge>
      case 'missed':
        return <Badge variant="outline" className="text-xs">Missed</Badge>
      case 'pending':
        return <Badge className="text-xs bg-yellow-100 text-yellow-800">Pending</Badge>
    }
  }

  const getPriorityIndicator = (priority) => {
    switch (priority) {
      case 'high':
        return <div className="w-2 h-2 bg-red-500 rounded-full" />
      case 'medium':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />
      case 'low':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Communications</CardTitle>
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline">
            <Users className="h-4 w-4 mr-1" />
            Group
          </Button>
          <Button size="sm" variant="outline">
            <Reply className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <Mail className="h-5 w-5 mx-auto mb-1 text-blue-500" />
            <p className="text-sm text-muted-foreground">Unread</p>
            <p className="text-lg">3</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <Clock className="h-5 w-5 mx-auto mb-1 text-orange-500" />
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-lg">2</p>
          </div>
        </div>

        {/* Communication List */}
        <div className="space-y-3">
          {communications.map(comm => (
            <div key={comm.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-shrink-0 mt-1">
                {getCommunicationIcon(comm.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    {getPriorityIndicator(comm.priority)}
                    <span className="text-sm">{comm.contact}</span>
                  </div>
                  {getStatusBadge(comm.status)}
                </div>
                <p className="text-sm text-muted-foreground truncate mb-1">{comm.subject}</p>
                <p className="text-xs text-muted-foreground">{comm.time}</p>
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
              <MessageSquare className="h-4 w-4 mr-1" />
              Text All
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}