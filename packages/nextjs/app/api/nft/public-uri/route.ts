import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import deployedContracts from "~~/contracts/deployedContracts";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tokenId = searchParams.get("tokenId");
    const contractAddress = searchParams.get("contractAddress");

    if (!tokenId || !contractAddress) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const client = createPublicClient({
      chain: sepolia,
      transport: http(),
    });

    const uri = await client.readContract({
      address: contractAddress as `0x${string}`,
      abi: deployedContracts[11155111].SimpleConfidentialNFT.abi,
      functionName: "publicTokenURI",
      args: [BigInt(tokenId)],
    });

    return NextResponse.json({ uri }, { status: 200 });
  } catch (error) {
    console.error("Error fetching public URI:", error);
    return NextResponse.json({ error: "Failed to fetch public URI" }, { status: 500 });
  }
}