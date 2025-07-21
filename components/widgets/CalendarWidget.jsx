import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx'
import { Button } from '../ui/button.jsx'
import { Badge } from '../ui/badge.jsx'
import { Checkbox } from '../ui/checkbox.jsx'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useState } from 'react'

export function CalendarWidget({ role }) {
  const [currentDate, setCurrentDate] = useState(new Date(2017, 9, 1)) // October 2017 to match the image
  const [view, setView] = useState('week')
  
  const [filterCategories, setFilterCategories] = useState([
    { name: 'Contact', color: '#3b82f6', enabled: true },
    { name: 'Blog', color: '#ef4444', enabled: true },
    { name: 'Email', color: '#10b981', enabled: true },
    { name: 'Marketing email', color: '#f59e0b', enabled: true },
    { name: 'Landing page', color: '#8b5cf6', enabled: true },
    { name: 'Social', color: '#06b6d4', enabled: true }
  ])

  const events = [
    {
      id: '1',
      title: 'Design Pricing',
      category: 'Contact',
      date: '2017-10-12',
      time: '10:00 AM',
      color: '#f59e0b'
    },
    {
      id: '2',
      title: 'Hi Tim to organize the call',
      category: 'Email',
      date: '2017-10-20',
      time: '2:00 PM',
      color: '#06b6d4'
    },
    {
      id: '3',
      title: 'October activities',
      category: 'Marketing email',
      date: '2017-10-23',
      time: '9:00 AM',
      color: '#f59e0b'
    }
  ]

  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const toggleCategory = (categoryName) => {
    setFilterCategories(prev => 
      prev.map(cat => 
        cat.name === categoryName 
          ? { ...cat, enabled: !cat.enabled }
          : cat
      )
    )
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startDay = firstDay.getDay()
    
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    
    return days
  }

  const getWeekDays = (date) => {
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    startOfWeek.setDate(startOfWeek.getDate() - day)
    
    const days = []
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek)
      currentDay.setDate(startOfWeek.getDate() + i)
      days.push(currentDay)
    }
    
    return days
  }

  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }

  const getEventsForDate = (date) => {
    return events.filter(event => 
      event.date === date && 
      filterCategories.find(cat => cat.name === event.category)?.enabled
    )
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const miniCalendarDays = getDaysInMonth(currentDate)
  const weekDaysToShow = view === 'week' ? getWeekDays(currentDate) : null

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
        <CardTitle className="text-xl">Calendar</CardTitle>
        <Button className="bg-gray-100 text-gray-700 hover:bg-gray-200">
          <Plus className="h-4 w-4 mr-2" />
          Add appointment
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex h-[600px]">
          {/* Left Sidebar */}
          <div className="w-64 border-r bg-gray-50 p-4 space-y-6">
            {/* Mini Calendar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-medium text-sm">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
                <Button variant="ghost" size="sm" onClick={() => navigateMonth('next')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Mini Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 text-xs">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <div key={day} className="text-center text-gray-500 py-1">
                    {day}
                  </div>
                ))}
                {miniCalendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`text-center py-1 cursor-pointer hover:bg-gray-200 rounded ${
                      day === new Date().getDate() && 
                      currentDate.getMonth() === new Date().getMonth() &&
                      currentDate.getFullYear() === new Date().getFullYear()
                        ? 'bg-blue-500 text-white' 
                        : day 
                          ? 'text-gray-700' 
                          : 'text-gray-300'
                    }`}
                  >
                    {day || ''}
                  </div>
                ))}
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex space-x-1 bg-gray-200 rounded p-1">
              <Button
                variant={view === 'week' ? 'default' : 'ghost'}
                size="sm"
                className="flex-1 text-xs"
                onClick={() => setView('week')}
              >
                Week
              </Button>
              <Button
                variant={view === 'month' ? 'default' : 'ghost'}
                size="sm"
                className="flex-1 text-xs"
                onClick={() => setView('month')}
              >
                Month
              </Button>
            </div>

            {/* Filters */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-700">Filter by</h4>
              <div className="space-y-2">
                {filterCategories.map((category) => (
                  <div key={category.name} className="flex items-center space-x-3">
                    <Checkbox
                      checked={category.enabled}
                      onCheckedChange={() => toggleCategory(category.name)}
                      className="rounded"
                    />
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Source */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-700">Event Source</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Checkbox checked className="rounded" />
                  <div className="w-3 h-3 rounded bg-orange-500" />
                  <span className="text-sm text-gray-700">Blog</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox checked className="rounded" />
                  <div className="w-3 h-3 rounded bg-blue-500" />
                  <span className="text-sm text-gray-700">Email</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox checked className="rounded" />
                  <div className="w-3 h-3 rounded bg-gray-500" />
                  <span className="text-sm text-gray-700">Landing page</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Calendar */}
          <div className="flex-1 p-4">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="text-lg font-semibold">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <Button variant="ghost" size="sm" onClick={() => navigateMonth('next')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex space-x-1 text-xs">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">Day</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded">Week</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded">Month</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded">List</span>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 border border-gray-200 rounded-lg overflow-hidden">
              {/* Day Headers */}
              {weekDays.map((day) => (
                <div key={day} className="bg-gray-50 border-b border-gray-200 p-3 text-sm font-medium text-gray-600">
                  {day}
                </div>
              ))}

              {/* Calendar Days */}
              {Array.from({ length: 35 }, (_, index) => {
                const weekIndex = Math.floor(index / 7)
                const dayIndex = index % 7
                const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
                const firstDayWeekday = firstDayOfMonth.getDay()
                const dayNumber = index - firstDayWeekday + 1
                const isValidDay = dayNumber > 0 && dayNumber <= new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
                const dateString = isValidDay ? formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber)) : ''
                const dayEvents = isValidDay ? getEventsForDate(dateString) : []

                return (
                  <div
                    key={index}
                    className={`border-b border-r border-gray-200 p-2 h-24 ${
                      isValidDay ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                    }`}
                  >
                    {isValidDay && (
                      <>
                        <div className="text-sm font-medium text-gray-700 mb-1">
                          {dayNumber}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.map((event) => (
                            <div
                              key={event.id}
                              className="text-xs p-1 rounded text-white truncate"
                              style={{ backgroundColor: event.color }}
                            >
                              {event.title}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}