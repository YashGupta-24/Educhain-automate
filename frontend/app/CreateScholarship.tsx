// frontend/app/CreateScholarship.tsx
'use client';
import { useState } from 'react';
import { useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import { contractAddress, contractAbi } from '../lib/contract';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; // Import toast from sonner

export function CreateScholarship() {
  const [criteria, setCriteria] = useState('');
  const [amountPerSemester, setAmountPerSemester] = useState('');
  const [totalAmount, setTotalAmount] = useState('');

  const { writeContract, isPending } = useWriteContract({
    onSuccess: () => {
      toast.success("Success!", { description: "Scholarship created and funded." });
      setCriteria('');
      setAmountPerSemester('');
      setTotalAmount('');
    },
    onError: (error) => {
      toast.error("Error", { description: error.shortMessage });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!criteria || !amountPerSemester || !totalAmount) return;
    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'createScholarship',
      args: [parseEther(amountPerSemester), criteria],
      value: parseEther(totalAmount),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>For Donors: Create a Scholarship</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="criteria">Eligibility Criteria</Label>
            <Input id="criteria" placeholder='e.g., "CS Major, GPA > 3.5"' value={criteria} onChange={(e) => setCriteria(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amountPerSemester">Amount Per Semester (in ETH)</Label>
            <Input id="amountPerSemester" type="number" step="any" placeholder="0.1" value={amountPerSemester} onChange={(e) => setAmountPerSemester(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalAmount">Total Funding Amount (in ETH)</Label>
            <Input id="totalAmount" type="number" step="any" placeholder="0.5" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} required />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Confirming...' : 'Create Scholarship'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}