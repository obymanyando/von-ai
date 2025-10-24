import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, Clock, DollarSign, Users, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface CalculatorInputs {
  employeeCount: number;
  avgHourlyRate: number;
  hoursPerWeek: number;
  responseTime: number;
  monthlyLeads: number;
}

interface CalculatorResults {
  annualTimeSavings: number;
  annualCostSavings: number;
  productivityGain: number;
  additionalRevenue: number;
  totalROI: number;
}

export function ROICalculator({ variant = "embedded" }: { variant?: "embedded" | "standalone" }) {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    employeeCount: 5,
    avgHourlyRate: 25,
    hoursPerWeek: 10,
    responseTime: 4,
    monthlyLeads: 100,
  });

  const [showResults, setShowResults] = useState(false);

  const calculateROI = (): CalculatorResults => {
    const weeksPerYear = 52;
    const automationEfficiency = 0.70;
    const revenuePerLead = 500;
    const conversionIncrease = 0.25;

    const currentAnnualHours = inputs.hoursPerWeek * weeksPerYear;
    const automatedHours = currentAnnualHours * automationEfficiency;
    const annualTimeSavings = automatedHours * inputs.employeeCount;

    const annualCostSavings = annualTimeSavings * inputs.avgHourlyRate;

    const productivityGain = (automatedHours / currentAnnualHours) * 100;

    const annualLeads = inputs.monthlyLeads * 12;
    const additionalLeadsConverted = annualLeads * conversionIncrease * 0.15;
    const additionalRevenue = additionalLeadsConverted * revenuePerLead;

    const implementationCost = 25000;
    const totalROI = ((annualCostSavings + additionalRevenue - implementationCost) / implementationCost) * 100;

    return {
      annualTimeSavings,
      annualCostSavings,
      productivityGain,
      additionalRevenue,
      totalROI,
    };
  };

  const results = showResults ? calculateROI() : null;

  const handleInputChange = (field: keyof CalculatorInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs(prev => ({ ...prev, [field]: numValue }));
    setShowResults(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <section className={variant === "standalone" ? "py-20 bg-background" : "py-16 bg-muted/50"}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-lg mb-4">
            <Calculator className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            Calculate Your ROI
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how much you could save and earn with AI automation tailored to your business
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Your Current Situation</CardTitle>
              <CardDescription>Enter your business metrics to see potential savings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="employeeCount">Number of Employees Handling Repetitive Tasks</Label>
                <Input
                  id="employeeCount"
                  type="number"
                  min="1"
                  value={inputs.employeeCount}
                  onChange={(e) => handleInputChange("employeeCount", e.target.value)}
                  data-testid="input-employee-count"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="avgHourlyRate">Average Hourly Rate ($)</Label>
                <Input
                  id="avgHourlyRate"
                  type="number"
                  min="0"
                  value={inputs.avgHourlyRate}
                  onChange={(e) => handleInputChange("avgHourlyRate", e.target.value)}
                  data-testid="input-hourly-rate"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="hoursPerWeek">Hours Spent on Repetitive Tasks (per employee/week)</Label>
                <Input
                  id="hoursPerWeek"
                  type="number"
                  min="0"
                  max="40"
                  value={inputs.hoursPerWeek}
                  onChange={(e) => handleInputChange("hoursPerWeek", e.target.value)}
                  data-testid="input-hours-per-week"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="responseTime">Average Response Time (hours)</Label>
                <Input
                  id="responseTime"
                  type="number"
                  min="0"
                  value={inputs.responseTime}
                  onChange={(e) => handleInputChange("responseTime", e.target.value)}
                  data-testid="input-response-time"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="monthlyLeads">Monthly Leads/Inquiries</Label>
                <Input
                  id="monthlyLeads"
                  type="number"
                  min="0"
                  value={inputs.monthlyLeads}
                  onChange={(e) => handleInputChange("monthlyLeads", e.target.value)}
                  data-testid="input-monthly-leads"
                  className="mt-2"
                />
              </div>

              <Button
                onClick={() => setShowResults(true)}
                className="w-full"
                size="lg"
                data-testid="button-calculate-roi"
              >
                <Calculator className="mr-2 h-4 w-4" />
                Calculate My ROI
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className={showResults ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle>Your Potential Results</CardTitle>
              <CardDescription>
                {showResults
                  ? "Here's what AI automation could deliver for your business"
                  : "Complete the form and click Calculate to see your results"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showResults && results ? (
                <div className="space-y-6">
                  {/* Time Savings */}
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Annual Time Savings</p>
                      <p className="text-2xl font-bold text-foreground" data-testid="result-time-savings">
                        {formatNumber(results.annualTimeSavings)} hours
                      </p>
                      <Badge variant="outline" className="mt-1">
                        {results.productivityGain.toFixed(0)}% productivity gain
                      </Badge>
                    </div>
                  </div>

                  {/* Cost Savings */}
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <DollarSign className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Annual Cost Savings</p>
                      <p className="text-2xl font-bold text-foreground" data-testid="result-cost-savings">
                        {formatCurrency(results.annualCostSavings)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        From automated processes
                      </p>
                    </div>
                  </div>

                  {/* Revenue Impact */}
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Additional Annual Revenue</p>
                      <p className="text-2xl font-bold text-foreground" data-testid="result-revenue-impact">
                        {formatCurrency(results.additionalRevenue)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        From improved conversion rates
                      </p>
                    </div>
                  </div>

                  {/* Total ROI */}
                  <div className="p-6 rounded-lg bg-primary text-primary-foreground">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="h-6 w-6" />
                      <p className="text-sm font-medium">Total 1-Year ROI</p>
                    </div>
                    <p className="text-4xl font-bold mb-1" data-testid="result-total-roi">
                      {results.totalROI.toFixed(0)}%
                    </p>
                    <p className="text-sm opacity-90">
                      Projected return on investment in the first year
                    </p>
                  </div>

                  {/* CTA */}
                  <Link href="/contact">
                    <a>
                      <Button variant="default" size="lg" className="w-full" data-testid="button-schedule-consultation">
                        Schedule a Consultation
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                  </Link>

                  <p className="text-xs text-center text-muted-foreground">
                    *Results are estimates based on industry averages. Actual results may vary.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Calculator className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                  <p className="text-muted-foreground">
                    Enter your business details to calculate potential ROI
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
