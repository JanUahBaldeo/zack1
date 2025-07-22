import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Progress } from '../ui/progress'
import { MoreHorizontal, Plus, Filter, Calendar, DollarSign, User, Clock, ChevronDown } from 'lucide-react'
import { fetchPipeline } from './api';

export function PipelineWidget({ role, token }) {
  const [pipeline, setPipeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchPipeline(token)
      .then(data => {
        setPipeline(data.loans || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load pipeline');
        setLoading(false);
      });
  }, [token]);

  const stages = role === 'LO' ? [
    { name: 'New Lead', color: 'bg-teal-500', textColor: 'text-white' },
    { name: 'Contacted', color: 'bg-gray-500', textColor: 'text-white' },
    { name: 'Application Started', color: 'bg-blue-500', textColor: 'text-white' },
    { name: 'Pre-Approved', color: 'bg-red-500', textColor: 'text-white' },
    { name: 'In Underwriting', color: 'bg-orange-500', textColor: 'text-white' },
    { name: 'Closed', color: 'bg-green-500', textColor: 'text-white' }
  ] : [
    { name: 'Application Received', color: 'bg-teal-500', textColor: 'text-white' },
    { name: 'Pre-Approval Issued', color: 'bg-gray-500', textColor: 'text-white' },
    { name: 'In Processing', color: 'bg-blue-500', textColor: 'text-white' },
    { name: 'Submitted to Underwriting', color: 'bg-red-500', textColor: 'text-white' },
    { name: 'Conditional Approval', color: 'bg-orange-500', textColor: 'text-white' },
    { name: 'Cleared to Close', color: 'bg-purple-500', textColor: 'text-white' },
    { name: 'Docs Out', color: 'bg-indigo-500', textColor: 'text-white' },
    { name: 'Closed', color: 'bg-green-500', textColor: 'text-white' }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'on-track': return 'bg-green-100 text-green-800'
      case 'delayed': return 'bg-yellow-100 text-yellow-800'
      case 'at-risk': return 'bg-red-100 text-red-800'
    }
  }

  const getLoanTypeColor = (loanType) => {
    switch (loanType) {
      case 'FHA': return 'bg-blue-100 text-blue-800'
      case 'VA': return 'bg-purple-100 text-purple-800'
      case 'Conventional': return 'bg-gray-100 text-gray-800'
      case 'USDA': return 'bg-green-100 text-green-800'
      case 'Jumbo': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getLoansForStage = (stageName) => {
    return pipeline.filter(loan => loan.currentStage === stageName)
  }

  const getTotalValue = (loans) => {
    return loans.reduce((sum, loan) => sum + loan.loanAmount, 0)
  }

  if (loading) {
    return <div className="text-center py-8">Loading pipeline...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Pipeline</CardTitle>
        <div className="flex items-center space-x-2">
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Loans</SelectItem>
              <SelectItem value="status">By Status</SelectItem>
              <SelectItem value="stage">By Stage</SelectItem>
              <SelectItem value="loan-type">By Loan Type</SelectItem>
              {role === 'LOA' && <SelectItem value="loan-officer">By LO</SelectItem>}
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        {/* Kanban Board */}
        <div className="flex space-x-4 overflow-x-auto pb-4 px-6">
          {stages.map((stage) => {
            const stageLoans = getLoansForStage(stage.name)
            const stageValue = getTotalValue(stageLoans)
            
            return (
              <div key={stage.name} className="flex-shrink-0 w-80">
                {/* Stage Header */}
                <div className={`${stage.color} ${stage.textColor} rounded-t-lg p-3 flex items-center justify-between`}>
                  <div>
                    <h3 className="font-medium text-sm">{stage.name}</h3>
                    <p className="text-xs opacity-90">
                      {stageLoans.length} loans • {formatCurrency(stageValue)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-white hover:bg-white/20">
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-white hover:bg-white/20">
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Stage Content */}
                <div className="bg-gray-50 rounded-b-lg min-h-96 p-3 space-y-3 border border-t-0">
                  {stageLoans.map((loan) => (
                    <Card key={loan.id} className="bg-white hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Loan Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{loan.borrowerName}</h4>
                              <p className="text-xs text-muted-foreground">{loan.loanNumber}</p>
                            </div>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Property Address */}
                          <p className="text-xs text-muted-foreground">{loan.propertyAddress}</p>

                          {/* Loan Details */}
                          <div className="flex items-center space-x-2">
                            <Badge className={`text-xs ${getLoanTypeColor(loan.loanType)}`}>
                              {loan.loanType}
                            </Badge>
                            <span className="text-xs font-medium">
                              {formatCurrency(loan.loanAmount)}
                            </span>
                          </div>

                          {/* Status and Time */}
                          <div className="flex items-center justify-between">
                            <Badge className={`text-xs ${getStatusColor(loan.status)}`}>
                              {loan.status.replace('-', ' ')}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {loan.timeInStage}
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span>Progress</span>
                              <span>{loan.progress}%</span>
                            </div>
                            <Progress value={loan.progress} className="h-1" />
                          </div>

                          {/* Close Date */}
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Close: {loan.targetCloseDate}</span>
                          </div>

                          {/* Team Info for LOA */}
                          {role === 'LOA' && (
                            <div className="text-xs text-muted-foreground">
                              LO: {loan.loanOfficer}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* Add New Card Button */}
                  <Button 
                    variant="outline" 
                    className="w-full h-12 border-dashed border-2 text-muted-foreground hover:text-foreground"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Pipeline Summary */}
        <div className="px-6 pt-4 border-t">
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <p className="text-muted-foreground">Total Pipeline</p>
              <p className="font-medium">{pipeline.length} loans</p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">Total Value</p>
              <p className="font-medium">{formatCurrency(pipeline.reduce((sum, item) => sum + item.loanAmount, 0))}</p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">Avg. Time</p>
              <p className="font-medium">7 days</p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">Conversion Rate</p>
              <p className="font-medium">18.5%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}