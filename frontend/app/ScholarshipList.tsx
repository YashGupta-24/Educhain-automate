'use client';
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import ContractInfo from '../contracts/EduChainAutomate.json';
import { formatEther } from 'viem';
import { useEffect, useState } from 'react';

const contractAddress = '0x11F5bf6943EAd671062e30f630F61D04b801dE5C'; // ‼️ PASTE YOUR ADDRESS HERE

function ScholarshipCard({ id }: { id: bigint }) {
    const { address } = useAccount();
    const { data: scholarship, isLoading } = useReadContract({
        address: `0x${contractAddress.substring(2)}`,
        abi: ContractInfo.abi,
        functionName: 'scholarships',
        args: [id],
    });

    const { writeContract, isPending } = useWriteContract();

    if (isLoading) return <div>Loading scholarship {id.toString()}...</div>;
    if (!scholarship) return null;

    const [donor, totalAmount, amountPerSemester, student, isClaimed, eligibilityCriteria] = scholarship as any;

    const isMyScholarship = address && student.toLowerCase() === address.toLowerCase();

    return (
        <div style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', background: isMyScholarship ? '#e8f5e9' : 'white' }}>
            <h3>Scholarship #{id.toString()}</h3>
            <p><strong>Criteria:</strong> {eligibilityCriteria}</p>
            <p><strong>Amount:</strong> {formatEther(amountPerSemester)} ETH per semester</p>
            <p><strong>Remaining Funds:</strong> {formatEther(totalAmount)} ETH</p>
            <p><strong>Status:</strong> {isClaimed ? `Claimed by ${student.slice(0,6)}...` : 'Available'}</p>
            {!isClaimed && (
                <button onClick={() => writeContract({ address: `0x${contractAddress.substring(2)}`, abi: ContractInfo.abi, functionName: 'applyForScholarship', args: [id] })} disabled={isPending}>
                    {isPending ? 'Applying...' : 'Apply Now'}
                </button>
            )}
        </div>
    );
}


export function ScholarshipList() {
  const { data: count, isLoading } = useReadContract({
    address: `0x${contractAddress.substring(2)}`,
    abi: ContractInfo.abi,
    functionName: 'scholarshipCount',
  });
  const [ids, setIds] = useState<bigint[]>([]);

  useEffect(() => {
    if(count) {
        const numCount = Number(count as bigint);
        setIds(Array.from({length: numCount}, (_, i) => BigInt(i + 1)));
    }
  }, [count]);


  if (isLoading) return <p>Loading scholarships...</p>;

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>For Students: Available Scholarships</h2>
      {ids.length > 0 ? ids.map(id => <ScholarshipCard key={id.toString()} id={id} />) : <p>No scholarships created yet.</p>}
    </div>
  );
}