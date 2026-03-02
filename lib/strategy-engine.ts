import {
  Debt,
  Income,
  Expense,
  PaymentStrategy,
  AdvancedStrategicPlan,
  StrategyComparison,
  DebtPaymentPlan,
  DebtProjection,
} from './types';

// Calculate monthly amount considering frequency
export const getMonthlyAmount = (amount: number, frequency: string): number => {
  switch (frequency) {
    case 'daily':
      return amount * 30;
    case 'weekly':
      return amount * 4.33;
    case 'biweekly':
      return amount * 2.17;
    case 'monthly':
      return amount;
    case 'yearly':
      return amount / 12;
    default:
      return amount;
  }
};

// Calculate monthly interest for a debt
const calculateMonthlyInterest = (balance: number, annualRate: number): number => {
  return (balance * annualRate) / 100 / 12;
};

// Generate month-by-month projections for a debt
const generateProjections = (
  debt: Debt,
  monthlyPayment: number,
  months: number
): DebtProjection[] => {
  const projections: DebtProjection[] = [];
  let balance = debt.amount;
  let totalInterest = 0;

  for (let month = 1; month <= months; month++) {
    const monthDate = new Date();
    monthDate.setMonth(monthDate.getMonth() + month);

    const monthlyInterest = calculateMonthlyInterest(balance, debt.interestRate);
    const principal = Math.min(monthlyPayment - monthlyInterest, balance);
    const actualPayment = principal + monthlyInterest;

    balance -= principal;
    totalInterest += monthlyInterest;

    projections.push({
      month,
      monthDate,
      balance: Math.max(0, balance),
      payment: actualPayment,
      interest: monthlyInterest,
      principal,
    });

    if (balance <= 0) break;
  }

  return projections;
};

// Calculate total interest paid over the life of the debt
const calculateTotalInterest = (
  debt: Debt,
  monthlyPayment: number,
  maxMonths: number = 360
): { totalInterest: number; monthsToPayoff: number } => {
  let balance = debt.amount;
  let totalInterest = 0;
  let months = 0;

  while (balance > 0 && months < maxMonths) {
    const monthlyInterest = calculateMonthlyInterest(balance, debt.interestRate);
    const principal = Math.min(monthlyPayment - monthlyInterest, balance);
    balance -= principal;
    totalInterest += monthlyInterest;
    months++;
  }

  return { totalInterest, monthsToPayoff: months };
};

// Avalanche method: Pay highest interest first
export const generateAvalancheStrategy = (
  debts: Debt[],
  availableMonthly: number
): StrategyComparison => {
  const sortedDebts = [...debts].sort((a, b) => b.interestRate - a.interestRate);
  const debtPaymentPlans: DebtPaymentPlan[] = [];
  let remainingAvailable = availableMonthly;
  let maxMonths = 0;
  let totalInterestPaid = 0;

  sortedDebts.forEach((debt, index) => {
    const priority = index + 1;
    const monthlyInterest = calculateMonthlyInterest(debt.amount, debt.interestRate);
    const minimumPayment = Math.max(monthlyInterest * 1.1, 50);

    const allocatedPayment = Math.min(
      minimumPayment + remainingAvailable / (sortedDebts.length - index),
      remainingAvailable
    );
    remainingAvailable -= allocatedPayment;

    const { totalInterest, monthsToPayoff } = calculateTotalInterest(
      debt,
      allocatedPayment
    );
    const projections = generateProjections(debt, allocatedPayment, monthsToPayoff);

    totalInterestPaid += totalInterest;
    maxMonths = Math.max(maxMonths, monthsToPayoff);

    debtPaymentPlans.push({
      debtId: debt.id,
      debtName: debt.name,
      currentBalance: debt.amount,
      monthlyPayment: allocatedPayment,
      priority,
      estimatedPayoffMonths: monthsToPayoff,
      strategy: `Paga $${allocatedPayment.toFixed(2)} mensuales. Estimado ${monthsToPayoff} meses.`,
      interestRate: debt.interestRate,
      totalInterestPaid: totalInterest,
      projections,
    });
  });

  return {
    strategy: 'avalanche',
    name: 'Método Avalanche',
    description: 'Paga primero las deudas con mayor interés para ahorrar dinero a largo plazo.',
    totalMonthsToPayoff: maxMonths,
    totalInterestPaid,
    totalAmountPaid: debts.reduce((sum, d) => sum + d.amount, 0) + totalInterestPaid,
    interestSavings: 0, // Will be calculated in comparison
    debtPaymentPlans,
    recommendations: [
      '💡 Método Avalanche: Minimiza el interés total pagado',
      `📊 Ahorrarás dinero a largo plazo enfocándote en deudas de alto interés`,
      `⏱️ Tiempo total: ${maxMonths} meses`,
    ],
  };
};

// Snowball method: Pay smallest balance first
export const generateSnowballStrategy = (
  debts: Debt[],
  availableMonthly: number
): StrategyComparison => {
  const sortedDebts = [...debts].sort((a, b) => a.amount - b.amount);
  const debtPaymentPlans: DebtPaymentPlan[] = [];
  let remainingAvailable = availableMonthly;
  let maxMonths = 0;
  let totalInterestPaid = 0;

  sortedDebts.forEach((debt, index) => {
    const priority = index + 1;
    const monthlyInterest = calculateMonthlyInterest(debt.amount, debt.interestRate);
    const minimumPayment = Math.max(monthlyInterest * 1.1, 50);

    const allocatedPayment = Math.min(
      minimumPayment + remainingAvailable / (sortedDebts.length - index),
      remainingAvailable
    );
    remainingAvailable -= allocatedPayment;

    const { totalInterest, monthsToPayoff } = calculateTotalInterest(
      debt,
      allocatedPayment
    );
    const projections = generateProjections(debt, allocatedPayment, monthsToPayoff);

    totalInterestPaid += totalInterest;
    maxMonths = Math.max(maxMonths, monthsToPayoff);

    debtPaymentPlans.push({
      debtId: debt.id,
      debtName: debt.name,
      currentBalance: debt.amount,
      monthlyPayment: allocatedPayment,
      priority,
      estimatedPayoffMonths: monthsToPayoff,
      strategy: `Paga $${allocatedPayment.toFixed(2)} mensuales. Estimado ${monthsToPayoff} meses.`,
      interestRate: debt.interestRate,
      totalInterestPaid: totalInterest,
      projections,
    });
  });

  return {
    strategy: 'snowball',
    name: 'Método Snowball',
    description: 'Paga primero las deudas más pequeñas para ganar momentum psicológico.',
    totalMonthsToPayoff: maxMonths,
    totalInterestPaid,
    totalAmountPaid: debts.reduce((sum, d) => sum + d.amount, 0) + totalInterestPaid,
    interestSavings: 0,
    debtPaymentPlans,
    recommendations: [
      '🎯 Método Snowball: Gana motivación rápidamente',
      `✅ Elimina deudas pequeñas primero para un sentido de logro`,
      `⏱️ Tiempo total: ${maxMonths} meses`,
    ],
  };
};

// Hybrid method: Balance between interest and psychology
export const generateHybridStrategy = (
  debts: Debt[],
  availableMonthly: number
): StrategyComparison => {
  // Sort by a combination of interest rate and balance
  const sortedDebts = [...debts].sort((a, b) => {
    const scoreA = (a.interestRate * 0.6) + (a.amount / 1000 * 0.4);
    const scoreB = (b.interestRate * 0.6) + (b.amount / 1000 * 0.4);
    return scoreB - scoreA;
  });

  const debtPaymentPlans: DebtPaymentPlan[] = [];
  let remainingAvailable = availableMonthly;
  let maxMonths = 0;
  let totalInterestPaid = 0;

  sortedDebts.forEach((debt, index) => {
    const priority = index + 1;
    const monthlyInterest = calculateMonthlyInterest(debt.amount, debt.interestRate);
    const minimumPayment = Math.max(monthlyInterest * 1.1, 50);

    const allocatedPayment = Math.min(
      minimumPayment + remainingAvailable / (sortedDebts.length - index),
      remainingAvailable
    );
    remainingAvailable -= allocatedPayment;

    const { totalInterest, monthsToPayoff } = calculateTotalInterest(
      debt,
      allocatedPayment
    );
    const projections = generateProjections(debt, allocatedPayment, monthsToPayoff);

    totalInterestPaid += totalInterest;
    maxMonths = Math.max(maxMonths, monthsToPayoff);

    debtPaymentPlans.push({
      debtId: debt.id,
      debtName: debt.name,
      currentBalance: debt.amount,
      monthlyPayment: allocatedPayment,
      priority,
      estimatedPayoffMonths: monthsToPayoff,
      strategy: `Paga $${allocatedPayment.toFixed(2)} mensuales. Estimado ${monthsToPayoff} meses.`,
      interestRate: debt.interestRate,
      totalInterestPaid: totalInterest,
      projections,
    });
  });

  return {
    strategy: 'hybrid',
    name: 'Método Híbrido',
    description: 'Combina lo mejor de Avalanche y Snowball para máxima eficiencia.',
    totalMonthsToPayoff: maxMonths,
    totalInterestPaid,
    totalAmountPaid: debts.reduce((sum, d) => sum + d.amount, 0) + totalInterestPaid,
    interestSavings: 0,
    debtPaymentPlans,
    recommendations: [
      '⚖️ Método Híbrido: El mejor balance entre ahorro y motivación',
      `💪 Elimina deudas de alto interés mientras ganas victorias rápidas`,
      `⏱️ Tiempo total: ${maxMonths} meses`,
    ],
  };
};

// Generate all strategies and compare
export const generateAllStrategies = (
  debts: Debt[],
  availableMonthly: number
): StrategyComparison[] => {
  if (debts.length === 0) return [];

  const strategies = [
    generateAvalancheStrategy(debts, availableMonthly),
    generateSnowballStrategy(debts, availableMonthly),
    generateHybridStrategy(debts, availableMonthly),
  ];

  // Calculate interest savings compared to minimum payments
  const minPaymentStrategy = strategies[0];
  const minTotalInterest = minPaymentStrategy.totalInterestPaid;

  return strategies.map((strategy) => ({
    ...strategy,
    interestSavings: minTotalInterest - strategy.totalInterestPaid,
  }));
};

// Recommend the best strategy
export const recommendBestStrategy = (
  strategies: StrategyComparison[]
): PaymentStrategy => {
  if (strategies.length === 0) return 'avalanche';

  // Find the strategy with lowest total interest
  const bestByInterest = strategies.reduce((best, current) =>
    current.totalInterestPaid < best.totalInterestPaid ? current : best
  );

  // If the difference is small, prefer hybrid for psychological benefit
  const avalanche = strategies.find((s) => s.strategy === 'avalanche');
  const hybrid = strategies.find((s) => s.strategy === 'hybrid');

  if (avalanche && hybrid) {
    const interestDifference = avalanche.totalInterestPaid - hybrid.totalInterestPaid;
    if (interestDifference < avalanche.totalInterestPaid * 0.1) {
      return 'hybrid';
    }
  }

  return bestByInterest.strategy;
};

// Generate complete advanced strategic plan
export const generateAdvancedStrategicPlan = (
  incomes: Income[],
  debts: Debt[],
  expenses: Expense[]
): AdvancedStrategicPlan | null => {
  if (debts.length === 0) return null;

  const totalMonthlyIncome = incomes.reduce((sum, income) => {
    return sum + getMonthlyAmount(income.amount, income.frequency);
  }, 0);

  const totalMonthlyExpenses = expenses.reduce((sum, expense) => {
    return sum + getMonthlyAmount(expense.amount, expense.frequency);
  }, 0);

  const availableForDebtPayment = totalMonthlyIncome - totalMonthlyExpenses;
  const totalDebtAmount = debts.reduce((sum, d) => sum + d.amount, 0);
  const debtToIncomeRatio = totalMonthlyIncome > 0 ? (totalDebtAmount / totalMonthlyIncome) * 100 : 0;
  const expenseToIncomeRatio = totalMonthlyIncome > 0 ? (totalMonthlyExpenses / totalMonthlyIncome) * 100 : 0;
  const savingsRate = totalMonthlyIncome > 0 ? ((totalMonthlyIncome - totalMonthlyExpenses) / totalMonthlyIncome) * 100 : 0;

  // Generate all strategies
  const strategies = availableForDebtPayment > 0
    ? generateAllStrategies(debts, availableForDebtPayment)
    : [];

  const recommendedStrategy = recommendBestStrategy(strategies);
  const recommendedPlan = strategies.find((s) => s.strategy === recommendedStrategy);

  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
  if (debtToIncomeRatio > 100) riskLevel = 'critical';
  else if (debtToIncomeRatio > 50) riskLevel = 'high';
  else if (debtToIncomeRatio > 30) riskLevel = 'medium';

  // Calculate estimated debt-free date
  const estimatedMonths = recommendedPlan?.totalMonthsToPayoff || 0;
  const estimatedDebtFreeDate = estimatedMonths > 0
    ? new Date(Date.now() + estimatedMonths * 30 * 24 * 60 * 60 * 1000)
    : null;

  // Generate recommendations
  const recommendations: string[] = [];
  const alerts: string[] = [];
  const opportunities: string[] = [];

  if (availableForDebtPayment <= 0) {
    alerts.push('⚠️ No tienes dinero disponible para pagar deudas. Necesitas reducir gastos o aumentar ingresos.');
  } else {
    recommendations.push(`✅ Tienes $${availableForDebtPayment.toFixed(2)} disponibles mensualmente para pagar deudas.`);
  }

  if (riskLevel === 'critical') {
    alerts.push('🚨 Tu situación financiera es crítica. Necesitas acción inmediata.');
  } else if (riskLevel === 'high') {
    alerts.push('⚠️ Tu deuda es alta. Enfócate en el plan de pago estratégico.');
  }

  if (recommendedPlan) {
    recommendations.push(`📅 Podrías estar libre de deudas en ${estimatedMonths} meses (${(estimatedMonths / 12).toFixed(1)} años).`);
    recommendations.push(`💰 Total de intereses a pagar: $${recommendedPlan.totalInterestPaid.toFixed(2)}`);
  }

  if (expenseToIncomeRatio > 80) {
    alerts.push('💡 Tus gastos son muy altos. Considera reducirlos para acelerar el pago de deudas.');
    opportunities.push('🎯 Oportunidad: Reducir gastos en 10% liberaría $' + (totalMonthlyExpenses * 0.1).toFixed(2) + ' mensuales.');
  }

  if (savingsRate > 20) {
    opportunities.push('🚀 Excelente: Tienes un buen margen de ahorro. Considera aumentar pagos de deudas.');
  }

  // Compare strategies
  if (strategies.length > 1) {
    const avalanche = strategies.find((s) => s.strategy === 'avalanche');
    const snowball = strategies.find((s) => s.strategy === 'snowball');
    if (avalanche && snowball) {
      const savings = avalanche.totalInterestPaid - snowball.totalInterestPaid;
      if (savings > 0) {
        recommendations.push(`💡 Avalanche ahorra $${Math.abs(savings).toFixed(2)} vs Snowball.`);
      }
    }
  }

  return {
    id: Date.now().toString(),
    createdAt: new Date(),
    totalMonthlyIncome,
    totalMonthlyExpenses,
    availableForDebtPayment,
    strategies,
    recommendedStrategy,
    riskLevel,
    estimatedDebtFreeDate,
    totalDebtAmount,
    totalMonthlyDebtPayment: recommendedPlan?.debtPaymentPlans.reduce((sum, p) => sum + p.monthlyPayment, 0) || 0,
    recommendations,
    alerts,
    opportunities,
    debtToIncomeRatio,
    expenseToIncomeRatio,
    savingsRate,
  };
};
