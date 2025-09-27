// frontend/app/ScholarshipList.tsx
'use client';
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { contractAddress, contractAbi } from '../lib/contract';
import { formatEther } from 'viem';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner"; // Import toast from sonner

function ScholarshipCard({ id }: { id: bigint }) {
    const { address } = useAccount();
    const { data: scholarship, isLoading, isError } = useReadContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'scholarships',
        args: [id],
        watch: true,
    });

    const { writeContract, isPending } = useWriteContract({
        onSuccess: () => {
          toast.success("Success!", { description: "You have applied for the scholarship." });
        },
        onError: (error) => {
          toast.error("Error", { description: error.shortMessage });
        }
    });

    if (isLoading) return <Card className="p-4">Loading scholarship...</Card>;
    if (isError) return <Card className="p-4 text-red-500">Error loading scholarship.</Card>;
    if (!scholarship) return null;

    const [, donor, totalAmount, amountPerSemester, student, isClaimed, eligibilityCriteria] = scholarship as [bigint, string, bigint, bigint, string, boolean, string];

    const isMyScholarship = address && student.toLowerCase() === address.toLowerCase();

    return (
        <Card className={isMyScholarship ? "bg-green-950" : ""}>
            <CardHeader>
                <CardTitle>Scholarship #{id.toString()}</CardTitle>
                <CardDescription>{eligibilityCriteria}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
                <p><strong>Amount:</strong> {formatEther(amountPerSemester)} ETH per semester</p>
                <p><strong>Remaining Funds:</strong> {formatEther(totalAmount)} ETH</p>
                <p><strong>Status:</strong> {isClaimed ? `Claimed by ${student.slice(0,6)}...${student.slice(-4)}` : 'Available'}</p>
            </CardContent>
            <CardFooter>
                {!isClaimed && (
                    <Button onClick={() => writeContract({ address: contractAddress, abi: contractAbi, functionName: 'applyForScholarship', args: [id] })} disabled={isPending}>
                        {isPending ? 'Applying...' : 'Apply Now'}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}

export function ScholarshipList() {
  const { data: count, isLoading, isError } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'scholarshipCount',
    watch: true, 
  });

  if (isLoading) return <p className="text-center mt-4">Loading scholarships...</p>;
  if (isError) return <p className="text-center mt-4 text-red-500">Could not fetch scholarships.</p>;

  const numCount = typeof count === 'bigint' ? Number(count) : 0;
  const scholarshipIds = Array.from({ length: numCount }, (_, i) => BigInt(i + 1));

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">For Students: Available Scholarships</h2>
      <div className="space-y-4">
        {scholarshipIds.length > 0 
           ? scholarshipIds.map(id => <ScholarshipCard key={id.toString()} id={id} />) 
           : <p className="text-center text-gray-500">No scholarships created yet.</p>
        }
      </div>
    </div>
  );
}