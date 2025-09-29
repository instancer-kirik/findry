import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  DollarSign,
  Fuel,
  Home,
  Utensils,
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  CreditCard,
  Sparkles,
  Info
} from 'lucide-react';
import { TripPlanData, BudgetPlan } from '@/types/tour-planning';
import { cn } from '@/lib/utils';

interface BudgetPlanningStepProps {
  type: 'band_tour' | 'roadtrip';
  data: Partial<TripPlanData>;
  onUpdate: (data: Partial<TripPlanData>) => void;
}

const BudgetPlanningStep: React.FC<BudgetPlanningStepProps> = ({ type, data, onUpdate }) => {
  const [budget, setBudget] = useState<BudgetPlan>(data.budget || {
    total: 2000,
    fuel: 400,
    accommodation: 600,
    food: 400,
    activities: 300,
    emergency: 300,
    vehicle: 0,
    equipment: 0,
    tickets: 0
  });

  const [budgetMode, setBudgetMode] = useState<'total' | 'breakdown'>('total');

  useEffect(() => {
    onUpdate({ budget });
  }, [budget]);

  const calculateDays = () => {
    if (data.startDate && data.endDate) {
      return Math.ceil((data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24));
    }
    return 1;
  };

  const days = calculateDays();
  const partySize = data.partySize || 1;
  const perPersonPerDay = budget.total / partySize / days;

  const budgetCategories = [
    {
      id: 'fuel',
      name: '⛽ Fuel',
      icon: Fuel,
      color: 'from-red-500 to-orange-500',
      description: 'Gas, charging, or diesel costs',
      percentage: 20,
      tips: 'Consider fuel prices along your route'
    },
    {
      id: 'accommodation',
      name: '🏨 Accommodation',
      icon: Home,
      color: 'from-blue-500 to-indigo-500',
      description: 'Hotels, motels, camping fees',
      percentage: 30,
      tips: 'Mix camping with hotels to save'
    },
    {
      id: 'food',
      name: '🍔 Food & Drinks',
      icon: Utensils,
      color: 'from-green-500 to-teal-500',
      description: 'Meals, snacks, beverages',
      percentage: 20,
      tips: 'Cook your own meals when possible'
    },
    {
      id: 'activities',
      name: '🎢 Activities',
      icon: Activity,
      color: 'from-purple-500 to-pink-500',
      description: 'Tours, tickets, experiences',
      percentage: 15,
      tips: 'Look for free activities and nature'
    },
    {
      id: 'emergency',
      name: '🚨 Emergency Fund',
      icon: AlertTriangle,
      color: 'from-yellow-500 to-amber-500',
      description: 'Unexpected expenses, repairs',
      percentage: 15,
      tips: 'Always have a safety cushion'
    }
  ];

  if (type === 'band_tour') {
    budgetCategories.push({
      id: 'equipment',
      name: '🎸 Equipment',
      icon: Activity,
      color: 'from-indigo-500 to-purple-500',
      description: 'Gear rental, repairs, supplies',
      percentage: 10,
      tips: 'Factor in equipment transport costs'
    });
  }

  const handleTotalBudgetChange = (value: number) => {
    const newBudget = { ...budget, total: value };

    // Auto-distribute budget based on percentages
    budgetCategories.forEach(cat => {
      const key = cat.id as keyof BudgetPlan;
      newBudget[key] = Math.round(value * (cat.percentage / 100)) as any;
    });

    setBudget(newBudget);
  };

  const handleCategoryChange = (category: keyof BudgetPlan, value: number) => {
    const newBudget = { ...budget, [category]: value };

    // Recalculate total
    const categories = ['fuel', 'accommodation', 'food', 'activities', 'emergency', 'vehicle', 'equipment', 'tickets'] as const;
    newBudget.total = categories.reduce((sum, cat) => sum + (newBudget[cat] || 0), 0);

    setBudget(newBudget);
  };

  const getSpentPercentage = (category: keyof BudgetPlan) => {
    return budget.total > 0 ? ((budget[category] || 0) / budget.total) * 100 : 0;
  };

  const getBudgetHealth = () => {
    if (perPersonPerDay < 50) return { status: 'tight', color: 'text-orange-600', message: 'Budget is tight!' };
    if (perPersonPerDay < 100) return { status: 'moderate', color: 'text-yellow-600', message: 'Reasonable budget' };
    if (perPersonPerDay < 200) return { status: 'comfortable', color: 'text-green-600', message: 'Comfortable budget!' };
    return { status: 'luxury', color: 'text-purple-600', message: 'Luxury experience!' };
  };

  const budgetHealth = getBudgetHealth();

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">${budget.total}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Per Person/Day</p>
                <p className="text-2xl font-bold">${perPersonPerDay.toFixed(0)}</p>
              </div>
              <PiggyBank className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className={cn("text-lg font-semibold", budgetHealth.color)}>
                  {budgetHealth.message}
                </p>
              </div>
              <Sparkles className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Input Mode */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">💰 Set Your Budget</Label>
          <div className="flex gap-2">
            <Badge
              variant={budgetMode === 'total' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setBudgetMode('total')}
            >
              Simple
            </Badge>
            <Badge
              variant={budgetMode === 'breakdown' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setBudgetMode('breakdown')}
            >
              Detailed
            </Badge>
          </div>
        </div>

        {budgetMode === 'total' ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Trip Budget</span>
                <span className="font-bold">${budget.total}</span>
              </div>
              <Slider
                value={[budget.total]}
                onValueChange={(value) => handleTotalBudgetChange(value[0])}
                min={100}
                max={10000}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>$100</span>
                <span>$10,000</span>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Budget will be automatically distributed across categories. Switch to "Detailed" mode for custom allocation.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="space-y-4">
            {budgetCategories.map((category) => {
              const Icon = category.icon;
              const value = budget[category.id as keyof BudgetPlan] || 0;
              const percentage = getSpentPercentage(category.id as keyof BudgetPlan);

              return (
                <div key={category.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={cn("p-2 rounded-lg bg-gradient-to-r text-white", category.color)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-xs text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Input
                        type="number"
                        value={value}
                        onChange={(e) => handleCategoryChange(category.id as keyof BudgetPlan, parseInt(e.target.value) || 0)}
                        className="w-24 text-right"
                        min={0}
                        step={10}
                      />
                      <p className="text-xs text-muted-foreground mt-1">{percentage.toFixed(0)}% of total</p>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <p className="text-xs text-muted-foreground italic">💡 {category.tips}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Budget Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <h4 className="font-semibold flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-green-600" />
              Money Saving Tips
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Book accommodations in advance</li>
              <li>• Use apps to find cheap gas</li>
              <li>• Pack snacks and drinks</li>
              <li>• Look for free camping spots</li>
              {type === 'band_tour' && <li>• Share equipment costs with other bands</li>}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <h4 className="font-semibold flex items-center gap-2 mb-2">
              <CreditCard className="h-4 w-4 text-blue-600" />
              Budget Reality Check
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• {days} days = ~${(budget.total / days).toFixed(0)}/day</li>
              <li>• {partySize} people = ~${(budget.total / partySize).toFixed(0)}/person</li>
              <li>• Emergency fund: {((budget.emergency / budget.total) * 100).toFixed(0)}% of total</li>
              <li>• Daily food budget: ~${(budget.food / days).toFixed(0)}</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Fun Budget Visualization */}
      <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg">
        <p className="text-sm font-semibold mb-2">📊 Your Budget Breakdown:</p>
        <div className="flex flex-wrap gap-2">
          {budgetCategories.map((cat) => {
            const percentage = getSpentPercentage(cat.id as keyof BudgetPlan);
            if (percentage > 0) {
              return (
                <Badge key={cat.id} variant="secondary">
                  {cat.name.split(' ')[0]} {percentage.toFixed(0)}%
                </Badge>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanningStep;
