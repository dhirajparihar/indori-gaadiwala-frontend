'use client';

import { useState, useEffect } from 'react';
import { FaCalculator } from 'react-icons/fa';

interface EMICalculatorProps {
    price?: number;
    initialPrice?: number;
}

export default function EMICalculator({ price: propPrice, initialPrice = 500000 }: EMICalculatorProps) {
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
        <div className="card p-4 sm:p-6 bg-[#FAFAF8] border-[#E5E7EB] hover:border-[#D4A63F]">
            <div className="flex items-center space-x-2 sm:space-x-2.5 mb-4 sm:mb-5 text-[#111111] font-display">
                <FaCalculator className="text-base sm:text-lg text-[#D4A63F]" />
                <h3 className="font-bold text-sm sm:text-base">EMI Calculator</h3>
            </div>

            {/* EMI Display */}
            <div className="text-center mb-4 sm:mb-6 bg-white p-4 sm:p-6 rounded-2xl border border-[#E5E7EB] shadow-sm">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1.5 font-sans">Monthly EMI</p>
                <div className="text-2xl sm:text-3xl font-black text-[#111111] font-display">
                    {formatCurrency(emi)}<span className="text-xs sm:text-sm text-gray-400 font-normal">/mo</span>
                </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
                {/* Vehicle Price Input */}
                <div>
                    <div className="flex justify-between text-[10px] sm:text-xs mb-2 font-bold uppercase text-gray-500 font-sans tracking-wide">
                        <label>Vehicle Price</label>
                    </div>
                    {isFixedPrice ? (
                        <div className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#FAFAF8] border border-[#E5E7EB] rounded-full font-bold text-gray-700 text-xs sm:text-sm">
                            {formatCurrency(price)}
                        </div>
                    ) : (
                        <div className="relative">
                            <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs sm:text-sm">₹</span>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => {
                                    const val = Number(e.target.value);
                                    setPrice(val);
                                    if (downPayment > val) setDownPayment(Math.round(val * 0.2));
                                }}
                                className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-[#E5E7EB] rounded-full focus:outline-none focus:ring-1 focus:ring-[#D4A63F] focus:border-[#D4A63F] font-bold text-neutral-900 transition-all text-xs sm:text-sm font-sans"
                            />
                        </div>
                    )}
                </div>

                {/* Down Payment Slider */}
                <div>
                    <div className="flex justify-between text-[10px] sm:text-xs mb-2 font-bold uppercase text-gray-500 font-sans tracking-wide">
                        <label>Down Payment</label>
                        <span className="text-[#111111] font-bold text-xs sm:text-sm">{formatCurrency(downPayment)}</span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={price}
                        step={1000}
                        value={downPayment}
                        onChange={(e) => setDownPayment(Number(e.target.value))}
                        className="w-full h-2 sm:h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#D4A63F]"
                        style={{ touchAction: 'manipulation' }}
                    />
                    <div className="flex justify-between text-[9px] sm:text-[10px] text-gray-400 mt-2 uppercase font-bold tracking-wider font-sans">
                        <span>₹0</span>
                        <span>{formatCurrency(price)}</span>
                    </div>
                </div>

                {/* Interest Rate Slider */}
                <div>
                    <div className="flex justify-between text-[10px] sm:text-xs mb-2 font-bold uppercase text-gray-500 font-sans tracking-wide">
                        <label>Interest Rate (p.a)</label>
                        <span className="text-[#111111] font-bold text-xs sm:text-sm">{interestRate}%</span>
                    </div>
                    <input
                        type="range"
                        min={5}
                        max={20}
                        step={0.1}
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="w-full h-2 sm:h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#D4A63F]"
                        style={{ touchAction: 'manipulation' }}
                    />
                    <div className="flex justify-between text-[9px] sm:text-[10px] text-gray-400 mt-2 uppercase font-bold tracking-wider font-sans">
                        <span>5%</span>
                        <span>20%</span>
                    </div>
                </div>

                {/* Tenure Slider */}
                <div>
                    <div className="flex justify-between text-[10px] sm:text-xs mb-2 font-bold uppercase text-gray-500 font-sans tracking-wide">
                        <label>Loan Tenure</label>
                        <span className="text-[#111111] font-bold text-xs sm:text-sm">{tenure} Months</span>
                    </div>
                    <input
                        type="range"
                        min={12}
                        max={84}
                        step={6}
                        value={tenure}
                        onChange={(e) => setTenure(Number(e.target.value))}
                        className="w-full h-2 sm:h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#D4A63F]"
                        style={{ touchAction: 'manipulation' }}
                    />
                    <div className="flex justify-between text-[9px] sm:text-[10px] text-gray-400 mt-2 uppercase font-bold tracking-wider font-sans">
                        <span>1 Year</span>
                        <span>7 Years</span>
                    </div>
                </div>

                {/* Loan Amount Summary */}
                <div className="pt-4 sm:pt-5 border-t border-[#E5E7EB] flex justify-between items-center text-xs sm:text-sm font-semibold">
                    <span className="text-gray-500 font-sans">Loan Amount</span>
                    <span className="text-[#111111] font-display font-bold text-sm sm:text-base">{formatCurrency(Math.max(0, price - downPayment))}</span>
                </div>
            </div>
        </div>
    );
}
