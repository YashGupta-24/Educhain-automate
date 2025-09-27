'use client';
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
// import ContractInfo from '../contracts/EduChainAutomate.json';
import { formatEther } from 'viem';
import { useEffect, useState } from 'react';
import { contractAddress, contractAbi } from '../lib/contract';

// const contractAddress = '0xDA0bab807633f07f013f94DD0E6A4F96F8742B53'; // Your address is here

function ScholarshipCard({ id }: { id: bigint }) {
    const { address } = useAccount();
    const { data: scholarship, isLoading, isError, error } = useReadContract({
        address: `0x${contractAddress.substring(2)}`,
        abi: contractAbi,
        functionName: 'scholarships',
        args: [id],
        watch:true
    });

    const { writeContract, isPending } = useWriteContract();

    if (isLoading) return <div>Loading scholarship #{id.toString()}...</div>;
    if (isError) return <div>Error loading scholarship: {error?.message}</div>;
    if (!scholarship) return null;

    // FIXED THIS LINE: Added 'id_from_contract' to correctly align the variables.
    const [id_from_contract, donor, totalAmount, amountPerSemester, student, isClaimed, eligibilityCriteria] = scholarship as [bigint, string, bigint, bigint, string, boolean, string];

    const isMyScholarship = address && student.toLowerCase() === address.toLowerCase();

    return (
        <div style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', background: isMyScholarship ? 'black' : 'black' }}>
            <h3>Scholarship #{id.toString()}</h3>
            <p><strong>Criteria:</strong> {eligibilityCriteria}</p>
            <p><strong>Amount:</strong> {formatEther(amountPerSemester)} ETH per semester</p>
            <p><strong>Remaining Funds:</strong> {formatEther(totalAmount)} ETH</p>
            <p><strong>Status:</strong> {isClaimed ? `Claimed by ${student.slice(0,6)}...` : 'Available'}</p>
            {!isClaimed && (
                <button onClick={() => writeContract({ 
                    address: `0x${contractAddress.substring(2)}`, 
                    abi: contractAbi,
                    functionName: 'applyForScholarship', 
                    args: [id] 
                })} disabled={isPending}>
                    {isPending ? 'Applying...' : 'Apply Now'}
                </button>
            )}
        </div>
    );
}


export function ScholarshipList() {
  const { data: count, isLoading, isError, error } = useReadContract({
    address: `0x${contractAddress.substring(2)}`,
    abi: contractAbi,
    functionName: 'scholarshipCount',
    watch: true, 
  });

  console.log("Scholarship Count Read:", { count, isLoading, isError, error });


  if (isLoading) return <p>Loading scholarships...</p>;
  if (isError) return <p>Could not fetch scholarships.</p>;

  const numCount = typeof count === 'bigint' ? Number(count) : 0;
  const scholarshipIds = Array.from({ length: numCount }, (_, i) => BigInt(i + 1));

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>For Students: Available Scholarships</h2>
      {scholarshipIds.length > 0 
         ? scholarshipIds.map(id => <ScholarshipCard key={id.toString()} id={id} />) 
         : <p>No scholarships created yet.</p>
      }
    </div>
  );
}