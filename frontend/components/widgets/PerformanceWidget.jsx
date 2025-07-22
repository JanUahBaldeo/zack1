import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Badge } from '../ui/badge'
import { TrendingUp, TrendingDown, MousePointer, Eye, Users } from 'lucide-react'
import { fetchPerformance } from './api';

export function PerformanceWidget({ token }) {
  const [performance, setPerformance] = useState({ data: [], topPerformers: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchPerformance(token)
      .then(data => {
        setPerformance(data || { data: [], topPerformers: [] });
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load performance data');
        setLoading(false);
      });
  }, [token]);

  const currentWeekTotals = {
    clicks: performance.data.reduce((sum, day) => sum + (day.clicks || 0), 0),
    avgCtr: performance.data.length > 0 ? performance.data.reduce((sum, day) => sum + (day.ctr || 0), 0) / performance.data.length : 0,
    leads: performance.data.reduce((sum, day) => sum + (day.leads || 0), 0),
    conversions: performance.data.reduce((sum, day) => sum + (day.conversions || 0), 0)
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'bg-green-100 text-green-800'
    if (score >= 80) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  if (loading) {
    return <div className="text-center py-8">Loading performance data...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
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
            <LineChart data={performance.data}>
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
          {performance.topPerformers.map((partner, index) => (
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