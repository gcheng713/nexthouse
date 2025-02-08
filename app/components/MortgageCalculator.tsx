"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function MortgageCalculator() {
  const [homeValue, setHomeValue] = useState(300000)
  const [downPayment, setDownPayment] = useState(60000)
  const [interestRate, setInterestRate] = useState(3.5)
  const [loanTerm, setLoanTerm] = useState(30)
  const [monthlyPayment, setMonthlyPayment] = useState(0)

  const calculateMortgage = () => {
    const principal = homeValue - downPayment
    const monthlyRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm * 12

    const mortgage =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

    setMonthlyPayment(mortgage)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mortgage Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="homeValue">Home Value</Label>
            <Input
              id="homeValue"
              type="number"
              value={homeValue}
              onChange={(e) => setHomeValue(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="downPayment">Down Payment</Label>
            <Input
              id="downPayment"
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="interestRate">Interest Rate (%)</Label>
            <Input
              id="interestRate"
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="loanTerm">Loan Term (years)</Label>
            <Input id="loanTerm" type="number" value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value))} />
          </div>
          <Button onClick={calculateMortgage}>Calculate</Button>
          {monthlyPayment > 0 && (
            <div className="mt-4">
              <p className="font-bold">Estimated Monthly Payment: ${monthlyPayment.toFixed(2)}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

