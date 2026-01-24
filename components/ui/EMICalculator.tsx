'use client';

import { useState, useEffect } from 'react';
import { FaCalculator } from 'react-icons/fa';

interface EMICalculatorProps {
    price?: number;
    initialPrice?: number;
}

export default function EMICalculator({ price: propPrice, initialPrice = 500000 }: EMICalculatorProps) {
    // If propPrice is provided, use it and disable editing (unless we want to allow overriding)
    // For this design: if propPrice is present, it's fixed (Vehicle Detail Page). 
    // If not, use initialPrice and allow editing (Finance Page).

    const isFixedPrice = propPrice !== undefined;
    const [price, setPrice] = useState(propPrice || initialPrice);

    const [downPayment, setDownPayment] = useState(Math.round(price * 0.2));
    const [interestRate, setInterestRate] = useState(10.5);
    const [tenure, setTenure] = useState(36);
    const [emi, setEmi] = useState(0);

    // Update price if prop changes
    useEffect(() => {
        if (propPrice !== undefined) {
            setPrice(propPrice);
            setDownPayment(Math.round(propPrice * 0.2));
        }
    }, [propPrice]);

    useEffect(() => {
        calculateEMI();
    }, [downPayment, interestRate, tenure, price]);

    const calculateEMI = () => {
        const principal = price - downPayment;
        const ratePerMonth = interestRate / 12 / 100;

        if (principal <= 0) {
            setEmi(0);
            return;
        }

        const calculatedEmi =
            (principal * ratePerMonth * Math.pow(1 + ratePerMonth, tenure)) /
            (Math.pow(1 + ratePerMonth, tenure) - 1);

        setEmi(Math.round(calculatedEmi));
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="card p-5 bg-gradient-to-br from-blue-50 to-white border-blue-100">
            <div className="flex items-center space-x-2 mb-4 text-blue-800">
                <FaCalculator className="text-xl" />
                <h3 className="font-bold text-lg">EMI Calculator</h3>
            </div>

            {/* EMI Display */}
            <div className="text-center mb-6 bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                <p className="text-sm text-gray-500 font-medium mb-1">Monthly EMI</p>
                <div className="text-3xl font-black text-blue-600">
                    {formatCurrency(emi)}<span className="text-sm text-gray-400 font-normal">/mo</span>
                </div>
            </div>

            <div className="space-y-6">
                {/* Vehicle Price Input */}
                <div>
                    <div className="flex justify-between text-sm mb-2 font-semibold text-gray-700">
                        <label>Vehicle Price</label>
                    </div>
                    {isFixedPrice ? (
                        <div className="w-full px-4 py-2 bg-blue-50 border border-blue-100 rounded-lg font-bold text-gray-700">
                            {formatCurrency(price)}
                        </div>
                    ) : (
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => {
                                    const val = Number(e.target.value);
                                    setPrice(val);
                                    // Reset down payment to 20% if price changes drastically or just check logic?
                                    // Let's keep down payment as is unless it exceeds price
                                    if (downPayment > val) setDownPayment(Math.round(val * 0.2));
                                }}
                                className="w-full pl-8 pr-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900"
                            />
                        </div>
                    )}
                </div>

                {/* Down Payment Slider */}
                <div>
                    <div className="flex justify-between text-sm mb-2 font-semibold text-gray-700">
                        <label>Down Payment</label>
                        <span className="text-blue-600">{formatCurrency(downPayment)}</span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={price}
                        step={1000}
                        value={downPayment}
                        onChange={(e) => setDownPayment(Number(e.target.value))}
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>₹0</span>
                        <span>{formatCurrency(price)}</span>
                    </div>
                </div>

                {/* Interest Rate Slider */}
                <div>
                    <div className="flex justify-between text-sm mb-2 font-semibold text-gray-700">
                        <label>Interest Rate (p.a)</label>
                        <span className="text-blue-600">{interestRate}%</span>
                    </div>
                    <input
                        type="range"
                        min={5}
                        max={20}
                        step={0.1}
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>5%</span>
                        <span>20%</span>
                    </div>
                </div>

                {/* Tenure Slider */}
                <div>
                    <div className="flex justify-between text-sm mb-2 font-semibold text-gray-700">
                        <label>Loan Tenure</label>
                        <span className="text-blue-600">{tenure} Months</span>
                    </div>
                    <input
                        type="range"
                        min={12}
                        max={84}
                        step={6}
                        value={tenure}
                        onChange={(e) => setTenure(Number(e.target.value))}
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>1 Year</span>
                        <span>7 Years</span>
                    </div>
                </div>

                {/* Loan Amount Summary */}
                <div className="pt-4 border-t border-blue-100 flex justify-between items-center text-sm font-medium">
                    <span className="text-gray-500">Loan Amount</span>
                    <span className="text-gray-900">{formatCurrency(Math.max(0, price - downPayment))}</span>
                </div>
            </div>
        </div>
    );
}
