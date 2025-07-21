import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { FileText, Upload, AlertCircle, CheckCircle, Clock, Filter } from 'lucide-react'

interface DocumentItem {
  id: string
  loanNumber: string
  borrowerName: string
  documentType: string
  status: 'missing' | 'pending' | 'received' | 'expired'
  ageInDays: number
  loanStage: string
  priority: 'high' | 'medium' | 'low'
}

export function DocumentWidget() {
  const mockDocuments: DocumentItem[] = [
    {
      id: '1',
      loanNumber: 'LN-2024-001',
      borrowerName: 'John Smith',
      documentType: 'W-2 Forms (2022-2023)',
      status: 'missing',
      ageInDays: 5,
      loanStage: 'Application',
      priority: 'high'
    },
    {
      id: '2',
      loanNumber: 'LN-2024-002',
      borrowerName: 'Robert Johnson',
      documentType: 'Bank Statements (3 months)',
      status: 'pending',
      ageInDays: 2,
      loanStage: 'Processing',
      priority: 'medium'
    },
    {
      id: '3',
      loanNumber: 'LN-2024-003',
      borrowerName: 'Maria Garcia',
      documentType: 'Property Insurance',
      status: 'received',
      ageInDays: 1,
      loanStage: 'Underwriting',
      priority: 'low'
    },
    {
      id: '4',
      loanNumber: 'LN-2024-004',
      borrowerName: 'David Wilson',
      documentType: 'Appraisal Report',
      status: 'expired',
      ageInDays: 12,
      loanStage: 'Processing',
      priority: 'high'
    }
  ]

  const getStatusIcon = (status: DocumentItem['status']) => {
    switch (status) {
      case 'missing':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'received':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'expired':
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: DocumentItem['status']) => {
    switch (status) {
      case 'missing':
        return <Badge variant="destructive" className="text-xs">Missing</Badge>
      case 'pending':
        return <Badge className="text-xs bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'received':
        return <Badge variant="secondary" className="text-xs">Received</Badge>
      case 'expired':
        return <Badge variant="destructive" className="text-xs">Expired</Badge>
    }
  }

  const getAgeColor = (ageInDays: number) => {
    if (ageInDays > 7) return 'text-red-600'
    if (ageInDays > 3) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getPriorityColor = (priority: DocumentItem['priority']) => {
    switch (priority) {
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-yellow-500'
      case 'low': return 'border-l-green-500'
    }
  }

  const completionRate = Math.round((mockDocuments.filter(doc => doc.status === 'received').length / mockDocuments.length) * 100)

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Document Tracker</CardTitle>
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline">
            <Filter className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Upload className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <FileText className="h-5 w-5 mx-auto mb-1 text-blue-500" />
            <p className="text-sm text-muted-foreground">Completion Rate</p>
            <p className="text-lg">{completionRate}%</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <AlertCircle className="h-5 w-5 mx-auto mb-1 text-red-500" />
            <p className="text-sm text-muted-foreground">Overdue</p>
            <p className="text-lg">{mockDocuments.filter(doc => doc.ageInDays > 7).length}</p>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Overall Document Progress</span>
            <span>{completionRate}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>

        {/* Document List */}
        <div className="space-y-3">
          {mockDocuments.map(doc => (
            <div key={doc.id} className={`border-l-4 ${getPriorityColor(doc.priority)} pl-3 py-2 border rounded-r-lg`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    {getStatusIcon(doc.status)}
                    <span className="text-sm">{doc.documentType}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {doc.borrowerName} • {doc.loanNumber}
                  </p>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(doc.status)}
                    <Badge variant="outline" className="text-xs">
                      {doc.loanStage}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xs ${getAgeColor(doc.ageInDays)}`}>
                    {doc.ageInDays} days
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
              <AlertCircle className="h-4 w-4 mr-1" />
              View Missing
            </Button>
            <Button size="sm" variant="outline" className="w-full">
              <Clock className="h-4 w-4 mr-1" />
              View Overdue
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}