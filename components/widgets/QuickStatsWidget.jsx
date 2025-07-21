import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export function QuickStatsWidget({ title, value, change, trend }) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      case 'neutral':
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      case 'neutral':
        return 'text-gray-600'
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        {getTrendIcon()}
      </CardHeader>
      <CardContent>
        <div className="text-2xl">{value}</div>
        <p className={`text-xs ${getTrendColor()}`}>
          {change}
        </p>
      </CardContent>
    </Card>
  )
}