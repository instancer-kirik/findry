import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Car,
  Zap,
  Sun,
  Bed,
  Radio,
  Shield,
  Package,
  Thermometer,
  Wrench,
  CheckCircle2,
  Clock,
  AlertCircle,
  DollarSign,
  Calendar,
  User,
  ExternalLink,
  Camera,
  FileText,
  Tools
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VehicleBuildPhase {
  id: string;
  name: string;
  description: string;
  icon: any;
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedCost: number;
  actualCost?: number;
  estimatedDuration: string;
  actualDuration?: string;
  startDate?: Date;
  completedDate?: Date;
  dependencies?: string[];
  tasks: VehicleBuildTask[];
  photos?: string[];
  notes?: string;
  vendors?: string[];
  partsList?: VehiclePart[];
}

interface VehicleBuildTask {
  id: string;
  name: string;
  completed: boolean;
  notes?: string;
  estimatedHours?: number;
  actualHours?: number;
}

interface VehiclePart {
  id: string;
  name: string;
  brand: string;
  model?: string;
  cost: number;
  quantity: number;
  vendor: string;
  purchaseDate?: Date;
  warrantyInfo?: string;
  installationNotes?: string;
}

interface VehicleBuildProjectProps {
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
    type: 'van' | 'rv' | 'truck' | 'car';
    mileage?: number;
    purchaseDate?: Date;
    purchasePrice?: number;
  };
  phases: VehicleBuildPhase[];
  onPhaseUpdate: (phaseId: string, updates: Partial<VehicleBuildPhase>) => void;
  onTaskToggle: (phaseId: string, taskId: string) => void;
}

const VehicleBuildProject: React.FC<VehicleBuildProjectProps> = ({
  vehicleInfo,
  phases,
  onPhaseUpdate,
  onTaskToggle
}) => {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const getStatusColor = (status: VehicleBuildPhase['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'blocked': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status: VehicleBuildPhase['status']) => {
    switch (status) {
      case 'completed': return CheckCircle2;
      case 'in_progress': return Clock;
      case 'blocked': return AlertCircle;
      default: return Clock;
    }
  };

  const getPriorityColor = (priority: VehicleBuildPhase['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const calculateOverallProgress = () => {
    if (phases.length === 0) return 0;
    const completedPhases = phases.filter(p => p.status === 'completed').length;
    return Math.round((completedPhases / phases.length) * 100);
  };

  const calculateTotalBudget = () => {
    return phases.reduce((total, phase) => total + phase.estimatedCost, 0);
  };

  const calculateActualSpend = () => {
    return phases.reduce((total, phase) => total + (phase.actualCost || 0), 0);
  };

  return (
    <div className="space-y-6">
      {/* Vehicle Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
                <Car className="h-8 w-8" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
                </CardTitle>
                <p className="text-muted-foreground capitalize">
                  {vehicleInfo.type} Build Project
                  {vehicleInfo.mileage && ` • ${vehicleInfo.mileage.toLocaleString()} miles`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">
                {calculateOverallProgress()}%
              </div>
              <p className="text-sm text-muted-foreground">Complete</p>
            </div>
          </div>
          <Progress value={calculateOverallProgress()} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">${calculateTotalBudget().toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Estimated Budget</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">${calculateActualSpend().toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Actual Spend</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {phases.filter(p => p.status === 'completed').length}
            </div>
            <p className="text-sm text-muted-foreground">Phases Complete</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {phases.filter(p => p.status === 'in_progress').length}
            </div>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="phases">Phases</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {phases.map((phase) => {
              const StatusIcon = getStatusIcon(phase.status);
              const Icon = phase.icon;
              const completedTasks = phase.tasks.filter(t => t.completed).length;
              const taskProgress = phase.tasks.length > 0
                ? Math.round((completedTasks / phase.tasks.length) * 100)
                : 0;

              return (
                <Card key={phase.id} className={cn(
                  "cursor-pointer transition-all hover:shadow-lg",
                  selectedPhase === phase.id && "ring-2 ring-primary"
                )}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-medium">{phase.name}</CardTitle>
                          <Badge variant="outline" className={getPriorityColor(phase.priority)}>
                            {phase.priority}
                          </Badge>
                        </div>
                      </div>
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        getStatusColor(phase.status)
                      )} />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {phase.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tasks: {completedTasks}/{phase.tasks.length}</span>
                        <span>{taskProgress}%</span>
                      </div>
                      <Progress value={taskProgress} className="h-2" />
                    </div>

                    <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
                      <span>${phase.estimatedCost.toLocaleString()}</span>
                      <span>{phase.estimatedDuration}</span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-1">
                        <StatusIcon className="h-4 w-4" />
                        <span className="text-sm capitalize">
                          {phase.status.replace('_', ' ')}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPhase(
                          selectedPhase === phase.id ? null : phase.id
                        )}
                      >
                        {selectedPhase === phase.id ? 'Collapse' : 'Expand'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="phases">
          <div className="space-y-4">
            {phases.map((phase, index) => (
              <Card key={phase.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <phase.icon className="h-5 w-5" />
                          <span>{phase.name}</span>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{phase.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={getPriorityColor(phase.priority)}>
                      {phase.priority}
                    </Badge>
                  </div>
                </CardHeader>

                {selectedPhase === phase.id && (
                  <CardContent>
                    <Tabs defaultValue="tasks">
                      <TabsList className="mb-4">
                        <TabsTrigger value="tasks">Tasks</TabsTrigger>
                        <TabsTrigger value="parts">Parts</TabsTrigger>
                        <TabsTrigger value="photos">Photos</TabsTrigger>
                        <TabsTrigger value="notes">Notes</TabsTrigger>
                      </TabsList>

                      <TabsContent value="tasks">
                        <div className="space-y-2">
                          {phase.tasks.map((task) => (
                            <div
                              key={task.id}
                              className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg"
                            >
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => onTaskToggle(phase.id, task.id)}
                                className="rounded"
                              />
                              <div className="flex-1">
                                <p className={cn(
                                  "font-medium",
                                  task.completed && "line-through text-muted-foreground"
                                )}>
                                  {task.name}
                                </p>
                                {task.notes && (
                                  <p className="text-sm text-muted-foreground">{task.notes}</p>
                                )}
                              </div>
                              {task.estimatedHours && (
                                <Badge variant="outline">
                                  {task.actualHours || task.estimatedHours}h
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="parts">
                        <div className="space-y-3">
                          {phase.partsList?.map((part) => (
                            <div key={part.id} className="p-3 border rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-medium">{part.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {part.brand} {part.model}
                                  </p>
                                </div>
                                <Badge variant="outline">
                                  ${part.cost * part.quantity}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground space-y-1">
                                <p>Qty: {part.quantity} • Vendor: {part.vendor}</p>
                                {part.warrantyInfo && <p>Warranty: {part.warrantyInfo}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="photos">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {phase.photos?.map((photo, idx) => (
                            <div key={idx} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                              <Camera className="h-8 w-8 text-muted-foreground" />
                            </div>
                          ))}
                          <Button variant="outline" className="aspect-square">
                            <Camera className="h-6 w-6" />
                          </Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="notes">
                        <div className="space-y-3">
                          <textarea
                            className="w-full h-32 p-3 border rounded-lg resize-none"
                            placeholder="Add notes about this phase..."
                            value={phase.notes || ''}
                            onChange={(e) => onPhaseUpdate(phase.id, { notes: e.target.value })}
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {phases.map((phase, index) => (
                  <div key={phase.id} className="flex items-center space-x-4">
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2",
                      phase.status === 'completed' ? 'bg-green-500 border-green-500' :
                      phase.status === 'in_progress' ? 'bg-blue-500 border-blue-500' :
                      'bg-gray-200 border-gray-300'
                    )} />
                    <div className="flex-1">
                      <p className="font-medium">{phase.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {phase.estimatedDuration} • ${phase.estimatedCost.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {phase.startDate && phase.startDate.toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {phases.map((phase) => (
                    <div key={phase.id} className="flex justify-between items-center">
                      <span className="text-sm">{phase.name}</span>
                      <div className="text-right">
                        <div className="font-medium">
                          ${(phase.actualCost || phase.estimatedCost).toLocaleString()}
                        </div>
                        {phase.actualCost && phase.actualCost !== phase.estimatedCost && (
                          <div className={cn(
                            "text-xs",
                            phase.actualCost > phase.estimatedCost ? "text-red-500" : "text-green-500"
                          )}>
                            {phase.actualCost > phase.estimatedCost ? '+' : ''}
                            ${(phase.actualCost - phase.estimatedCost).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Spending vs Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Budget Progress</span>
                      <span>{Math.round((calculateActualSpend() / calculateTotalBudget()) * 100)}%</span>
                    </div>
                    <Progress value={(calculateActualSpend() / calculateTotalBudget()) * 100} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="font-bold text-lg">${calculateTotalBudget().toLocaleString()}</div>
                      <div className="text-muted-foreground">Budget</div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="font-bold text-lg">${calculateActualSpend().toLocaleString()}</div>
                      <div className="text-muted-foreground">Spent</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VehicleBuildProject;
