import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Badge } from '../ui/badge'
import { TrendingUp, TrendingDown, MousePointer, Eye, Users } from 'lucide-react'

export function PerformanceWidget() {
  const mockPerformanceData = [
    { date: '2024-02-10', clicks: 245, ctr: 4.2, leads: 18, conversions: 3 },
    { date: '2024-02-11', clicks: 312, ctr: 4.8, leads: 23, conversions: 4 },
    { date: '2024-02-12', clicks: 189, ctr: 3.9, leads: 14, conversions: 2 },
    { date: '2024-02-13', clicks: 267, ctr: 5.1, leads: 19, conversions: 5 },
    { date: '2024-02-14', clicks: 298, ctr: 4.6, leads: 21, conversions: 3 },
    { date: '2024-02-15', clicks: 334, ctr: 5.3, leads: 26, conversions: 6 },
    { date: '2024-02-16', clicks: 389, ctr: 4.9, leads: 28, conversions: 4 }
  ]

  const topPerformers = [
    { name: 'XYZ Home Warranty', score: 92, leads: 34, ctr: 6.2 },
    { name: 'ABC Title Co.', score: 88, leads: 28, ctr: 5.8 },
    { name: 'QuickRate Pro', score: 85, leads: 25, ctr: 5.4 },
    { name: 'HomeShield Insurance', score: 82, leads: 22, ctr: 4.9 }
  ]

  const currentWeekTotals = {
    clicks: mockPerformanceData.reduce((sum, day) => sum + day.clicks, 0),
    avgCtr: mockPerformanceData.reduce((sum, day) => sum + day.ctr, 0) / mockPerformanceData.length,
    leads: mockPerformanceData.reduce((sum, day) => sum + day.leads, 0),
    conversions: mockPerformanceData.reduce((sum, day) => sum + day.conversions, 0)
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'bg-green-100 text-green-800'
    if (score >= 80) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Performance Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Weekly Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <MousePointer className="h-5 w-5 mx-auto mb-1 text-blue-500" />
            <p className="text-sm text-muted-foreground">Total Clicks</p>
            <p className="text-lg">{currentWeekTotals.clicks.toLocaleString()}</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <TrendingUp className="h-5 w-5 mx-auto mb-1 text-green-500" />
            <p className="text-sm text-muted-foreground">Avg CTR</p>
            <p className="text-lg">{currentWeekTotals.avgCtr.toFixed(1)}%</p>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="h-48">
          <h4 className="text-sm text-muted-foreground mb-2">7-Day Click Trend</h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short' })}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value, name) => [value, name === 'clicks' ? 'Clicks' : 'CTR %']}
              />
              <Line 
                type="monotone" 
                dataKey="clicks" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Performers */}
        <div className="space-y-3">
          <h4 className="text-sm text-muted-foreground">Top Performing Partners</h4>
          {topPerformers.map((partner, index) => (
            <div key={partner.name} className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">
                  {index + 1}
                </div>
                <div>
                  <span className="text-sm">{partner.name}</span>
                  <p className="text-xs text-muted-foreground">
                    {partner.leads} leads • {partner.ctr}% CTR
                  </p>
                </div>
              </div>
              <Badge className={`text-xs ${getScoreColor(partner.score)}`}>
                {partner.score}
              </Badge>
            </div>
          ))}
        </div>

        {/* Performance Metrics */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <Users className="h-3 w-3 text-purple-500" />
                <span>Total Leads</span>
              </span>
              <span>{currentWeekTotals.leads}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span>Conversions</span>
              </span>
              <span>{currentWeekTotals.conversions}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}