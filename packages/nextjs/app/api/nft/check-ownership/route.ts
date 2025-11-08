import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import deployedContracts from "~~/contracts/deployedContracts";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tokenId = searchParams.get("tokenId");
    const contractAddress = searchParams.get("contractAddress");
    const walletAddress = searchParams.get("walletAddress");

    if (!tokenId || !contractAddress || !walletAddress) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const client = createPublicClient({
      chain: sepolia,
      transport: http(),
    });

    // Get encrypted owner address
    const encryptedOwner = await client.readContract({
      address: contractAddress as `0x${string}`,
      abi: deployedContracts[11155111].SimpleConfidentialNFT.abi,
      functionName: "encryptedOwnerOf",
      args: [BigInt(tokenId)],
    });

    // Note: In a real implementation with FHE, you would need to decrypt the encrypted owner
    // and compare it with the wallet address. For now, we'll use a simplified approach.
    // Since the contract stores encrypted addresses, you might need to implement
    // a server-side decryption mechanism or compare encrypted values.

    // For demonstration, we'll check if the wallet is the contract owner
    // In production, implement proper FHE decryption and comparison
    const contractOwner = await client.readContract({
      address: contractAddress as `0x${string}`,
      abi: deployedContracts[11155111].SimpleConfidentialNFT.abi,
      functionName: "owner",
    });

    // Temporary: Allow contract owner to view all records
    // TODO: Implement proper encrypted owner comparison
    const isOwner = walletAddress.toLowerCase() === (contractOwner as string).toLowerCase();

    return NextResponse.json({ isOwner }, { status: 200 });
  } catch (error) {
    console.error("Error checking ownership:", error);
    return NextResponse.json({ error: "Failed to check ownership", isOwner: false }, { status: 500 });
  }
}