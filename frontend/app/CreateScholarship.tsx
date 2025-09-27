'use client';
import { useState } from 'react';
import { useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
// import ContractInfo from '../contracts/EduChainAutomate.json'; // Import the ABI
import { contractAddress, contractAbi } from '../lib/contract';

export function CreateScholarship() {
  const [criteria, setCriteria] = useState('');
  const [amountPerSemester, setAmountPerSemester] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  // const contractAddress = '0xDA0bab807633f07f013f94DD0E6A4F96F8742B53';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    writeContract({
      address: `0x${contractAddress.substring(2)}`, // Wagmi requires the 0x prefix
      abi: contractAbi,
      functionName: 'createScholarship',
      args: [parseEther(amountPerSemester), criteria],
      value: parseEther(totalAmount), // This is how you send ETH with the transaction
    });
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', marginTop: '2rem' }}>
      <h2>For Donors: Create a Scholarship</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Eligibility Criteria (e.g., "CS Major, GPA `&gt;` 3.5")</label><br />
          <input type="text" value={criteria} onChange={(e) => setCriteria(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }}/>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Amount Per Semester (in ETH)</label><br />
          <input type="text" value={amountPerSemester} onChange={(e) => setAmountPerSemester(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }}/>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Total Funding Amount (in ETH)</label><br />
          <input type="text" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }}/>
        </div>
        <button type="submit" disabled={isPending}>
          {isPending ? 'Confirming...' : 'Create Scholarship'}
        </button>
        {isSuccess && <p style={{ color: 'green' }}>Scholarship created successfully!</p>}
        {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      </form>
    </div>
  );
}