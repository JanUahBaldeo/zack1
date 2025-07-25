import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Bell, AlertCircle, Info, CheckCircle, X, Settings } from 'lucide-react'
import { fetchNotifications } from './api';

export function NotificationWidget({ token }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchNotifications(token)
      .then(data => {
        setNotifications(data.notifications || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load notifications');
        setLoading(false);
      });
  }, [token]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const getNotificationBadge = (type) => {
    switch (type) {
      case 'alert':
        return <Badge variant="destructive" className="text-xs">Alert</Badge>
      case 'warning':
        return <Badge className="text-xs bg-yellow-100 text-yellow-800">Warning</Badge>
      case 'info':
        return <Badge variant="outline" className="text-xs">Info</Badge>
      case 'success':
        return <Badge variant="secondary" className="text-xs">Success</Badge>
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length
  const actionRequiredCount = notifications.filter(n => n.actionRequired).length

  if (loading) {
    return <div className="text-center py-8">Loading notifications...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Notifications & Alerts</CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            {unreadCount} unread
          </Badge>
          <Button size="sm" variant="outline">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <Bell className="h-5 w-5 mx-auto mb-1 text-red-500" />
            <p className="text-sm text-muted-foreground">Action Required</p>
            <p className="text-lg text-red-600">{actionRequiredCount}</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Info className="h-5 w-5 mx-auto mb-1 text-blue-500" />
            <p className="text-sm text-muted-foreground">Total Unread</p>
            <p className="text-lg text-blue-600">{unreadCount}</p>
          </div>
        </div>

        {/* Notification List */}
        <div className="space-y-3">
          {notifications.map(notification => (
            <div key={notification.id} className={`border rounded-lg p-3 ${!notification.isRead ? 'bg-blue-50 border-blue-200' : ''}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getNotificationIcon(notification.type)}
                  <span className="text-sm">{notification.title}</span>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  {getNotificationBadge(notification.type)}
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{notification.message}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                {notification.actionRequired && (
                  <Button size="sm" variant="outline" className="h-6 text-xs">
                    Take Action
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline" className="w-full">
              <CheckCircle className="h-4 w-4 mr-1" />
              Mark All Read
            </Button>
            <Button size="sm" variant="outline" className="w-full">
              <AlertCircle className="h-4 w-4 mr-1" />
              View Alerts
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}